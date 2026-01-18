'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ShortenedURL {
    id: string;
    originalUrl: string;
    shortCode: string;
    createdAt: number;
    clicks: number;
    lastClicked?: number;
}

const STORAGE_KEY = 'url-shortener-data';

export default function RedirectPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;

    useEffect(() => {
        if (!code) {
            router.push('/url-shortener');
            return;
        }

        // Get URL from localStorage
        const data = localStorage.getItem(STORAGE_KEY);
        const urls: ShortenedURL[] = data ? JSON.parse(data) : [];
        const urlData = urls.find(u => u.shortCode === code);

        if (urlData) {
            // Update click count
            urlData.clicks += 1;
            urlData.lastClicked = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));

            // Redirect to original URL
            window.location.href = urlData.originalUrl;
        } else {
            // URL not found, redirect to shortener page
            router.push('/url-shortener');
        }
    }, [code, router]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-600 dark:text-purple-400 animate-spin" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Mengalihkan...
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Anda akan dialihkan ke URL tujuan
                </p>
            </div>
        </div>
    );
}
