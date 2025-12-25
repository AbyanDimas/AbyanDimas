'use client';

import Link from 'next/link';
import { CloudOff, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-6 text-center">

            {/* Icon & Glitch Effect Container */}
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                <CloudOff className="w-32 h-32 text-[var(--text-secondary)] relative z-10 animate-pulse" />
            </div>

            {/* 404 Text */}
            <h1 className="text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tighter">
                404
            </h1>

            {/* Message */}
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                Lost in the Cloud?
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mb-10 leading-relaxed">
                The page you're looking for seems to have drifted away or doesn't exist in this region.
            </p>

            {/* Action Button */}
            <Link
                href="/"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
            >
                <Home className="w-4 h-4" />
                Return to Home
            </Link>

        </div>
    );
}
