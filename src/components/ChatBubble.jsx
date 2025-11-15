import React, { useEffect, useRef, useState } from 'react';
import ChatBubbleIcon from '@/assets/icons/ChatBubbleIcon.jsx';
import SendIcon from '@/assets/icons/SendIcon.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ExpandableChat, ExpandableChatBody, ExpandableChatFooter, ExpandableChatHeader } from '@/components/ui/expandable-chat.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { chatSuggestions, heroConfig, systemPrompt } from '@/config/chatConfig.js';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

const initialMessages = [
	{
		id: 1,
		text: `Hi! I'm ${heroConfig.name}. Ask me about his projects, skills, or experience.`,
		sender: 'bot',
		timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}
];

export default function ChatBubble() {
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const [cooldown, setCooldown] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		if (!scrollRef.current) return;
		const el = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages]);

	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setInterval(() => setCooldown(s => (s > 0 ? s - 1 : 0)), 1000);
		return () => clearInterval(t);
	}, [cooldown]);

	const sendMessage = async (messageText, botMessageId) => {
		try {
			const history = messages.slice(-10).map((msg) => ({
				role: msg.sender === 'user' ? 'user' : 'model',
				parts: [{ text: msg.text }],
			}));

			// Prefer env, otherwise use a dev-friendly fallback to the Node server
			const apiBase =
				import.meta.env.VITE_API_BASE ??
				((window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1')
					? 'http://localhost:5000/api'
					: '/api');

			if (!import.meta.env.VITE_API_BASE) {
				console.warn('[Chat] VITE_API_BASE not set. Using fallback:', apiBase);
			}

			const response = await fetch(`${apiBase}/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: messageText, history, systemPrompt }),
			});

			if (!response.ok) {
				// Try to extract meaningful server error
				let errorText = `HTTP error! status: ${response.status}`;
				let parsed = null;
				const raw = await response.text().catch(() => null);
				try {
					parsed = raw ? JSON.parse(raw) : null;
				} catch { }
				if (response.status === 429) {
					const retryAfter = parsed?.retryAfter ?? 30;
					setCooldown(retryAfter);
					errorText = `Too many requests. Please wait ${retryAfter}s and try again.`;
				} else if (parsed?.error) {
					errorText = parsed.error;
				} else if (raw) {
					errorText = raw;
				}
				throw new Error(errorText);
			}

			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let accumulatedText = '';
				while (true) {
					const { done, value } = await reader.read();
					if (done) {
						setMessages((prev) =>
							prev.map((msg) =>
								msg.id === botMessageId ? { ...msg, text: accumulatedText, isStreaming: false } : msg
							)
						);
						break;
					}
					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split('\n').filter(Boolean);
					for (const line of lines) {
						try {
							const data = JSON.parse(line);
							if (data.text !== undefined) {
								accumulatedText += data.text;
								setMessages((prev) =>
									prev.map((msg) =>
										msg.id === botMessageId ? { ...msg, text: accumulatedText, isStreaming: true } : msg
									)
								);
							}
							if (data.done) {
								setMessages((prev) =>
									prev.map((msg) =>
										msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
									)
								);
							}
						} catch { /* ignore parse errors */ }
					}
				}
			}
		} catch (error) {
			console.error('Error sending message:', error);
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === botMessageId
						? {
							...msg,
							text:
								"I'm sorry, I'm having trouble responding right now. Please try again later.",
							isStreaming: false,
						}
						: msg
				)
			);
		} finally {
			setLoading(false);
			setInput('');
		}
	}

	const handleSend = () => {
		if (!input.trim() || loading || cooldown > 0) return;

		const userMessage = {
			id: Date.now(),
			text: input.trim(),
			sender: 'user',
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		};

		const botMessage = {
			id: Date.now() + 1,
			text: '',
			sender: 'bot',
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			isStreaming: true
		};

		setMessages((prev) => [...prev, userMessage, botMessage]);
		setLoading(true);
		sendMessage(input.trim(), botMessage.id);
	};

	function handleKey(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	return (
		<ExpandableChat position="bottom-right" size="lg" icon={<ChatBubbleIcon className="h-6 w-6" />}>
			<ExpandableChatHeader>
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src={heroConfig.avatar} alt="Assistant" />
						<AvatarFallback>AI</AvatarFallback>
					</Avatar>
					<div className="text-sm">
						<p className="font-semibold"> {heroConfig.name}</p>
						<p className="text-xs text-muted-foreground">Ask me about my work</p>
					</div>
				</div>
			</ExpandableChatHeader>

			<ExpandableChatBody>
				<ScrollArea ref={scrollRef} className="h-[400px] p-4">
					<div className="flex flex-col gap-4">
						{messages.map(m => (
							<div
								key={m.id}
								className={cn(
									'rounded-lg px-3 py-2 max-w-[80%] text-sm',
									m.sender === 'user'
										? 'ml-auto bg-primary text-primary-foreground'
										: 'bg-muted'
								)}
							>
								{m.text ? (
									<div className="prose prose-sm dark:prose-invert max-w-none">
										<ReactMarkdown>{m.text}</ReactMarkdown>
									</div>
								) : (
									m.isStreaming && <span className="text-muted-foreground">Thinking...</span>
								)}
								<p className="text-[10px] mt-1 opacity-60">{m.timestamp}</p>
							</div>
						))}

						{messages.length === 1 && !loading && (
							<div className="flex flex-wrap gap-2">
								{chatSuggestions.map((s, i) => (
									<Button
										key={i}
										variant="outline"
										size="sm"
										disabled={cooldown > 0}
										onClick={() => setInput(s)}
										className="text-xs"
									>
										{s}
									</Button>
								))}
							</div>
						)}
					</div>
				</ScrollArea>
			</ExpandableChatBody>

			<ExpandableChatFooter>
				{cooldown > 0 && (
					<p className="text-xs text-center text-amber-600 mb-2">
						Please wait {cooldown}s...
					</p>
				)}
				<div className="flex gap-2">
					<Input
						placeholder="Type your message..."
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyPress={handleKey}
						disabled={loading || cooldown > 0}
						className="flex-1"
					/>
					<Button
						size="icon"
						disabled={!input.trim() || loading || cooldown > 0}
						onClick={handleSend}
					>
						{loading ? (
							<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
						) : (
							<SendIcon className="h-4 w-4" />
						)}
					</Button>
				</div>
			</ExpandableChatFooter>
		</ExpandableChat>
	);
}