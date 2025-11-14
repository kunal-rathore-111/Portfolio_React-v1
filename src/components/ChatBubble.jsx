import React, { useEffect, useRef, useState } from 'react';
import ChatBubbleIcon from '@/assets/icons/ChatBubbleIcon.jsx';
import SendIcon from '@/assets/icons/SendIcon.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ExpandableChat, ExpandableChatBody, ExpandableChatFooter, ExpandableChatHeader } from '@/components/ui/expandable-chat.jsx';
import { Input } from '@/components/ui/input.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { chatSuggestions, systemPrompt, heroConfig } from '@/config/chatConfig.js';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

const initialMessages = [
    {
        id: 1,
        text: "Hello! I'm your Portfolio Assistant. How can I help you?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
];

export default function ChatBubble() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);
    const scrollAreaRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
        }
    }, [messages]);

    // Cooldown timer
    useEffect(() => {
        if (cooldownSeconds <= 0) return;
        const timer = setInterval(() => {
            setCooldownSeconds((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldownSeconds]);

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

    const handleSuggestionClick = (suggestion) => {
        if (isLoading || cooldownSeconds > 0) return;

        setNewMessage(suggestion);
        const userMessage = {
            id: Date.now(),
            text: suggestion,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, userMessage]);
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
        sendMessage(suggestion, botMessageId);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const sendMessage = async (messageText, botMessageId) => {
        try {
            const history = messages.slice(-10).map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));

            const apiBase = import.meta.env.VITE_API_BASE || '/api';
            const response = await fetch(`${apiBase}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, history }),
            });

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
                    // ignore parse error
                }
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === botMessageId
                            ? { ...msg, text: errorText, isStreaming: false }
                            : msg
                    )
                );
                setIsLoading(false);
                setNewMessage('');
                return;
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No reader available');

            let accumulatedText = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) throw new Error(data.error);
                            if (data.text) {
                                accumulatedText += data.text;
                                setMessages((prev) =>
                                    prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: accumulatedText, isStreaming: true } : msg))
                                );
                            }
                            if (data.done) {
                                setMessages((prev) =>
                                    prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: accumulatedText, isStreaming: false } : msg))
                                );
                                break;
                            }
                        } catch (err) {
                            continue;
                        }
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

    return (
        <ExpandableChat
            className="hover:cursor-pointer max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-xl max-h-[95vh] mt-4 ml-4"
            position="bottom-right"
            size="lg"
            icon={<ChatBubbleIcon className="h-6 w-6" />}
        >
            <ExpandableChatHeader>
                <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 border-2 border-primary bg-blue-300 dark:bg-yellow-300">
                        <AvatarImage src="/assets/logo.png" alt="Assistant" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">{heroConfig.name}'s Portfolio Assistant</h3>
                        <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                            </div>
                        </div>
                    </div>
                </div>
            </ExpandableChatHeader>

            <ExpandableChatBody>
                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    'flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                                    message.sender === 'user' ? 'ml-auto text-secondary bg-muted' : 'bg-muted'
                                )}
                            >
                                <div className="flex items-start space-x-2">
                                    {message.sender === 'bot' && (
                                        <Avatar className="h-6 w-6 border-2 border-primary bg-blue-300 dark:bg-yellow-300">
                                            <AvatarImage src="/assets/logo.png" alt="Assistant" />
                                            <AvatarFallback>AI</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex-1 md:max-w-sm max-w-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 prose prose-sm max-w-none dark:prose-invert">
                                                {message.text ? (
                                                    <ReactMarkdown
                                                        components={{
                                                            a: (props) => (
                                                                <a
                                                                    {...props}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:text-blue-700 underline break-words"
                                                                />
                                                            ),
                                                            p: (props) => <p {...props} className="m-0 leading-relaxed" />,
                                                            ul: (props) => <ul {...props} className="m-0 pl-4" />,
                                                            ol: (props) => <ol {...props} className="m-0 pl-4" />,
                                                            li: (props) => <li {...props} className="m-0" />,
                                                            strong: (props) => <strong {...props} className="font-semibold" />,
                                                        }}
                                                    >
                                                        {message.text}
                                                    </ReactMarkdown>
                                                ) : (
                                                    message.isStreaming && <span className="text-muted-foreground">Thinking...</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className={cn('text-xs mt-1', message.sender === 'user' ? 'text-secondary' : 'text-muted-foreground')}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

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
                    </div>
                </ScrollArea>
            </ExpandableChatBody>

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
                        {isLoading ? (
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