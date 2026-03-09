'use client';

import { useEffect, useRef } from 'react';

interface MarkdownViewerProps {
    html: string;
}

export default function MarkdownViewer({ html }: MarkdownViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const preBlocks = containerRef.current.querySelectorAll('pre');

        preBlocks.forEach((pre) => {
            if (pre.querySelector('.copy-button')) return;

            // Ensure pre is positioned relative for absolute button
            pre.style.position = 'relative';
            // Add group class to allow hover effects for children
            pre.classList.add('group');

            const button = document.createElement('button');
            // We use Tailwind classes explicitly so the compiler catches them
            button.className = 'copy-button absolute top-4 right-4 p-2 rounded-[8px] bg-zinc-200/50 hover:bg-zinc-300 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50';
            button.innerHTML = '<span class="material-symbols-outlined text-[16px]">content_copy</span>';
            button.setAttribute('aria-label', 'Copy code');

            button.onclick = () => {
                // Get the text from the code element specifically if possible
                const codeNode = pre.querySelector('code');
                const textToCopy = codeNode ? codeNode.innerText : pre.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    button.innerHTML = '<span class="material-symbols-outlined text-[16px] text-green-600 dark:text-green-400">check</span>';
                    button.classList.add('opacity-100'); // Force visible when checked

                    setTimeout(() => {
                        button.innerHTML = '<span class="material-symbols-outlined text-[16px]">content_copy</span>';
                        button.classList.remove('opacity-100');
                    }, 2000);
                });
            };

            pre.appendChild(button);
        });
    }, [html]);

    return (
        <div
            ref={containerRef}
            className="prose prose-lg max-w-none 
            prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-[1.9] prose-p:mb-8 prose-p:mt-0 prose-p:font-medium
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-900 dark:prose-strong:text-white dark:prose-strong:font-bold
            prose-li:text-zinc-700 dark:prose-li:text-zinc-300 prose-li:font-medium prose-li:mb-2
            prose-ul:mb-8 prose-ul:mt-4 prose-ul:list-disc
            prose-pre:bg-zinc-50 dark:prose-pre:bg-zinc-950/50 prose-pre:text-zinc-900 dark:prose-pre:text-zinc-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800 prose-pre:mb-8
            prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
            "
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
