import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rateLimit from 'express-rate-limit'; // <-- Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Added: trust proxy for reverse proxies
const isTrustProxy = process.env.isTrustProxy ? true : false;
app.set('trust proxy', isTrustProxy);

// Added: server-side prompt with ENV override (first-person voice)
const SYSTEM_PROMPT = [
  'You are the portfolio owner speaking in first person (use I/me/my).',
  'Answer concisely (<=120 words) in Markdown and make links clickable with [text](url with underline).',
  'Focus on my projects, skills, experience, and availability.',
  'If asked how to contact me, share the links provided by the client or point to the Contact section of this site.',
  'Be friendly, professional, and helpful.',
].join(' ');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

function sanitizeInput(input) {
  return String(input).trim().slice(0, 1500);
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
}

// Remove custom rate limit logic here

// Add express-rate-limit middleware
const chatLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 30s
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 8, // default 8 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: (req, res) => {
    return {
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
    };
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message(req, res));
  },
});

// Apply rate limiter to chat endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    // Moved inside handler: API key lookup and validation
    const apiKey = process.env.VITE_GEMINI_API_KEY;
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
    console.log(`[Response] Generated ${fullText.length} chars`);
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
