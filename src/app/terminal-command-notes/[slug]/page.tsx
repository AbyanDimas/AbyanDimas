import { getCommandNote, getCommandNotes } from '@/lib/markdown';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Terminal } from 'lucide-react';

export async function generateStaticParams() {
    const commands = await getCommandNotes();
    return commands.map((cmd) => ({
        slug: cmd.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const cmd = await getCommandNote(slug);
    return {
        title: `${cmd.title} | Terminal Commands`,
        description: cmd.description,
    };
}

export default async function CommandNotePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const cmd = await getCommandNote(slug);

    return (
        <div className="min-h-screen py-20 px-6 bg-zinc-950 text-zinc-200">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <Link
                    href="/terminal-command-notes"
                    className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm">cd ..</span>
                </Link>

                {/* Header */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-12 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
                            <Terminal className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="font-mono text-zinc-500">{cmd.category || 'Snippet'}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tight">
                        {cmd.title}
                    </h1>

                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mb-8 border-l-4 border-blue-500 pl-4 bg-blue-500/5 py-4 pr-4 rounded-r-lg">
                        {cmd.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 font-mono">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {cmd.date}
                        </div>
                        {cmd.tags && (
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                {cmd.tags.join(', ')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <article className="prose prose-invert prose-lg max-w-none 
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
                    prose-code:text-blue-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-headings:font-bold prose-headings:text-white prose-headings:font-mono
                    prose-p:text-zinc-300 prose-p:leading-relaxed
                    ">
                    <div dangerouslySetInnerHTML={{ __html: cmd.contentHtml }} />
                </article>

                <hr className="my-16 border-zinc-800" />

                <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                        <p className="text-zinc-400 font-mono text-sm mb-1">Was this useful?</p>
                        <p className="text-white font-bold">Share with your team</p>
                    </div>
                    <Link href="/terminal-command-notes" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        Browse More
                    </Link>
                </div>
            </div>
        </div>
    );
}
