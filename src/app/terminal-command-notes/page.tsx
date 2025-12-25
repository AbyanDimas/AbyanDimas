import { getCommandNotes } from '@/lib/markdown';
import { Terminal } from 'lucide-react';
import CommandList from '@/components/CommandList';

export const metadata = {
    title: "Terminal Command Notes | Profile Dashboard",
    description: "A curated collection of essential terminal commands and cheatsheets.",
};

export default async function TerminalCommandsPage() {
    const commands = await getCommandNotes();

    return (
        <div className="min-h-screen py-20 px-6 bg-zinc-950">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl">
                            <Terminal className="w-8 h-8 text-green-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-mono tracking-tight">
                            ~/commands
                        </h1>
                    </div>
                    <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">
                        My personal cheat sheets for Linux, Docker, Git, and system administration.
                        No more Googling the same flags twice.
                    </p>
                </div>

                {/* Client Component with Search */}
                <CommandList initialCommands={commands} />
            </div>
        </div>
    );
}
