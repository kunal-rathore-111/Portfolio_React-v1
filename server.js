// Simple Express proxy server for Gemini streaming
// Run separately: node server.js (or add npm script)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createParser } from 'eventsource-parser';
import { systemPrompt } from './src/config/chatConfig.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function sanitizeInput(input) {
    const patterns = [/ignore previous instructions/gi, /system prompt/gi, /you are now/gi];
    let sanitized = input;
    patterns.forEach((p) => (sanitized = sanitized.replace(p, '[REDACTED]')));
    sanitized = sanitized.trim().replace(/\s+/g, ' ');
    if (sanitized.length > 2000) sanitized = sanitized.substring(0, 2000);
    return sanitized;
}

app.post('/api/chat', async (req, res) => {
    try {
        // Rate limit per IP
        const ip = getClientIP(req);
        const rl = checkRateLimit(ip);
        if (!rl.allowed) {
            console.log(`[Rate Limit] IP ${ip} exceeded limit. Requests: ${RATE_LIMIT_MAX_REQUESTS}/${RATE_LIMIT_WINDOW}ms`);
            const retryAfter = Math.ceil(RATE_LIMIT_WINDOW / 1000);
            res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
            res.setHeader('X-RateLimit-Remaining', String(0));
            res.setHeader('X-RateLimit-Reset', String(Date.now() + RATE_LIMIT_WINDOW));
            res.setHeader('Retry-After', String(retryAfter));
            return res.status(429).json({ error: 'Too many requests. Please try again later.', retryAfter });
        }
        console.log(`[Request] IP ${ip} - Remaining: ${rl.remaining}/${RATE_LIMIT_MAX_REQUESTS}`);

        const apiKey = process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Error] GEMINI API KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        const { message, history = [] } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message' });
        }

        // Build Gemini format contents array
        const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I will assist with your portfolio queries.' }] },
            ...history,
            { role: 'user', parts: [{ text: sanitizeInput(message) }] },
        ];

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${apiKey}`;

        const upstream = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        });

        if (!upstream.ok) {
            if (upstream.status === 429) {
                console.error(`[Gemini API] 429 Too Many Requests - likely quota exceeded. Check your API key at https://aistudio.google.com/`);
                const retryAfter = Number(upstream.headers.get('retry-after')) || 60;
                res.setHeader('Retry-After', String(retryAfter));
                return res.status(429).json({ error: 'Gemini API quota exceeded. Try again later or check your API key.', retryAfter });
            }
            console.error(`[Gemini API] Error ${upstream.status}: ${upstream.statusText}`);
            const errorBody = await upstream.text();
            console.error(`[Gemini API] Error body:`, errorBody);
            return res.status(upstream.status).json({ error: 'Gemini API error' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (!upstream.body) {
            return res.status(500).json({ error: 'No response body' });
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();

        const parser = createParser({
            onEvent: (event) => {
                if (event.type === 'event') {
                    const data = JSON.parse(event.data);
                    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        res.write(`data: ${JSON.stringify({ text })}\n\n`);
                    }
                    if (data?.candidates?.[0]?.finishReason) {
                        res.write('data: {"done": true}\n\n');
                    }
                }
            },
        });

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.feed(decoder.decode(value));
        }

        res.write('data: {"done": true}\n\n');
        res.end();
    } catch (error) {
        console.error('Chat proxy error', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
        res.end();
    }
});

const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 8;
const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;
const rateLimitStore = new Map();

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }
    entry.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count };
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`Chat proxy server running on port ${PORT}`));
