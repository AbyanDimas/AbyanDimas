'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CommandNoteData } from '@/lib/markdown';
import { Hash, ChevronRight, Command, Search, Terminal } from 'lucide-react';

interface CommandListProps {
    initialCommands: CommandNoteData[];
}

export default function CommandList({ initialCommands }: CommandListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCommands = useMemo(() => {
        return initialCommands.filter((cmd) =>
            cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [initialCommands, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Terminal Search Bar */}
            <div className="max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-green-500 font-mono font-bold mr-2">$</span>
                        <span className="text-zinc-500 font-mono">grep</span>
                    </div>
                    <input
                        type="text"
                        placeholder="search_query..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-24 pr-4 py-4 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all font-mono"
                        spellCheck={false}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="animate-pulse w-2 h-5 bg-green-500/50 block"></span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {filteredCommands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommands.map((cmd) => (
                        <Link key={cmd.slug} href={`/terminal-command-notes/${cmd.slug}`} className="group relative block h-full">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-zinc-800 to-zinc-800/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:from-blue-600 group-hover:to-purple-600"></div>
                            <div className="relative h-full bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
                                {/* Terminal Dots */}
                                <div className="flex gap-1.5 mb-6 opacity-50">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
                                        {cmd.category || 'System'}
                                    </span>
                                    <span className="text-xs text-zinc-500 font-mono">{cmd.date}</span>
                                </div>

                                <h3 className="text-xl font-bold text-zinc-100 mb-2 font-mono group-hover:text-blue-400 transition-colors">
                                    {cmd.title}
                                </h3>

                                <p className="text-zinc-400 text-sm mb-6 flex-1 line-clamp-3">
                                    {cmd.description}
                                </p>

                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    {cmd.tags?.slice(0, 3).map(tag => (
                                        <div key={tag} className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                                            <Hash className="w-3 h-3" /> {tag}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center justify-between text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                    <span className="text-sm font-mono flex items-center gap-2">
                                        <Command className="w-3 h-3" /> View Source
                                    </span>
                                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-zinc-800 border-dashed rounded-2xl bg-zinc-900/20">
                    <Terminal className="w-12 h-12 mb-4 opacity-50" />
                    <p className="font-mono text-lg">No commands found matching "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try adjusting your query or execute a different command.</p>
                </div>
            )}
        </div>
    );
}
