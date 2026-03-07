'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
        );
    }

    const themes = [
        { id: 'light', icon: 'light_mode', label: 'Light' },
        { id: 'dark', icon: 'dark_mode', label: 'Dark' },
        { id: 'system', icon: 'desktop_windows', label: 'System' },
        { id: 'tokyonight', icon: 'view_kanban', label: 'Tokyo Night' },
    ];

    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className="relative group">
            <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle Theme"
            >
                <span className="material-symbols-outlined text-[20px] text-gray-600 dark:text-gray-300">{currentTheme.icon}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">
                    {currentTheme.label}
                </span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-40 py-2 bg-white dark:bg-[#1a1b26] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 ${theme === t.id ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
