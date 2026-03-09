'use client';

import { useState } from 'react';

interface CopyLinkButtonProps {
    url: string;
    className?: string;
}

export default function CopyLinkButton({ url, className }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    return (
        <div className="relative flex justify-center items-center group">
            <button
                onClick={handleCopy}
                className={className}
                aria-label="Copy link"
            >
                <span className="material-symbols-outlined text-[20px]">
                    {copied ? 'check' : 'link'}
                </span>
            </button>

            {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 pointer-events-none z-50">
                    Link disalin!
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100"></div>
                </div>
            )}
        </div>
    );
}
