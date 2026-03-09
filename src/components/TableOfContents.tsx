'use client';

import { useEffect, useState } from 'react';

interface TocItem {
    id: string;
    title: string;
    level: number;
}

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (!toc || toc.length === 0) return;

        const handleScroll = () => {
            let current = '';
            // Define a threshold (e.g. 20% from the top of the viewport)
            const threshold = window.innerHeight * 0.2;

            // Loop through the DOM nodes based on the TOC ids
            for (const item of toc) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the element's top is positioned higher than our threshold line, 
                    // it is potentially our active section. We continually update `current` 
                    // so the last element matching this condition becomes active.
                    if (rect.top <= threshold) {
                        current = item.id;
                    }
                }
            }

            // Fallback: If at the very top of the page, highlight the first item.
            if (!current && toc.length > 0 && window.scrollY < 100) {
                current = toc[0].id;
            }

            setActiveId(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Trigger initially

        return () => window.removeEventListener('scroll', handleScroll);
    }, [toc]);

    if (!toc || toc.length === 0) return null;

    return (
        <nav className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 py-1 space-y-4 text-sm font-medium max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide">
            {toc.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block transition-all duration-300 ${heading.level === 2
                                ? `font-bold ${isActive ? 'text-zinc-900 dark:text-white translate-x-1' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`
                                : `ml-3 text-[13px] ${isActive ? 'text-zinc-900 dark:text-white font-semibold translate-x-1' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`
                            }`}
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                                const offset = 100;
                                const elementPosition = element.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - offset;
                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: "smooth"
                                });
                            }
                        }}
                    >
                        {heading.title}
                    </a>
                );
            })}
        </nav>
    );
}
