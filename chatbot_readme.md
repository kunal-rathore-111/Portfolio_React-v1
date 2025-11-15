# Chatbot: End-to-End Guide

This document explains the chatbot implementation from backend to frontend so you can understand, run, and customize it.

- Backend: [server.js](server.js)
- Frontend widget: [src/components/ChatBubble.jsx](src/components/ChatBubble.jsx)
- UI shell: [src/components/ui/expandable-chat.jsx](src/components/ui/expandable-chat.jsx)
- Config and content: [src/config/chatConfig.js](src/config/chatConfig.js)
- App integration: [src/App.jsx](src/App.jsx)
- Dev proxy: [vite.config.js](vite.config.js)
- Scripts: [package.json](package.json)

---

## Quick Start

1) Install dependencies
```sh
npm i
```

2) Create .env (or update [.env](.env)) with your keys
```env
# One of these must be set
VITE_GEMINI_API_KEY=your_key_here
# or
GEMINI_API_KEY=your_key_here
# or
GOOGLE_API_KEY=your_key_here

# Optional
PORT=5000
CORS_ORIGIN=http://localhost:5173
SYSTEM_PROMPT=You are the portfolio owner...
```

3) Ensure Vite dev proxy points to your server port (default 5000). In [vite.config.js](vite.config.js), set:
```js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000", // important: match PORT/.env
      changeOrigin: true,
      secure: false,
    },
  },
},
```

4) Run backend and frontend (two terminals)
```sh
npm run server
npm run dev
```

5) Open http://localhost:5173 — the floating widget appears at the bottom-right.

---

## Architecture: Request Flow

1) User sends a message in the widget.
2) Frontend POSTs to POST /api/chat with:
   - message: string
   - history: last 10 turns (role + parts.text)
   - systemPrompt: optional override
3) Backend validates, rate-limits, builds Gemini request, and streams newline-delimited JSON (NDJSON).
4) Frontend parses the stream, incrementally updates the bot message.
5) On completion, bot message is finalized and streaming stops.

---

## Part 1 — Backend (server.js)

Location: [server.js](server.js)

### Overview

- Framework: Express
- Model: Gemini 2.0 Flash via @google/generative-ai
- Transport: Streaming response as NDJSON
- Protections: CORS, input sanitization, IP-based rate limiting, trust proxy
- Endpoint: POST /api/chat

### Key environment variables

- VITE_GEMINI_API_KEY or GEMINI_API_KEY or GOOGLE_API_KEY: at least one must be set.
- SYSTEM_PROMPT: optional server-side first-person system instruction.
- CORS_ORIGIN: allowed origin for dev, default http://localhost:5173.
- PORT: server port, default 5000.

### Important code points

- CORS and JSON parsing
  - CORS configured to CORS_ORIGIN; only POST/OPTIONS allowed.
  - JSON body parsing enabled.

- Trust proxy
  - app.set('trust proxy', true) helps correct client IPs behind proxies.

- Input sanitation
  - [`sanitizeInput`](server.js): trims and caps length to 1500 chars.
  - [`getClientIP`](server.js): extracts req.ip or socket address.

- Rate limiting
  - Uses [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)
  - Window: configurable via `RATE_LIMIT_WINDOW_MS` (default 60000 ms = 1 min)
  - Max requests/window: configurable via `RATE_LIMIT_MAX_REQUESTS` (default 8)
  - On limit exceeded, returns 429 with JSON body: `{ error, retryAfter }`
  - Standard rate limit headers are sent

- System prompt
  - Server has a default first-person prompt (SYSTEM_PROMPT).
  - If the client sends systemPrompt in the request body, it overrides the default for that request.

- Request schema
```json
{
  "message": "string",
  "history": [
    { "role": "user" | "model", "parts": [{ "text": "..." }] }
  ],
  "systemPrompt": "optional string"
}
```

- Building Gemini contents
  - First message: systemPrompt as user
  - Second: model acknowledgment: “Understood…”
  - Next: prior history (role, parts.text)
  - Finally: the new user message

- Model and config
  - Model: gemini-2.0-flash
  - generationConfig: temperature 0.7, topP 0.9, topK 40, maxOutputTokens 400

- Streaming response
  - Headers: Content-Type text/plain; Transfer-Encoding chunked; Cache-Control no-cache
  - Iterates result.stream and writes lines like:
    - {"text":"partial chunk"}
    - ...
    - {"done":true,"fullText":"final text"}

- Error handling
  - 400 for invalid message
  - 429 for rate limit
  - 500 for server/model errors
  - Logs remaining requests and response sizes

### Test with curl

```sh
curl -N -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about your projects"}' \
  http://localhost:5000/api/chat
```

Expect newline-delimited JSON objects. The last line includes {"done":true,...}.

---

## Part 2 — Frontend (React widget)

Main component: [src/components/ChatBubble.jsx](src/components/ChatBubble.jsx)

Aux UI shell: [src/components/ui/expandable-chat.jsx](src/components/ui/expandable-chat.jsx)
- [`ExpandableChat`](src/components/ui/expandable-chat.jsx), [`ExpandableChatHeader`](src/components/ui/expandable-chat.jsx), [`ExpandableChatBody`](src/components/ui/expandable-chat.jsx), [`ExpandableChatFooter`](src/components/ui/expandable-chat.jsx)

Avatar UI: [src/components/ui/avatar.jsx](src/components/ui/avatar.jsx)

Content/config: [src/config/chatConfig.js](src/config/chatConfig.js)
- [`heroConfig`](src/config/chatConfig.js), [`systemPrompt`](src/config/chatConfig.js), [`chatSuggestions`](src/config/chatConfig.js)

Integrated in app at: [src/App.jsx](src/App.jsx)

### UI/State

- Floating bubble using ExpandableChat
- Initial bot greeting seeded from [`heroConfig.name`](src/config/chatConfig.js)
- State: messages[], input, loading, cooldown, scrollRef
- Markdown rendering via react-markdown

### Sending a message

- History compaction
  - Last 10 messages are mapped to Gemini history format:
    - role: 'user' or 'model'
    - parts: [{ text }]

- API base resolution
  - Looks for VITE_API_BASE
  - If not set:
    - In localhost: uses http://localhost:5000/api
    - Else: uses /api (expects reverse proxy in prod)
  - Tip: When using Vite dev proxy, set target in [vite.config.js](vite.config.js) to your server port (5000 by default).

- POST request shape
```json
{
  "message": "your text",
  "history": [{ "role": "...", "parts": [{ "text": "..." }] }],
  "systemPrompt": "value from config (optional)"
}
```

- Error handling
  - If non-OK, tries to parse JSON body for { error, retryAfter }
  - 429: sets client-side cooldown (seconds)
  - Shows brief error message in chat

### Streaming parser (NDJSON)

Inside [src/components/ChatBubble.jsx](src/components/ChatBubble.jsx):

- Uses response.body.getReader() + TextDecoder
- Splits decoded chunks by newline
- For each line:
  - Parse JSON
  - If it has data.text: append to bot message, keep isStreaming=true
  - If data.done: finalize isStreaming=false
- This is resilient to partial chunk boundaries

### Cooldown UX

- When server returns 429, UI disables input and shows “Please wait {cooldown}s…”
- A timer decrements cooldown every second.

### Keyboard UX

- Press Enter to send; Shift+Enter to insert newline.

### Config and content

See [src/config/chatConfig.js](src/config/chatConfig.js):

- `about`, `heroConfig`, `experiences`, `projects`, `socialLinks`
- `generateSystemPrompt()` creates a compact, first-person prompt from your data.
- `systemPrompt` is exported and used by the chat widget.
- `chatSuggestions` shown as quick chips when chat is empty.

Customize these with your real data:
- Replace placeholder name and description in `about`.
- Update `skills`, `experiences`, `projects`, `socialLinks`.

Note on prompts:
- Server has its own SYSTEM_PROMPT. The client can override per-request via body.systemPrompt (the widget sends the generated prompt by default). You can remove that field if you prefer only the server prompt.

### App integration

In [src/App.jsx](src/App.jsx), the widget is rendered globally:
```jsx
<ChatBubble />
```
It uses the existing Tailwind theme and appears above page content.

---

## Customization

- Model/tuning (backend)
  - Change model id or generationConfig in [server.js](server.js).

- **Rate limit (backend)**
  - Tweak `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` in `.env`
  - See [server.js](server.js) for `express-rate-limit` usage

- System prompt (server)
  - Set SYSTEM_PROMPT in .env for a consistent global voice.

- System prompt (client)
  - Edit `generateSystemPrompt()` in [src/config/chatConfig.js](src/config/chatConfig.js) or stop sending it from the client.

- Branding/content
  - Update `heroConfig`, `about`, `projects`, `socialLinks` in [src/config/chatConfig.js](src/config/chatConfig.js).

- Position/size (frontend)
  - Props on [`ExpandableChat`](src/components/ui/expandable-chat.jsx): position ('bottom-right', etc.), size ('sm'|'md'|'lg').

---

## Troubleshooting

- 401/403/500 from /api/chat
  - Ensure a valid API key is in .env. Restart the server after changes.

- 429: “Too many requests”
  - Wait for cooldown (Retry-After from server). Defaults: 2 requests per 30s per IP.

- CORS error in browser console
  - Set CORS_ORIGIN to the exact dev origin (e.g., http://localhost:5173).

- Proxy not working (404 on /api)
  - Ensure [vite.config.js](vite.config.js) proxy target is your server port, e.g., http://localhost:5000.
  - Alternatively, set VITE_API_BASE in .env to your full API URL.

- Streaming never completes
  - Check browser extensions that may buffer streams.
  - Inspect Network tab; ensure response shows NDJSON lines.

- Production deploy
  - Behind a reverse proxy, keep `app.set('trust proxy', true)`.
  - Use VITE_API_BASE to a deployed API URL or rely on a reverse-proxied /api route.

---

## Reference: Important symbols

- Backend
  - [`sanitizeInput`](server.js)
  - [`getClientIP`](server.js)

- Frontend
  - [`ExpandableChat`](src/components/ui/expandable-chat.jsx)
  - [`ExpandableChatHeader`](src/components/ui/expandable-chat.jsx)
  - [`ExpandableChatBody`](src/components/ui/expandable-chat.jsx)
  - [`ExpandableChatFooter`](src/components/ui/expandable-chat.jsx)
  - [`Avatar`](src/components/ui/avatar.jsx), `AvatarImage`, `AvatarFallback`
  - [`systemPrompt`](src/config/chatConfig.js), [`heroConfig`](src/config/chatConfig.js), [`chatSuggestions`](src/config/chatConfig.js)

---

## Commands

- Run dev UI: `npm run dev` ([package.json](package.json))
- Run backend: `npm run server` ([package.json](package.json))

That’s it. You now have a complete picture of the chatbot, from request to response, and how to adapt it to your portfolio.