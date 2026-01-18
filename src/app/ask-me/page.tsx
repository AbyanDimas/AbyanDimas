'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Globe, Code, Zap, Sparkles, Menu, Bot, User, X, Image as ImageIcon, Copy, Check, RotateCcw } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import AskMeSidebar from "@/components/ask-me/AskMeSidebar";
import { generateResponse } from '@/app/actions/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    role: 'user' | 'model';
    text: string;
    image?: string; // Base64 string for image
    isError?: boolean;
}

export default function AskMePage() {
    const [selectedMode, setSelectedMode] = useState('solution-architect');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [usage, setUsage] = useState({ count: 0, limit: 5 });

    // New Feature States
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [showPrompts, setShowPrompts] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, selectedImage]);

    // Load chat if ID provided
    const loadChat = (id: string | null) => {
        if (!id) {
            setChatId(null);
            setMessages([]);
            setSelectedImage(null);
            setInput('');
            return;
        }

        const savedMessages = localStorage.getItem(`chat_messages_${id}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
            setChatId(id);
        }
    };

    // Image Handling
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Voice Handling
    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Browser anda tidak mendukung fitur ini (Web Speech API). Coba gunakan Google Chrome.');
            return;
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'id-ID'; // Indonesian
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                setShowPermissionModal(true);
            }
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCopyMessage = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleRetry = async (idx: number) => {
        // Find the last user message to resend
        // If clicking retry on a bot error, we want to resend the user message that caused it.
        // If clicking retry on a user message, we resend that user message.

        let targetUserMessage: Message | undefined;
        let cutOffIndex = idx;

        if (messages[idx].role === 'user') {
            targetUserMessage = messages[idx];
        } else {
            // It's a bot message (likely error), find preceding user message
            if (idx > 0 && messages[idx - 1].role === 'user') {
                targetUserMessage = messages[idx - 1];
                cutOffIndex = idx - 1;
            }
        }

        if (!targetUserMessage) return;

        // Keep messages up to the point before the retried interaction effectively
        // Actually, simpler UX: just populate input and let user send again? 
        // Or remove the error and resend immediately?
        // Let's remove the error/failed tail and resend.

        const newHistory = messages.slice(0, cutOffIndex);
        setMessages(newHistory);
        setInput(targetUserMessage.text);
        if (targetUserMessage.image) setSelectedImage(targetUserMessage.image);

        // Optionally auto-trigger send. But populating input is safer/clearer.
        // The user asked for "repeat/ulangi", often implies auto-action. 
        // Let's try to auto-send for smoother UX, but we need to handle state carefully.
        // For now, let's keep it simple: Populating input allows user to fix if needed. 
        // But to be "One Click Retry", we should just mock the send.

        // Let's do the "Send immediately" approach manually
        setMessages([...newHistory, targetUserMessage]);
        setIsLoading(true);

        try {
            const response = await generateResponse(targetUserMessage.text, selectedMode, targetUserMessage.image);

            if (response.error) {
                const errorMessage: Message = { role: 'model', text: `Maaf, terjadi kesalahan: ${response.error}`, isError: true };
                setMessages([...newHistory, targetUserMessage, errorMessage]);
            } else {
                const botMessage: Message = { role: 'model', text: response.text || 'Maaf, saya tidak mengerti.' };
                setMessages([...newHistory, targetUserMessage, botMessage]);
            }
        } catch (error) {
            const errorMessage: Message = { role: 'model', text: 'Maaf, terjadi kesalahan jaringan.', isError: true };
            setMessages([...newHistory, targetUserMessage, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Prompts Mock Data
    const starterPrompts = [
        "Jelaskan arsitektur Microservices vs Monolith.",
        "Bagaimana cara optimasi performa Next.js?",
        "Buatkan roadmap belajar Software Architecture.",
        "Apa best practice state management di React?",
        "Bagaimana cara scaling database untuk jutaan user?",
        "Jelaskan konsep CI/CD untuk pemula."
    ];

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = input.trim();
        const currentImage = selectedImage;

        setInput('');
        setSelectedImage(null);
        setShowPrompts(false);

        const newMessages: Message[] = [...messages, {
            role: 'user',
            text: userMessage || (currentImage ? "[Mengirim Gambar]" : ""),
            image: currentImage || undefined
        }];
        setMessages(newMessages);
        setIsLoading(true);

        // Generate new Chat ID if starting a new chat
        let currentId = chatId;
        if (!currentId) {
            currentId = Date.now().toString();
            setChatId(currentId);

            // Save to history list
            const title = userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '') || "Gambar";
            const historyItem = { id: currentId, title, date: Date.now() };

            const existingHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');
            localStorage.setItem('chat_history', JSON.stringify([historyItem, ...existingHistory]));
        }

        // Save user message immediately
        if (currentId) {
            localStorage.setItem(`chat_messages_${currentId}`, JSON.stringify(newMessages));
        }

        try {
            const response = await generateResponse(userMessage, selectedMode, currentImage || undefined);

            if (response.error) {
                const errorMessage: Message = { role: 'model', text: `Maaf, terjadi kesalahan: ${response.error}`, isError: true };
                const updatedMessages = [...newMessages, errorMessage];
                setMessages(updatedMessages);
                if (currentId) localStorage.setItem(`chat_messages_${currentId}`, JSON.stringify(updatedMessages));
            } else {
                const botMessage: Message = { role: 'model', text: response.text || 'Maaf, saya tidak mengerti.' };
                const updatedMessages = [...newMessages, botMessage];
                setMessages(updatedMessages);
                if (currentId) localStorage.setItem(`chat_messages_${currentId}`, JSON.stringify(updatedMessages));
            }

            if ('usage' in response && response.usage) {
                setUsage(response.usage as any);
            }
        } catch (error) {
            console.error(error);
            const errorMessage: Message = { role: 'model', text: 'Maaf, terjadi kesalahan jaringan.', isError: true };
            setMessages([...newMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const modes = [
        {
            id: 'solution-architect',
            title: 'Solution Architect',
            description: 'Desain sistem & pola cloud tingkat tinggi',
            icon: Globe,
            color: 'bg-blue-500',
            gradient: 'from-blue-500 to-cyan-400'
        },
        {
            id: 'web-architect',
            title: 'Web Architect',
            description: 'Frontend modern & teknologi web terkini',
            icon: Code,
            color: 'bg-purple-500',
            gradient: 'from-purple-500 to-pink-400'
        },
        {
            id: 'productivity',
            title: 'Productivity Guru',
            description: 'Optimasi workflow & alat produktivitas',
            icon: Zap,
            color: 'bg-amber-500',
            gradient: 'from-amber-500 to-orange-400'
        }
    ];

    return (
        // Changed to h-[calc(100vh-64px)] to fix scroll/overflow issues
        <main className="h-[calc(100vh-64px)] bg-[var(--background)] flex relative overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* Permission Modal */}
            {showPermissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowPermissionModal(false)}
                            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Mic className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Akses Mikrofon Ditolak</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Untuk menggunakan fitur input suara, harap izinkan akses mikrofon di pengaturan browser Anda.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPermissionModal(false)}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AskMeSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                currentChatId={chatId}
                onSelectChat={loadChat}
                onNewChat={() => loadChat(null)}
            />

            {/* Main Content Area - Use flex-col and handle padding carefully */}
            <div className="flex-1 flex flex-col relative w-full h-full min-w-0 transition-all duration-300 hide-scrollbar">

                {/* Mobile Toggle Button - Absolute */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-4 left-4 md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)] rounded-lg z-30"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}

                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Content Container - Centered */}
                <div className="w-full max-w-6xl mx-auto flex flex-col h-full z-10">

                    {/* Welcome Screen (Only when no messages) - Has its own scrolling/flex if needed */}
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-4 md:p-8 overflow-y-auto hide-scrollbar">
                            <div className="text-center flex flex-col items-center gap-4">
                                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-green-300 rounded-full blur-xl opacity-50 animate-pulse" />
                                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-[0_0_40px_rgba(52,211,153,0.5)] flex items-center justify-center overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent)]" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">
                                        Selamat Datang di Ask Abyan
                                    </h1>
                                    <p className="text-[var(--text-secondary)] text-base max-w-lg">
                                        Mulai dengan memilih persona. Tanyakan tentang desain sistem, pengembangan web, atau sekadar ngobrol.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                                {modes.map((mode) => {
                                    const Icon = mode.icon;
                                    const isSelected = selectedMode === mode.id;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setSelectedMode(mode.id)}
                                            className={cn(
                                                "relative group p-3 rounded-xl border transition-all duration-300 text-left hover:shadow-lg",
                                                isSelected
                                                    ? "bg-[var(--card-bg)] border-blue-500/50 shadow-blue-500/10 ring-1 ring-blue-500/20"
                                                    : "bg-[var(--card-bg)]/50 border-[var(--card-border)] hover:border-[var(--card-border-hover)] hover:bg-[var(--card-hover)]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110",
                                                `bg-gradient-to-br ${mode.gradient}`
                                            )}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <h3 className="font-semibold text-[var(--text-primary)] mb-0.5 text-sm">{mode.title}</h3>
                                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{mode.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages Area - Scrollable */}
                    {messages.length > 0 && (
                        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 space-y-4 hide-scrollbar">
                            {/* Spacer for top content if needed */}
                            <div className="h-10" />

                            {messages.map((msg, idx) => (
                                <div key={idx} className={cn("flex gap-3 max-w-[90%] group", msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === 'user' ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className="max-w-full">
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed overflow-hidden",
                                            msg.role === 'user'
                                                ? "bg-blue-600 text-white rounded-tr-sm"
                                                : "bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-tl-sm shadow-sm w-full"
                                        )}>
                                            {msg.image && (
                                                <div className="mb-2 rounded-lg overflow-hidden">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={msg.image} alt="User Upload" className="max-w-full h-auto max-h-64 object-contain" />
                                                </div>
                                            )}
                                            {msg.role === 'user' ? (
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                            ) : (
                                                <div className="prose dark:prose-invert prose-sm max-w-none break-words leading-normal">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ node, inline, className, children, ...props }: any) {
                                                                const match = /language-(\w+)/.exec(className || '')
                                                                return !inline && match ? (
                                                                    <div className="rounded-lg overflow-hidden my-2 border border-[var(--card-border)]">
                                                                        <div className="flex items-center justify-between px-3 py-1 bg-[#1e1e1e] border-b border-[#333]">
                                                                            <span className="text-xs text-gray-400">{match[1]}</span>
                                                                        </div>
                                                                        <SyntaxHighlighter
                                                                            {...props}
                                                                            style={vscDarkPlus}
                                                                            language={match[1]}
                                                                            PreTag="div"
                                                                            customStyle={{ margin: 0, borderRadius: 0 }}
                                                                        >
                                                                            {String(children).replace(/\n$/, '')}
                                                                        </SyntaxHighlighter>
                                                                    </div>
                                                                ) : (
                                                                    <code {...props} className={cn("bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 font-mono text-xs", className)}>
                                                                        {children}
                                                                    </code>
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}>
                                            <button
                                                onClick={() => handleCopyMessage(msg.text, idx)}
                                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
                                                title="Salin Pesan"
                                            >
                                                {copiedIndex === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                            <button
                                                onClick={() => handleRetry(idx)}
                                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded transition-colors"
                                                title="Ulangi Chat"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 max-w-[90%] mr-auto">
                                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Prompts Overlay */}
                    {showPrompts && (
                        <div className="w-full px-4 md:px-8 pb-2 z-30">
                            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in slide-in-from-bottom-2 fade-in">
                                {starterPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInput(prompt);
                                            setShowPrompts(false);
                                        }}
                                        className="text-left text-sm p-2 hover:bg-[var(--card-hover)] rounded-lg text-[var(--text-primary)] transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Input Area (Fixed at bottom) */}
                    <div className="w-full p-4 md:px-8 md:pb-8 pt-0 shrink-0 z-20">
                        {/* Image Preview */}
                        {selectedImage && (
                            <div className="mb-2 relative inline-block">
                                <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-[var(--card-border)] object-cover" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        <div className={cn(
                            "bg-[var(--card-bg)] rounded-2xl border shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 transition-all",
                            isListening ? "border-red-500 ring-2 ring-red-500/20" : "border-[var(--card-border)]"
                        )}>
                            <textarea
                                className="w-full bg-transparent border-none outline-none p-4 min-h-[50px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none text-sm"
                                placeholder={isListening ? "Mendengarkan..." : "Tanyakan apapun..."}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <div className="px-3 py-2 flex items-center justify-between border-t border-[var(--card-border)]/50 bg-[var(--card-bg)]/50">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-1.5 hover:bg-[var(--card-hover)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 text-xs"
                                    >
                                        <Paperclip className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Lampirkan</span>
                                    </button>
                                    <button
                                        onClick={handleVoiceInput}
                                        className={cn(
                                            "p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs",
                                            isListening
                                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 animate-pulse"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
                                        )}
                                    >
                                        <Mic className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">{isListening ? 'Mendengarkan...' : 'Suara'}</span>
                                    </button>
                                    <button
                                        onClick={() => setShowPrompts(!showPrompts)}
                                        className={cn(
                                            "p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs",
                                            showPrompts
                                                ? "bg-blue-500/10 text-blue-500"
                                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
                                        )}
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Prompts</span>
                                    </button>
                                </div>

                                <div className="hidden sm:flex items-center gap-2">
                                    <span className={cn(
                                        "text-[10px] font-medium px-2 py-1 rounded-md transition-colors",
                                        usage.count >= usage.limit
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {usage.count >= usage.limit ? "LIMIT" : `${usage.count}/${usage.limit}`}
                                    </span>
                                    <span className="text-[10px] font-medium bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
                                        {input.length}/1,500
                                    </span>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || (!input.trim() && !selectedImage)}
                                    className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <p className="text-[10px] text-[var(--text-muted)]">
                                Abyan AI mungkin menampilkan informasi yang kurang akurat, mohon periksa kembali.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
