'use client';

import { useState, useEffect } from 'react';
import { Link2, Copy, Check, Trash2, QrCode, ExternalLink, BarChart3, Calendar } from 'lucide-react';
import QRCode from 'qrcode';

interface ShortenedURL {
    id: string;
    originalUrl: string;
    shortCode: string;
    createdAt: number;
    clicks: number;
    lastClicked?: number;
}

const STORAGE_KEY = 'url-shortener-data';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

// Generate short code using base62 encoding
function generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Storage functions
function getShortenedURLs(): ShortenedURL[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveShortenedURLs(urls: ShortenedURL[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}

export default function URLShortenerPage() {
    const [originalUrl, setOriginalUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [urls, setUrls] = useState<ShortenedURL[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [selectedUrl, setSelectedUrl] = useState<ShortenedURL | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setUrls(getShortenedURLs());
    }, []);

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleShorten = async () => {
        setError(null);

        // Validation
        if (!originalUrl.trim()) {
            setError('Masukkan URL yang valid');
            return;
        }

        if (!isValidUrl(originalUrl)) {
            setError('Format URL tidak valid. Contoh: https://example.com');
            return;
        }

        // Generate or use custom code
        const shortCode = customCode.trim() || generateShortCode();

        // Check if code already exists
        const existing = urls.find(u => u.shortCode === shortCode);
        if (existing) {
            setError('Kode pendek sudah digunakan. Gunakan kode lain.');
            return;
        }

        const newUrl: ShortenedURL = {
            id: `url-${Date.now()}`,
            originalUrl,
            shortCode,
            createdAt: Date.now(),
            clicks: 0,
        };

        const updatedUrls = [newUrl, ...urls];
        setUrls(updatedUrls);
        saveShortenedURLs(updatedUrls);

        // Reset form
        setOriginalUrl('');
        setCustomCode('');
    };

    const handleCopy = async (shortUrl: string, id: string) => {
        await navigator.clipboard.writeText(shortUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = (id: string) => {
        const updatedUrls = urls.filter(u => u.id !== id);
        setUrls(updatedUrls);
        saveShortenedURLs(updatedUrls);
        if (selectedUrl?.id === id) {
            setSelectedUrl(null);
            setQrCodeUrl(null);
        }
    };

    const handleShowQR = async (url: ShortenedURL) => {
        setSelectedUrl(url);
        const shortUrl = `${BASE_URL}/s/${url.shortCode}`;
        const qrData = await QRCode.toDataURL(shortUrl, { width: 300 });
        setQrCodeUrl(qrData);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 pt-14 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Form & Links */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shorten Form - Premium Card */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Link2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Create Short Link
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Paste your long URL below
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Long URL
                                        </label>
                                        <input
                                            type="url"
                                            value={originalUrl}
                                            onChange={(e) => setOriginalUrl(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                                            placeholder="https://example.com/your/very/long/url/here"
                                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Custom Alias (Optional)
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="flex items-center flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/20">
                                                <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 py-4">
                                                    {BASE_URL}/s/
                                                </span>
                                                <input
                                                    type="text"
                                                    value={customCode}
                                                    onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                                                    placeholder="my-custom-link"
                                                    maxLength={30}
                                                    className="flex-1 px-4 py-4 bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                                            Leave empty for auto-generated code
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-sm text-red-700 dark:text-red-400 flex items-start gap-3">
                                            <span className="text-lg">⚠️</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleShorten}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Link2 className="w-5 h-5" />
                                        Shorten URL Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards - Animated */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Link2 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-4xl font-black text-white mb-1">
                                        {urls.length}
                                    </p>
                                    <p className="text-purple-100 font-medium">
                                        Total Short Links
                                    </p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-4xl font-black text-white mb-1">
                                        {totalClicks}
                                    </p>
                                    <p className="text-blue-100 font-medium">
                                        Total Clicks
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* URLs List - Enhanced Cards */}
                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Your Links
                                </h2>
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
                                    {urls.length} links
                                </span>
                            </div>

                            {urls.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                                        <Link2 className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No links yet
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Create your first short link to get started
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {urls.map((url) => {
                                        const shortUrl = `${BASE_URL}/s/${url.shortCode}`;
                                        return (
                                            <div
                                                key={url.id}
                                                className="group relative bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <a
                                                                href={shortUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-lg font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors truncate flex items-center gap-2 group/link"
                                                            >
                                                                {shortUrl}
                                                                <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                            </a>
                                                            <button
                                                                onClick={() => handleCopy(shortUrl, url.id)}
                                                                className="flex-shrink-0 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                                title="Copy"
                                                            >
                                                                {copiedId === url.id ? (
                                                                    <Check className="w-5 h-5 text-green-500" />
                                                                ) : (
                                                                    <Copy className="w-5 h-5 text-gray-400 hover:text-purple-600" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3 pl-1">
                                                            → {url.originalUrl}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {formatDate(url.createdAt)}
                                                            </span>
                                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-semibold">
                                                                <BarChart3 className="w-3.5 h-3.5" />
                                                                {url.clicks} clicks
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleShowQR(url)}
                                                            className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                                                            title="QR Code"
                                                        >
                                                            <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(url.id)}
                                                            className="p-3 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - QR Code Sticky */}
                    <div className="lg:sticky lg:top-24 self-start">
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-50 blur"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-purple-600" />
                                    QR Code Preview
                                </h3>
                                {qrCodeUrl && selectedUrl ? (
                                    <div className="space-y-6">
                                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 flex items-center justify-center">
                                            <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-[240px] rounded-xl shadow-lg" />
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                            <p className="text-xs font-mono text-purple-900 dark:text-purple-300 text-center break-all">
                                                {BASE_URL}/s/{selectedUrl.shortCode}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <a
                                                href={qrCodeUrl}
                                                download={`qr-${selectedUrl.shortCode}.png`}
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                                            <QrCode className="w-8 h-8 text-purple-500 dark:text-purple-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            No QR Code
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Click QR icon on any link
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
