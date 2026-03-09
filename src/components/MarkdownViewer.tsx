'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface MarkdownViewerProps {
    html: string;
}

export default function MarkdownViewer({ html }: MarkdownViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Image Lightbox ---
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [lightboxAlt, setLightboxAlt] = useState<string>('');

    const closeLightbox = useCallback(() => setLightboxSrc(null), []);

    // Escape key closes lightbox
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [closeLightbox]);

    // Lock body scroll when lightbox open
    useEffect(() => {
        document.body.style.overflow = lightboxSrc ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightboxSrc]);

    // --- Mermaid diagram rendering ---
    useEffect(() => {
        const renderMermaid = async () => {
            if (!containerRef.current) return;
            const mermaidBlocks = containerRef.current.querySelectorAll<HTMLElement>('code.language-mermaid');
            if (mermaidBlocks.length === 0) return;

            const mermaid = (await import('mermaid')).default;
            mermaid.initialize({
                startOnLoad: false,
                theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
                themeVariables: {
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '14px',
                    primaryColor: '#6366f1',
                    primaryTextColor: '#fff',
                    primaryBorderColor: '#4f46e5',
                    lineColor: '#94a3b8',
                    secondaryColor: '#f1f5f9',
                    tertiaryColor: '#e2e8f0',
                },
                flowchart: { curve: 'basis', useMaxWidth: true },
                sequence: { actorFontFamily: 'Inter, system-ui, sans-serif' },
            });

            for (const block of Array.from(mermaidBlocks)) {
                const pre = block.closest('pre');
                if (!pre || pre.dataset.mermaidRendered === '1') continue;
                pre.dataset.mermaidRendered = '1';

                const graphDef = block.textContent ?? '';
                const id = `mermaid-${Math.random().toString(36).slice(2)}`;

                try {
                    const { svg } = await mermaid.render(id, graphDef);

                    // If Mermaid rendered an error SVG, hide the block silently
                    if (
                        svg.includes('Syntax error') ||
                        svg.includes('mermaid-error') ||
                        svg.includes('#arrow-error') ||
                        svg.includes('Parse error')
                    ) {
                        pre.style.display = 'none';
                        continue;
                    }

                    const wrapper = document.createElement('div');
                    wrapper.className = 'mermaid-diagram';
                    wrapper.innerHTML = svg;
                    wrapper.style.cssText = `
                        background: transparent;
                        text-align: center;
                        overflow: auto;
                        padding: 24px 12px;
                        border-radius: 16px;
                        border: 1px solid var(--mermaid-border, rgba(99,102,241,0.2));
                        margin: 2rem 0;
                        animation: mermaid-fade-in 0.5s ease both;
                    `;

                    // Make the SVG responsive
                    const svgEl = wrapper.querySelector('svg');
                    if (svgEl) {
                        svgEl.style.maxWidth = '100%';
                        svgEl.style.height = 'auto';
                        svgEl.removeAttribute('width');
                        svgEl.removeAttribute('height');
                    }

                    pre.replaceWith(wrapper);
                } catch (e) {
                    console.error('Mermaid render error:', e);
                }
            }
        };

        renderMermaid();
    }, [html]);

    // --- Code copy buttons + Image delegation (only re-runs when html changes) ---
    useEffect(() => {
        if (!containerRef.current) return;

        // ── Copy buttons for code blocks ──
        const preBlocks = containerRef.current.querySelectorAll('pre');
        preBlocks.forEach((pre) => {
            if (pre.querySelector('.copy-button')) return;

            pre.style.position = 'relative';
            pre.classList.add('group');

            const button = document.createElement('button');
            button.className =
                'copy-button absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-700/80 dark:hover:bg-zinc-600 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 border border-zinc-300/50 dark:border-zinc-600/50';
            button.title = 'Salin kode';
            button.setAttribute('aria-label', 'Copy code');

            const iconEl = document.createElement('span');
            iconEl.className = 'material-symbols-outlined';
            iconEl.style.fontSize = '16px';
            iconEl.textContent = 'content_copy';
            button.appendChild(iconEl);

            button.onclick = () => {
                const codeNode = pre.querySelector('code');
                const textToCopy = codeNode ? codeNode.innerText : pre.innerText;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    iconEl.textContent = 'check';
                    iconEl.style.color = '#22c55e';
                    button.style.opacity = '1';

                    setTimeout(() => {
                        iconEl.textContent = 'content_copy';
                        iconEl.style.color = '';
                        button.style.opacity = '';
                    }, 2000);
                });
            };

            pre.appendChild(button);
        });

        // ── Image click → lightbox (event delegation) ──
        const handleImgClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                const img = target as HTMLImageElement;
                setLightboxSrc(img.src);
                setLightboxAlt(img.alt || '');
            }
        };
        containerRef.current.addEventListener('click', handleImgClick);

        // Style images as zoomable
        containerRef.current.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
            img.style.cursor = 'zoom-in';
        });

        return () => {
            containerRef.current?.removeEventListener('click', handleImgClick);
        };
    }, [html]);

    return (
        <>
            {/* ── Mermaid animation keyframes ── */}
            <style>{`
                @keyframes mermaid-fade-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .mermaid-diagram svg {
                    font-family: 'Inter', system-ui, sans-serif !important;
                }
                :root { --mermaid-border: rgba(99,102,241,0.2); }
                .dark { --mermaid-border: rgba(99,102,241,0.3); }
            `}</style>

            {/* ── Markdown content ── */}
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
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:w-full prose-img:transition-transform prose-img:hover:scale-[1.01]
                prose-table:w-full prose-table:border-collapse
                prose-th:text-zinc-900 dark:prose-th:text-white prose-th:font-bold prose-th:border prose-th:border-zinc-300 dark:prose-th:border-zinc-700 prose-th:px-4 prose-th:py-3 prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800
                prose-td:text-zinc-700 dark:prose-td:text-zinc-100 prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-700 prose-td:px-4 prose-td:py-3
                prose-tr:border-b prose-tr:border-zinc-200 dark:prose-tr:border-zinc-700
                "
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* ── Image Lightbox ── */}
            {lightboxSrc && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
                        aria-label="Close preview"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>

                    <div
                        className="relative max-w-6xl max-h-[90vh] w-full animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={lightboxSrc}
                            alt={lightboxAlt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain max-h-[85vh] rounded-xl shadow-2xl"
                        />
                        {lightboxAlt && (
                            <p className="text-center text-white/60 text-sm mt-3 font-medium">{lightboxAlt}</p>
                        )}
                    </div>

                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
                        Klik di luar gambar atau tekan ESC untuk menutup
                    </p>
                </div>,
                document.body
            )}
        </>
    );
}
