'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function CanvasEditor() {
    const searchParams = useSearchParams();
    const persistenceKey = searchParams.get('id') || 'eraser-clone-default';
    const { theme, resolvedTheme } = useTheme();
    const [editor, setEditor] = useState<any>(null);

    // Sync Theme with Tldraw
    useEffect(() => {
        if (!editor) return;

        const isDark = theme === 'dark' || resolvedTheme === 'dark';
        // Tldraw v4 uses colorScheme instead of isDarkMode
        editor.user.updateUserPreferences({
            colorScheme: isDark ? 'dark' : 'light'
        });
    }, [theme, resolvedTheme, editor]);

    return (
        <div className="w-full h-full relative">
            <style jsx global>{`
                /* Make strokes more visible in dark mode */
                .tl-theme__dark .tl-svg-path-effect,
                .tl-theme__dark .tl-shape path,
                .tl-theme__dark .tl-shape rect,
                .tl-theme__dark .tl-shape ellipse,
                .tl-theme__dark .tl-shape line,
                .tl-theme__dark .tl-shape polyline,
                .tl-theme__dark .tl-shape polygon {
                    stroke-width: 2.5 !important;
                    stroke-opacity: 0.9 !important;
                }

                /* Also improve visibility in light mode */
                .tl-theme__light .tl-svg-path-effect,
                .tl-theme__light .tl-shape path,
                .tl-theme__light .tl-shape rect,
                .tl-theme__light .tl-shape ellipse,
                .tl-theme__light .tl-shape line,
                .tl-theme__light .tl-shape polyline,
                .tl-theme__light .tl-shape polygon {
                    stroke-width: 2.5 !important;
                    stroke-opacity: 1 !important;
                }
            `}</style>
            <Tldraw
                persistenceKey={persistenceKey}
                autoFocus
                onMount={(editor) => setEditor(editor)}
            >
                {/* We can customize the UI here if needed, but the default UI is very Eraser-like */}
            </Tldraw>
        </div>
    );
}
