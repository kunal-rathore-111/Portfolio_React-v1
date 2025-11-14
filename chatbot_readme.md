@workspace create a doc in which having all info relevant to chat bot implementation, this doc must have everything whihch teach concept to design to code and why that code line written and what that code line do everything for all the chatbot code the frontned backend all

Workspace
Collecting workspace information

# Comprehensive ChatBot Implementation Documentation

## Table of Contents
1. [Concept & Architecture](#concept--architecture)
2. [Design Decisions](#design-decisions)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Configuration](#configuration)
6. [Integration with Portfolio](#integration-with-portfolio)
7. [Complete Code Walkthrough](#complete-code-walkthrough)
8. [Deployment & Testing](#deployment--testing)

---

## Concept & Architecture

### What is this ChatBot?
A **Portfolio Assistant ChatBot** that helps visitors learn about the portfolio owner's skills, projects, and experience through natural conversation using AI (Google's Gemini API).

### Architecture Overview
```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│  [ChatBubble.jsx] - Floating chat widget with UI        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP POST Request (Streaming)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend Server                         │
│  [server.js] - Express.js API with streaming response   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Call
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Google Gemini AI API                        │
│  Generates intelligent responses about portfolio        │
└─────────────────────────────────────────────────────────┘
```

---

## Design Decisions

### Why This Architecture?

1. **Separation of Concerns**: Frontend handles UI/UX, Backend handles AI logic
   - **Why**: Security (API keys), scalability, and maintainability

2. **React Component-Based**: Uses shadcn/ui expandable chat component
   - **Why**: Reusable, accessible, and modern UI components

3. **Google Gemini API**: Chosen AI provider
   - **Why**: Free tier, good performance, context-aware responses

4. **Express.js Backend**: Simple Node.js server
   - **Why**: Lightweight, easy to deploy, handles async requests well

5. **Streaming Responses**: Real-time token-by-token display
   - **Why**: Better UX, feels more responsive, reduces perceived latency

6. **Rate Limiting**: Server-side rate limiting with IP tracking
   - **Why**: Prevent API abuse, manage costs, fair usage

---

## Frontend Implementation

### Component Structure

```
src/components/
├── ChatBubble.jsx          # Main chat component
├── ui/
│   ├── expandable-chat.jsx # Chat container UI
│   ├── avatar.jsx          # User/Bot avatars
│   ├── button.jsx          # Send button
│   ├── input.jsx           # Message input
│   └── scroll-area.jsx     # Scrollable message area
src/assets/icons/
├── ChatBubbleIcon.jsx      # Chat bubble icon
└── SendIcon.jsx            # Send message icon
src/config/
└── chatConfig.js           # Configuration (prompts, suggestions)
```

---

## Complete Code Walkthrough

### 1. ChatBubble.jsx - Main Component

#### Imports Explanation

```jsx
import React, { useEffect, useRef, useState } from 'react';
```
- **React**: Core library for building the component
- **useEffect**: Side effects (auto-scroll, timers)
- **useRef**: Reference DOM elements (scroll container)
- **useState**: Manage component state (messages, loading, cooldown)

```jsx
import ChatBubbleIcon from '@/assets/icons/ChatBubbleIcon.jsx';
import SendIcon from '@/assets/icons/SendIcon.jsx';
```
- **Custom Icons**: SVG icons for chat bubble and send button
- **Why Custom**: Consistent design language across portfolio

```jsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ExpandableChat, ExpandableChatBody, ExpandableChatFooter, ExpandableChatHeader } from '@/components/ui/expandable-chat.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
```
- **shadcn/ui Components**: Pre-built, accessible UI components
- **Why shadcn/ui**: Highly customizable, TypeScript support, follows best practices

```jsx
import { chatSuggestions, systemPrompt, heroConfig } from '@/config/chatConfig.js';
```
- **Configuration Import**: Centralized config for easy updates
- **Contains**: AI system prompt, suggested questions, portfolio owner info

```jsx
import ReactMarkdown from 'react-markdown';
```
- **Markdown Rendering**: AI responses often use markdown formatting
- **Why**: Allows **bold**, *italic*, lists, code blocks in responses

```jsx
import { cn } from '@/lib/utils';
```
- **Utility Function**: Combines CSS class names conditionally
- **Why**: Clean conditional styling (e.g., different colors for user/bot messages)

#### State Management

```jsx
const initialMessages = [
    {
        id: 1,
        text: "Hello! I'm your Portfolio Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
];
```
- **Purpose**: Welcome message shown when chat opens
- **Structure**: Each message has `id`, `text`, `sender`, `timestamp`
- **Why**: User sees friendly greeting immediately

```jsx
const [messages, setMessages] = useState(initialMessages);
```
- **State**: Array of all chat messages
- **Initial Value**: Starts with welcome message
- **Updates**: New messages added when user/bot sends

```jsx
const [newMessage, setNewMessage] = useState('');
```
- **State**: Current text in input field
- **Updates**: Changes as user types
- **Reset**: Cleared after sending message

```jsx
const [isLoading, setIsLoading] = useState(false);
```
- **State**: Whether AI is generating response
- **Purpose**: Show loading indicator, disable send button
- **Flow**: `false` → `true` (after send) → `false` (after response)

```jsx
const [cooldownSeconds, setCooldownSeconds] = useState(0);
```
- **State**: Remaining seconds until next message allowed
- **Purpose**: Rate limiting to prevent spam
- **Value**: 0 = can send, >0 = must wait

```jsx
const scrollAreaRef = useRef(null);
```
- **Ref**: Direct reference to scroll container DOM element
- **Purpose**: Programmatically scroll to bottom when new message arrives
- **Why Ref**: Direct DOM manipulation needed for scrolling

#### Auto-Scroll Effect

```jsx
useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }
}, [messages]);
```
- **Trigger**: Runs whenever `messages` array changes
- **Purpose**: Auto-scroll to show newest message
- **How**:
  1. Check if ref exists (`scrollAreaRef.current`)
  2. Find internal scroll viewport (Radix UI implementation detail)
  3. Set `scrollTop` to `scrollHeight` (scroll to bottom)
- **Why useEffect**: Side effect that needs to run after render

#### Cooldown Timer Effect

```jsx
useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
        setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
}, [cooldownSeconds]);
```
- **Trigger**: Runs when `cooldownSeconds` changes
- **Purpose**: Count down remaining cooldown seconds
- **How**:
  1. If cooldown is 0 or less, do nothing (early return)
  2. Create interval that decrements every 1 second
  3. Update state using functional update `(s) => s - 1`
  4. Cleanup: Clear interval when component unmounts or cooldown changes
- **Why Functional Update**: Ensures latest state value is used (avoids stale closures)

#### Send Message Handler - STREAMING VERSION

```jsx
const sendMessage = async (messageText, botMessageId) => {
```
- **Function**: Handles sending user message and streaming AI response
- **Parameters**: 
  - `messageText`: User's message
  - `botMessageId`: ID of bot message to update during streaming
- **Async**: Uses `await` for API calls

```jsx
    try {
        const history = messages.slice(-10).map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));
```
- **Conversation History**:
  - `slice(-10)`: Only send last 10 messages (context limit)
  - **Transform**: Convert from app format to Gemini API format
    - `sender` → `role` ('user' or 'model')
    - Wrap text in `parts` array with object structure
- **Why**: Provides context for AI to maintain conversation flow

```jsx
        const apiBase = import.meta.env.VITE_API_BASE || '/api';
        const response = await fetch(`${apiBase}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText, history }),
        });
```
- **API Call**:
  - **URL**: Uses environment variable or defaults to `/api/chat`
  - **Method**: POST (sending data)
  - **Headers**: Tell server we're sending JSON
  - **Body**: Send message and conversation history
- **Why Environment Variable**: Allows different URLs for dev/prod

```jsx
        if (!response.ok) {
            let errorText = `HTTP error! status: ${response.status}`;
            try {
                const data = await response.json();
                if (response.status === 429) {
                    const retryAfter = data?.retryAfter ?? 30;
                    setCooldownSeconds(Number(retryAfter));
                    errorText = `Too many requests. Please wait ${retryAfter}s and try again.`;
                } else if (data?.error) {
                    errorText = data.error;
                }
            } catch (_) {
                // If JSON parsing fails, use default error text
            }
            throw new Error(errorText);
        }
```
- **Error Handling for HTTP Errors**:
  - Check if response is not OK (status 200-299)
  - **429 Status**: Rate limit exceeded
    - Extract `retryAfter` from response
    - Set cooldown timer
    - Show specific error message
  - **Other Errors**: Use error from response or default message
- **Why Try-Catch Inside**: JSON parsing might fail, use fallback

```jsx
        if (response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
```
- **Streaming Setup**:
  - **getReader()**: Access stream of data from response
  - **TextDecoder**: Convert binary stream chunks to text
  - **accumulatedText**: Build up complete response as chunks arrive
- **Why Streaming**: Display response token-by-token as AI generates it

```jsx
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    setMessages((prev) =>
                        prev.map((msg) => 
                            msg.id === botMessageId 
                                ? { ...msg, text: accumulatedText, isStreaming: false } 
                                : msg
                        )
                    );
                    break;
                }
```
- **Stream Reading Loop**:
  - **reader.read()**: Get next chunk from stream
  - **done**: `true` when stream ends
  - **value**: Chunk of data (Uint8Array)
  - **When done**: Update message to mark streaming as complete, exit loop

```jsx
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter((line) => line.trim() !== '');
```
- **Process Chunk**:
  - **decode()**: Convert binary to text
  - `{ stream: true }`: Handle multi-byte characters across chunks
  - **split('\n')**: Server sends one JSON object per line
  - **filter**: Remove empty lines

```jsx
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.text) {
                            accumulatedText += data.text;
                            setMessages((prev) =>
                                prev.map((msg) => 
                                    msg.id === botMessageId 
                                        ? { ...msg, text: accumulatedText, isStreaming: true } 
                                        : msg
                                )
                            );
                        }
```
- **Parse and Display Each Token**:
  - **JSON.parse(line)**: Convert JSON string to object
  - **data.text**: The AI-generated token
  - **Accumulate**: Add new token to existing text
  - **Update UI**: Find bot message by ID and update its text
  - **isStreaming: true**: Indicates message is still being generated

```jsx
                        if (data.done) {
                            setMessages((prev) =>
                                prev.map((msg) => 
                                    msg.id === botMessageId 
                                        ? { ...msg, text: accumulatedText, isStreaming: false } 
                                        : msg
                                )
                            );
                            break;
                        }
                    } catch (err) {
                        continue; // Skip malformed JSON chunks
                    }
                }
            }
        }
```
- **Completion Handling**:
  - **data.done**: Server signals end of response
  - **Final Update**: Mark streaming as false
  - **Error Handling**: Skip invalid JSON chunks without crashing

```jsx
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === botMessageId
                    ? {
                        ...msg,
                        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
                        isStreaming: false,
                    }
                    : msg
            )
        );
    } finally {
        setIsLoading(false);
        setNewMessage('');
    }
};
```
- **Error Handling**:
  - **catch**: Network errors, parsing errors, etc.
  - **Update Message**: Replace with error message instead of throwing
  - **User-Friendly**: Clear message about what went wrong
- **finally**: Always runs, even if error occurred
  - Hide loading indicator
  - Clear input field

#### Main Send Handler

```jsx
const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading || cooldownSeconds > 0) return;

    const messageText = newMessage.trim();
    const userMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    const botMessageId = Date.now() + 1;
    const botMessage = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
    };
    setMessages((prev) => [...prev, botMessage]);

    await sendMessage(messageText, botMessageId);
};
```
- **Flow**:
  1. **Validate**: Check message isn't empty, not already loading, no cooldown
  2. **Create User Message**: With timestamp and unique ID
  3. **Add to UI**: Immediately show user's message
  4. **Clear Input**: Reset input field
  5. **Show Loading**: Set loading state
  6. **Create Empty Bot Message**: Placeholder that will fill during streaming
  7. **Call Streaming Function**: Pass message text and bot message ID

#### Suggestion Click Handler

```jsx
const handleSuggestionClick = (suggestion) => {
    if (isLoading || cooldownSeconds > 0) return;
    setNewMessage(suggestion);
};
```
- **Purpose**: Pre-fill input with suggested question
- **Validation**: Don't allow if loading or in cooldown
- **Flow**: User clicks suggestion → Input filled → User can edit → User presses send
- **Why Not Auto-Send**: Gives user chance to modify question

#### Key Press Handler

```jsx
const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
};
```
- **Purpose**: Send message on Enter key
- **!e.shiftKey**: Allow Shift+Enter for multiline (though single-line input)
- **preventDefault()**: Stop default form submission behavior

#### Render UI - Header

```jsx
return (
    <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<ChatBubbleIcon />}
    >
        <ExpandableChatHeader className="flex-col text-center justify-center">
            <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={heroConfig.avatar} alt={heroConfig.name} />
                <AvatarFallback>{heroConfig.fallback}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-lg font-semibold">{heroConfig.name}</p>
                <p className="text-sm text-muted-foreground">{heroConfig.tagline}</p>
            </div>
        </ExpandableChatHeader>
```
- **Container**: Floating, expandable chat widget
  - `size="lg"`: Large size for comfortable reading
  - `position="bottom-right"`: Standard chat position
  - `icon`: Custom chat bubble icon
- **Header**:
  - **Avatar**: Profile picture with fallback to initials
  - **Name & Tagline**: Portfolio owner info
  - **Styling**: Centered, clear hierarchy

#### Render UI - Messages

```jsx
        <ExpandableChatBody>
            <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4">
                <div className="flex flex-col gap-4">
                    {messages.map((message) => (
                        <div key={message.id}>
                            <div
                                className={cn(
                                    'flex items-start gap-3',
                                    message.sender === 'user' && 'flex-row-reverse'
                                )}
                            >
```
- **Body**: Scrollable message area
  - Fixed height (400px)
  - Padding for spacing
- **Message List**: Map over messages array
  - **key**: Unique ID for React reconciliation
  - **Conditional Layout**: 
    - Bot: Avatar on left, message on right
    - User: Message on left (reversed with `flex-row-reverse`)

```jsx
                                {message.sender === 'bot' && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={heroConfig.avatar} alt="AI" />
                                        <AvatarFallback>{heroConfig.fallback}</AvatarFallback>
                                    </Avatar>
                                )}
```
- **Bot Avatar**: Only show for bot messages
  - `flex-shrink-0`: Prevent avatar from shrinking

```jsx
                                <div className="flex flex-col gap-1 max-w-[80%]">
                                    <div
                                        className={cn(
                                            'rounded-2xl px-4 py-2.5 break-words',
                                            message.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                        )}
                                    >
```
- **Message Bubble**:
  - Max width 80% (prevents full-width)
  - Rounded corners
  - Padding
  - **break-words**: Wrap long text
  - **Conditional Colors**:
    - User: Primary theme color (blue)
    - Bot: Muted gray

```jsx
                                        {message.text ? (
                                            <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                                                {message.text}
                                            </ReactMarkdown>
                                        ) : (
                                            message.isStreaming && <span className="text-muted-foreground">Thinking...</span>
                                        )}
                                    </div>
```
- **Message Content**:
  - **If text exists**: Render with markdown support
    - `prose`: Tailwind Typography styling
    - `dark:prose-invert`: Dark mode colors
  - **If empty + streaming**: Show "Thinking..."
  - **Why Conditional**: Empty message during initial streaming

```jsx
                                    <p className={cn(
                                        'text-xs mt-1',
                                        message.sender === 'user' ? 'text-secondary' : 'text-muted-foreground'
                                    )}>
                                        {message.timestamp}
                                    </p>
```
- **Timestamp**: Small text showing when message sent
  - Different colors for user/bot

#### Render UI - Suggestions

```jsx
                        {messages.length === 1 && !isLoading && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground px-3">Quick questions:</p>
                                <div className="flex flex-wrap gap-2 px-3">
                                    {chatSuggestions.map((suggestion, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            disabled={cooldownSeconds > 0}
                                            className="text-xs h-8 px-3 bg-background hover:bg-muted border-muted-foreground/20"
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
```
- **Suggestions Display**:
  - **Condition**: Only show when just welcome message + not loading
  - **Purpose**: Help users get started
  - **Styling**: Small buttons with hover effect
  - **Disabled**: During cooldown

#### Render UI - Footer

```jsx
            <ExpandableChatFooter>
                {cooldownSeconds > 0 && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 text-center">
                        Rate limited. Please wait {cooldownSeconds}s...
                    </p>
                )}
                <div className="flex space-x-2">
                    <Input
                        placeholder="Ask me about my work and experience..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading || cooldownSeconds > 0}
                        className="flex-1"
                    />
                    <Button
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isLoading || cooldownSeconds > 0}
                    >
                        <SendIcon className="h-4 w-4" />
                    </Button>
                </div>
            </ExpandableChatFooter>
```
- **Footer**:
  - **Cooldown Warning**: Shows if rate limited
    - Amber/yellow color for attention
    - Shows remaining seconds
  - **Input Field**:
    - Controlled component (value from state)
    - Updates on change
    - Handles Enter key
    - Disabled during loading/cooldown
  - **Send Button**:
    - Icon only (small size)
    - Disabled when empty, loading, or cooldown

---

## Backend Implementation

### server.js - Complete Walkthrough

#### Imports and Configuration

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
```
- **express**: Web framework for creating API
- **cors**: Allow cross-origin requests (frontend on different port/domain)
- **dotenv**: Load environment variables from `.env` file
- **GoogleGenerativeAI**: Official Gemini AI SDK

```javascript
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
```
- **config()**: Load `.env` file into `process.env`
- **app**: Express application instance
- **PORT**: Use env variable or default 5000

#### CORS Setup

```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['POST', 'OPTIONS'],
    credentials: true,
}));
```
- **origin**: Which domains can access API
  - Default: Vite dev server (5173)
  - Production: Set via environment variable
- **methods**: Allow POST (send data) and OPTIONS (preflight check)
- **credentials**: Allow cookies/auth headers
- **Why**: Browser blocks cross-origin requests by default

```javascript
app.use(express.json());
```
- **Middleware**: Parse JSON request bodies
- **Effect**: `req.body` contains parsed JavaScript object
- **Why**: We send JSON from frontend

#### Input Sanitization

```javascript
function sanitizeInput(input) {
    const patterns = [
        /ignore previous instructions/gi,
        /system prompt/gi,
        /you are now/gi
    ];
    let sanitized = input;
    patterns.forEach((p) => (sanitized = sanitized.replace(p, '[REDACTED]')));
    sanitized = sanitized.trim().replace(/\s+/g, ' ');
    if (sanitized.length > 2000) sanitized = sanitized.substring(0, 2000);
    return sanitized;
}
```
- **Purpose**: Prevent prompt injection attacks
- **Patterns**: Common injection phrases
  - "ignore previous instructions"
  - "system prompt"
  - "you are now"
- **Redaction**: Replace patterns with [REDACTED]
- **Normalization**: Trim, collapse multiple spaces
- **Length Limit**: Max 2000 characters (prevent abuse)
- **Why**: Security against malicious users trying to manipulate AI

#### IP Address Extraction

```javascript
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0].trim() 
        || req.socket.remoteAddress 
        || 'unknown';
}
```
- **Purpose**: Get user's IP address for rate limiting
- **x-forwarded-for**: Used by proxies/load balancers
  - Can be comma-separated list, take first
- **Fallback**: Direct socket address
- **Last Resort**: 'unknown'
- **Why**: Track requests per user, not globally

#### Rate Limiting

```javascript
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 30000; // 30 seconds
const RATE_LIMIT_MAX_REQUESTS = 2;
```
- **rateLimitMap**: Store request counts per IP
  - Key: IP address
  - Value: { count, resetTime }
- **Window**: 30 seconds between rate limit resets
- **Max Requests**: 2 requests per window
- **Why Map**: In-memory storage (fast, simple for single-server setup)

```javascript
// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (data.resetTime < now) {
            rateLimitMap.delete(ip);
        }
    }
}, 60000); // Clean every 60 seconds
```
- **Cleanup**: Remove expired entries every minute
- **Purpose**: Prevent memory leak from storing old IPs
- **Why**: Map would grow indefinitely without cleanup

#### Chat Endpoint

```javascript
app.post('/api/chat', async (req, res) => {
    try {
        const ip = getClientIP(req);
```
- **Route**: POST to `/api/chat`
- **Async**: Handle asynchronous AI generation
- **Get IP**: For rate limiting

##### Rate Limit Check

```javascript
        const now = Date.now();
        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 0, resetTime: now + RATE_LIMIT_WINDOW });
        }
        const rl = rateLimitMap.get(ip);
        if (rl.resetTime < now) {
            rl.count = 0;
            rl.resetTime = now + RATE_LIMIT_WINDOW;
        }
```
- **Initialize**: If IP not in map, add with count 0
- **Reset Check**: If window expired, reset count and time
- **Why Reset**: Allow requests after cooldown period

```javascript
        rl.count++;
        if (rl.count > RATE_LIMIT_MAX_REQUESTS) {
            const retryAfter = Math.ceil((rl.resetTime - now) / 1000);
            res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
            res.setHeader('X-RateLimit-Remaining', '0');
            res.setHeader('X-RateLimit-Reset', String(Date.now() + RATE_LIMIT_WINDOW));
            res.setHeader('Retry-After', String(retryAfter));
            return res.status(429).json({ 
                error: 'Too many requests. Please try again later.', 
                retryAfter 
            });
        }
        console.log(`[Request] IP ${ip} - Remaining: ${rl.remaining}/${RATE_LIMIT_MAX_REQUESTS}`);
```
- **Increment**: Count this request
- **Check Limit**: If exceeded, return 429 (Too Many Requests)
- **Headers**: 
  - Standard rate limit headers
  - `Retry-After`: Seconds until can retry
- **Response**: JSON with error and retry time
- **Logging**: Track remaining requests
- **Why 429**: Standard HTTP status for rate limiting

##### Input Validation

```javascript
        const apiKey = process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Error] GEMINI API KEY not configured');
            return res.status(500).json({ error: 'AI service not configured' });
        }

        const { message, history = [] } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message' });
        }
```
- **API Key Check**: Ensure configured
  - If missing, return 500 (Server Error)
- **Extract Data**: Get message and history
  - Default history to empty array
- **Validate Message**: Must exist and be string
  - If invalid, return 400 (Bad Request)
- **Why Separate**: Different error codes for different issues

##### Sanitize Input

```javascript
        const sanitizedMessage = sanitizeInput(message);
        const sanitizedHistory = history.map((h) => ({
            role: h.role,
            parts: [{ text: sanitizeInput(h.parts?.[0]?.text || '') }],
        }));
```
- **Sanitize Message**: Clean user input
- **Sanitize History**: Clean each history message
  - Preserve structure (role, parts)
  - Sanitize text content
  - Handle missing parts gracefully (`|| ''`)
- **Why**: Prevent injection in history too

##### Build Gemini Conversation

```javascript
        const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Understood. I will assist with your portfolio queries.' }] },
            ...sanitizedHistory,
            { role: 'user', parts: [{ text: sanitizedMessage }] },
        ];
```
- **System Prompt**: First message sets AI behavior
  - Sent as user message
  - Followed by model acknowledgment
- **History**: Include sanitized conversation history
- **Current Message**: Add user's current message
- **Format**: Gemini expects specific structure
  - `role`: 'user' or 'model'
  - `parts`: Array of content objects
  - Each part has `text` field

##### Initialize AI Client

```javascript
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```
- **genAI**: Client instance for Gemini API
- **model**: Specific model to use
  - `gemini-1.5-flash`: Fast, efficient, good for chat
  - Alternative: `gemini-pro` (more capable, slower)
- **Why Flash**: Better latency for interactive chat

##### Configure and Stream

```javascript
        const generationConfig = {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 500,
        };

        const result = await model.generateContentStream({
            contents,
            generationConfig,
        });
```
- **Generation Config**:
  - **temperature (0.7)**: Creativity level
    - 0 = deterministic, 1 = very creative
    - 0.7 = balanced, coherent yet varied
  - **topP (0.9)**: Nucleus sampling
    - Consider top 90% probability tokens
    - Controls randomness
  - **topK (40)**: Top-K sampling
    - Consider top 40 tokens
    - Further controls diversity
  - **maxOutputTokens (500)**: Limit response length
    - ~375 words
    - Cost control
- **generateContentStream**: Start streaming generation
  - Returns async iterator
  - Yields chunks as generated

##### Stream Response to Client

```javascript
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
```
- **Headers**:
  - **Content-Type**: Plain text (newline-delimited JSON)
  - **Transfer-Encoding**: Chunked (stream)
  - **Cache-Control**: Don't cache streaming response
  - **Connection**: Keep connection open
- **Why**: Enable HTTP streaming to client

```javascript
        let fullText = '';
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            res.write(JSON.stringify({ text: chunkText }) + '\n');
        }
```
- **Iterate Stream**: Loop over each chunk
- **Extract Text**: Get text from chunk object
- **Accumulate**: Build full response
- **Send to Client**: Write JSON + newline
  - Format: `{"text":"token"}\n`
  - Newline allows client to parse line-by-line
- **Why**: Real-time streaming, not waiting for completion

```javascript
        res.write(JSON.stringify({ done: true, fullText }) + '\n');
        res.end();
        console.log(`[Response] IP ${ip} - Generated ${fullText.length} chars`);
```
- **Completion Signal**: Send done message
  - Includes full text (optional, for backup)
- **End Response**: Close connection
- **Logging**: Track response size
- **Why done**: Client knows streaming finished

##### Error Handling

```javascript
    } catch (error) {
        console.error('[Error]', error.message);
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Failed to generate response', 
                details: error.message 
            });
        } else {
            res.write(JSON.stringify({ 
                error: 'Stream interrupted', 
                details: error.message 
            }) + '\n');
            res.end();
        }
    }
});
```
- **Catch Errors**: Network issues, API errors, etc.
- **Log**: Print error for debugging
- **Check Headers**: If response already started streaming
  - **Before**: Send JSON error
  - **After**: Write error in stream format, end
- **Why**: Can't change headers after sending starts

#### Server Start

```javascript
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
```
- **Listen**: Start server on port
- **Success Log**: Confirm startup
- **CORS Log**: Show allowed origin
- **Why**: Developer feedback that server started correctly

---

## Configuration

### chatConfig.js - Dynamic System Prompt

#### Hero Config

```javascript
export const heroConfig = {
    name: 'Kunal Rathore',
    tagline: 'Software Engineer Student',
    avatar: profileImg,
    fallback: 'KR',
    skills: [
        { name: 'JavaScript', icon: 'JavaScript' },
        { name: 'React', icon: 'React' },
        // ... more skills
    ],
};
```
- **Purpose**: Portfolio owner information
- **Used**: Chat header, system prompt, fallback avatar
- **Skills**: Array of objects with name and icon
- **Why Centralized**: Single source of truth

#### Experience Data

```javascript
const experiences = [
    {
        position: 'Software Engineer Intern',
        company: 'Tech Company',
        startDate: 'Jan 2024',
        endDate: 'Present',
    },
    // ... more experiences
];
```
- **Purpose**: Work history for AI context
- **Structure**: Position, company, dates
- **Why**: AI can answer "What's your experience?"

#### Projects Data

```javascript
const projects = [
    {
        title: 'Portfolio Website',
        description: 'Personal portfolio showcasing projects and skills',
        live: 'https://example.com',
    },
    // ... more projects
];
```
- **Purpose**: Projects to mention in conversation
- **Structure**: Title, description, optional live link
- **Why**: AI can discuss specific projects

#### Social Links

```javascript
const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/kunal-rathore-111' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/kunalrathore111' },
    // ... more links
];
```
- **Purpose**: Contact information
- **Why**: AI can provide links when asked "How to contact?"

#### Suggestions

```javascript
export const chatSuggestions = [
    "What projects have you worked on?",
    "Tell me about your skills",
    "What's your experience?",
    "How can I contact you?",
];
```
- **Purpose**: Help users start conversation
- **Why Array**: Easy to add/remove/reorder

#### Dynamic System Prompt Generator

```javascript
function generateSystemPrompt() {
    const skillNames = heroConfig.skills.map((s) => s.name).join(', ');
    const experienceText = experiences
        .map((exp) => `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`)
        .join('\n- ');
    const projectsText = projects
        .map((p) => `${p.title}: ${p.description}${p.live ? ` - ${p.live}` : ''}`)
        .join('\n- ');
    const socialLinksText = socialLinks.map((l) => `${l.name}: ${l.href}`).join('\n- ');
```
- **Generate Text**: Convert arrays to formatted strings
- **Skills**: Comma-separated list
- **Experience**: Bulleted list with details
- **Projects**: Bulleted list with descriptions and links
- **Social**: Bulleted list of links
- **Why Dynamic**: Update config once, prompt auto-updates

```javascript
    return `You are ${about.name}'s Portfolio Assistant representing ${about.name}.

ABOUT: ${about.description}

SKILLS:
${skillNames}

EXPERIENCE:
- ${experienceText}

PROJECTS:
- ${projectsText}

SOCIAL LINKS:
- ${socialLinksText}

RESPONSE RULES:
- Keep responses under 120 words
- Use markdown formatting
- Make all links clickable using [text](url)
- Be concise, friendly, and helpful
- Answer questions about skills, experience, projects, and contact
- If unsure, suggest visiting sections of the site
- Refer to ${about.name} as 'I' or 'me' (first person)

Goal: Help visitors learn about my work in a friendly, concise way.`;
}
```
- **Structure**: Clear sections for AI to understand
- **Rules**: 
  - Word limit (concise)
  - Markdown formatting
  - Link format
  - Tone guidance
  - First person (AI represents owner)
- **Goal**: Set clear expectation
- **Why**: Better AI responses, consistent behavior

```javascript
export const systemPrompt = generateSystemPrompt();
```
- **Export**: Pre-generated prompt ready to use
- **Called Once**: On module load
- **Why**: No need to regenerate every request

---

## Integration with Portfolio

### App.jsx Integration

```jsx
import ChatBubble from "./components/ChatBubble.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <ReactLenis root options={{ smoothWheel: true, duration: 3.7 }}>
                <ScrollHandler />
                <Oneko />
                <ChatBubble /> {/* Added here */}
                <div className="w-screen flex box-border">
                    {/* Rest of app */}
                </div>
            </ReactLenis>
        </BrowserRouter>
    );
}
```
- **Placement**: Top level, outside main content
- **Why**: 
  - Always visible
  - Doesn't interfere with routing
  - Fixed position (floats over content)
  - Not affected by smooth scroll

### Context Independence

**Does NOT use**:
- [`NavToggleContext`](src/context/NavToggleContext.jsx) - Nav state
- [`ScrollContext`](src/context/ScrollContext.jsx) - Section refs  
- [`ProjectContext`](src/context/ProjectContext.jsx) - Project data

**Why Independent**:
- Self-contained functionality
- No dependencies = easier to maintain
- Can be copied to other projects
- Config-based data source instead

---

## Environment Variables

### .env File

````env
# Backend
VITE_GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_BASE=http://localhost:5000/api
`````