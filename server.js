// Simplified Gemini chatbot backend (no streaming, simple rate limit, SDK usage)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Added: trust proxy for correct IPs behind reverse proxies
app.set('trust proxy', true);

// Added: server-side prompt with ENV override (first-person voice)
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  [
    'You are the portfolio owner speaking in first person (use I/me/my).',
    'Answer concisely (<=120 words) in Markdown and make links clickable with [text](url).',
    'Focus on my projects, skills, experience, and availability.',
    'If asked how to contact me, share the links provided by the client or point to the Contact section of this site.',
    'Be friendly, professional, and helpful.',
  ].join(' ');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

function sanitizeInput(input) {
  return String(input).trim().slice(0, 1500);
}

function getClientIP(req) {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 30000; // 30s
const RATE_LIMIT_MAX_REQUESTS = 2;

// Cleanup old rate limit entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [ip, rl] of rateLimitMap) {
    if (rl.resetTime < now) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 1000);

app.post('/api/chat', async (req, res) => {
  try {
    // Rate limit
    const ip = getClientIP(req);
    const now = Date.now();
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 0, resetTime: now + RATE_LIMIT_WINDOW });
    }
    const rl = rateLimitMap.get(ip);
    if (rl.resetTime < now) {
      rl.count = 0;
      rl.resetTime = now + RATE_LIMIT_WINDOW;
    }
    rl.count++;
    if (rl.count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfter = Math.ceil((rl.resetTime - now) / 1000);
      res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', String(rl.resetTime));
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter,
      });
    }
    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - rl.count);
    console.log(`[Request] IP ${ip} - Remaining: ${remaining}/${RATE_LIMIT_MAX_REQUESTS}`);

    // Moved inside handler: API key lookup and validation
    const apiKey =
      process.env.VITE_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Error] GEMINI API KEY not configured');
      return res.status(500).json({ error: 'AI service not configured' });
    }

    // Validate body
    const { message, history = [], systemPrompt } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Sanitize
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedSystemPrompt = systemPrompt ? sanitizeInput(systemPrompt) : SYSTEM_PROMPT;
    const sanitizedHistory = history.map((h) => ({
      role: h.role,
      parts: [{ text: sanitizeInput(h.parts?.[0]?.text || '') }],
    }));

    // Build Gemini contents with first message as system instruction
    const contents = [
      { role: 'user', parts: [{ text: sanitizedSystemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will assist with your portfolio queries.' }] },
      ...sanitizedHistory,
      { role: 'user', parts: [{ text: sanitizedMessage }] },
    ];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 400,
    };

    const result = await model.generateContentStream({
      contents,
      generationConfig,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      res.write(JSON.stringify({ text: chunkText }) + '\n');
    }
    res.write(JSON.stringify({ done: true, fullText }) + '\n');
    res.end();
    console.log(`[Response] IP ${ip} - Generated ${fullText.length} chars`);
  } catch (error) {
    console.error('[Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    } else {
      res.write(JSON.stringify({ error: 'Stream interrupted', details: error.message }) + '\n');
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
