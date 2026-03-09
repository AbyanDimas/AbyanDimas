'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight > 0) {
                const scrolled = (currentScroll / scrollHeight) * 100;
                setProgress(scrolled);
            } else {
                setProgress(0);
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Initial check

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[100]">
            <div
                className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
