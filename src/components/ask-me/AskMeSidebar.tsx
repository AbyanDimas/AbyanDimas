'use client';

import {
    MessageSquare,
    Clock,
    Bookmark,
    Settings,
    HelpCircle,
    Plus,
    X,
    Trash2,
    Share2,
    Check
} from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from 'react';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentChatId: string | null;
    onSelectChat: (id: string | null) => void;
    onNewChat: () => void;
}

interface ChatHistoryItem {
    id: string;
    title: string;
    date: number;
}

export default function AskMeSidebar({ isOpen, setIsOpen, currentChatId, onSelectChat, onNewChat }: SidebarProps) {
    const [history, setHistory] = useState<ChatHistoryItem[]>([]);

    useEffect(() => {
        // Load history from local storage
        const savedHistory = localStorage.getItem('chat_history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setHistory(parsed.sort((a: ChatHistoryItem, b: ChatHistoryItem) => b.date - a.date));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, [isOpen]); // Reload when sidebar opens to ensure fresh data

    const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newHistory = history.filter(item => item.id !== id);
        setHistory(newHistory);
        localStorage.setItem('chat_history', JSON.stringify(newHistory));
        localStorage.removeItem(`chat_messages_${id}`);
        if (currentChatId === id) {
            onNewChat();
        }
    };

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleShareChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const savedMessages = localStorage.getItem(`chat_messages_${id}`);
        if (savedMessages) {
            const messages = JSON.parse(savedMessages);
            const text = messages.map((m: any) => `**${m.role === 'user' ? 'User' : 'Abyan AI'}**: ${m.text}`).join('\n\n');
            navigator.clipboard.writeText(text);

            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed left-0 top-16 bottom-0 z-40 w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-64px)]",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-64"
            )}>
                {/* Header */}
                <div className="p-3 border-b border-[var(--card-border)] flex items-center justify-between">
                    <button
                        onClick={() => {
                            onNewChat();
                            // Optional: close sidebar on mobile after clicking new chat
                            if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className="flex-1 flex items-center gap-2 bg-[var(--card-hover)] hover:bg-[var(--card-border)] text-[var(--text-primary)] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Chat Baru</span>
                    </button>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden ml-2 p-2 hover:bg-[var(--card-hover)] rounded-lg text-[var(--text-secondary)]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Navigation - Removed as they were mostly mockups or redundant */}
                {/* 
                <div className="p-2 space-y-1">
                    ...
                </div>
                */}

                {/* Recent Chats */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Riwayat Obrolan</h3>
                    <div className="space-y-1">
                        {history.length === 0 ? (
                            <p className="text-xs text-[var(--text-muted)] italic">Belum ada riwayat.</p>
                        ) : (
                            history.map((chat) => (
                                <div
                                    key={chat.id}
                                    role="button"
                                    onClick={() => {
                                        onSelectChat(chat.id);
                                        if (window.innerWidth < 768) setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors flex items-center justify-between group cursor-pointer",
                                        currentChatId === chat.id
                                            ? "bg-[var(--card-hover)] text-[var(--text-primary)] font-medium"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
                                    )}
                                >
                                    <span className="truncate flex-1">{chat.title}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleShareChat(e, chat.id)}
                                            className="p-1 hover:bg-blue-500/10 hover:text-blue-500 rounded transition-all"
                                            title="Salin ke Public"
                                        >
                                            {copiedId === chat.id ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteHistory(e, chat.id)}
                                            className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-all"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer - User Profile Only */}
                <div className="p-4 border-t border-[var(--card-border)]">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">Abyan Dimas</p>
                            <p className="text-xs text-[var(--text-muted)] truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
