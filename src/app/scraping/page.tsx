'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ExternalLink, Star, MessageCircle, Users, GitBranch, Globe, TrendingUp, Hash, Download, Copy, History, Youtube, Sparkles, Clock, MapPin } from 'lucide-react';
import { scrapeWikipedia, scrapeGitHub, scrapeReddit, scrapeHackerNews, scrapeProductHunt, scrapeYouTube, scrapeGoogleMaps } from '../actions/scraper';

type TabType = 'wikipedia' | 'github' | 'reddit' | 'hackernews' | 'producthunt' | 'youtube' | 'googlemaps';

interface SearchHistory {
    tab: TabType;
    query: string;
    timestamp: number;
}

export default function ScrapingPage() {
    const [activeTab, setActiveTab] = useState<TabType>('wikipedia');
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [itemLimit, setItemLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('scrape-history');
        if (saved) {
            setSearchHistory(JSON.parse(saved));
        }
    }, []);

    const saveToHistory = (tab: TabType, query: string) => {
        const newHistory = [
            { tab, query, timestamp: Date.now() },
            ...searchHistory.filter(h => !(h.tab === tab && h.query === query)).slice(0, 9)
        ];
        setSearchHistory(newHistory);
        localStorage.setItem('scrape-history', JSON.stringify(newHistory));
    };

    const handleSearch = async () => {
        if (!query.trim() && !['hackernews', 'producthunt'].includes(activeTab)) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            let response;
            switch (activeTab) {
                case 'wikipedia':
                    response = await scrapeWikipedia(query);
                    saveToHistory('wikipedia', query);
                    break;
                case 'github':
                    response = await scrapeGitHub(query, itemLimit);
                    saveToHistory('github', query);
                    break;
                case 'reddit':
                    response = await scrapeReddit(query, itemLimit);
                    saveToHistory('reddit', query);
                    break;
                case 'hackernews':
                    response = await scrapeHackerNews(itemLimit);
                    break;
                case 'producthunt':
                    response = await scrapeProductHunt(itemLimit);
                    break;
                case 'youtube':
                    response = await scrapeYouTube(query, itemLimit);
                    saveToHistory('youtube', query);
                    break;
                case 'googlemaps':
                    response = await scrapeGoogleMaps(query, location);
                    saveToHistory('googlemaps', query);
                    break;
            }

            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.error || 'Terjadi kesalahan');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data');
        } finally {
            setLoading(false);
        }
    };

    const exportToJSON = () => {
        const dataStr = JSON.stringify(result, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `scrape-${activeTab}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'wikipedia', name: 'Wikipedia', icon: Globe, placeholder: 'Cari artikel Wikipedia...', example: 'Indonesia' },
        { id: 'github', name: 'GitHub', icon: GitBranch, placeholder: 'Username GitHub...', example: 'torvalds' },
        { id: 'reddit', name: 'Reddit', icon: Hash, placeholder: 'Nama subreddit...', example: 'programming' },
        { id: 'youtube', name: 'YouTube', icon: Youtube, placeholder: 'Cari video...', example: 'web scraping tutorial' },
        { id: 'googlemaps', name: 'Google Maps', icon: MapPin, placeholder: 'Cari tempat...', example: 'restaurant' },
        { id: 'hackernews', name: 'Hacker News', icon: TrendingUp, placeholder: 'Top stories (auto)', example: '' },
        { id: 'producthunt', name: 'Product Hunt', icon: Sparkles, placeholder: 'Today products (auto)', example: '' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);
    const currentHistory = searchHistory.filter(h => h.tab === activeTab).slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 pt-7 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                        Web Scraper Pro
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ambil data dari berbagai sumber web dengan fitur lengkap
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-3 justify-center mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as TabType);
                                    setResult(null);
                                    setError('');
                                    setQuery('');
                                }}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                            </button>
                        );
                    })}
                </div>

                {/* Item Limit Selector */}
                {!['wikipedia', 'googlemaps'].includes(activeTab) && (
                    <div className="flex items-center gap-3 justify-center mb-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jumlah Item:</span>
                        {[5, 10, 20, 50].map((limit) => (
                            <button
                                key={limit}
                                onClick={() => setItemLimit(limit)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${itemLimit === limit
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {limit}
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Box */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
                            <div className="flex gap-3 mb-3">
                                {!['hackernews', 'producthunt'].includes(activeTab) && (
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            onFocus={() => setShowHistory(true)}
                                            placeholder={currentTab?.placeholder}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                        {/* History Dropdown */}
                                        {showHistory && currentHistory.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10 max-h-48 overflow-y-auto">
                                                {currentHistory.map((item, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setQuery(item.query);
                                                            setShowHistory(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                                                    >
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-gray-900 dark:text-white">{item.query}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'googlemaps' && (
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Lokasi (opsional)..."
                                        className="w-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                )}
                                <button
                                    onClick={handleSearch}
                                    disabled={loading || (!query.trim() && !['hackernews', 'producthunt'].includes(activeTab))}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            {['hackernews', 'producthunt'].includes(activeTab) ? 'Load' : 'Cari'}
                                        </>
                                    )}
                                </button>
                            </div>
                            {currentTab?.example && !['hackernews', 'producthunt'].includes(activeTab) && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    Contoh: <button onClick={() => { setQuery(currentTab.example); setShowHistory(false); }} className="text-purple-600 dark:text-purple-400 hover:underline">{currentTab.example}</button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                {result && (
                    <div className="max-w-3xl mx-auto mb-6 flex gap-3 justify-end">
                        <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Copy className="w-4 h-4" />
                            {copied ? 'Copied!' : 'Copy JSON'}
                        </button>
                        <button
                            onClick={exportToJSON}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Export JSON
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'wikipedia' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                                <div className="flex gap-6">
                                    {result.thumbnail && (
                                        <img src={result.thumbnail} alt={result.title} className="w-32 h-32 object-cover rounded-xl" />
                                    )}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{result.title}</h2>
                                        {result.description && (
                                            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">{result.description}</p>
                                        )}
                                        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{result.extract}</p>
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline"
                                        >
                                            Baca selengkapnya <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'github' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                                    <div className="flex items-start gap-6">
                                        <img src={result.avatar} alt={result.name} className="w-24 h-24 rounded-full" />
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{result.name}</h2>
                                            <p className="text-purple-600 dark:text-purple-400 mb-3">@{result.login}</p>
                                            {result.bio && <p className="text-gray-700 dark:text-gray-300 mb-4">{result.bio}</p>}
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">{result.followers} followers</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GitBranch className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-700 dark:text-gray-300">{result.publicRepos} repos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Repositories</h3>
                                    {result.repos.map((repo: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{repo.name}</h4>
                                                    {repo.description && <p className="text-sm text-gray-600 dark:text-gray-400">{repo.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    {repo.language && (
                                                        <span className="text-gray-600 dark:text-gray-400">{repo.language}</span>
                                                    )}
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <Star className="w-4 h-4" />
                                                        {repo.stars}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reddit' && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">r/{result.subreddit}</h3>
                                {result.posts.map((post: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={post.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            {post.thumbnail && (
                                                <img src={post.thumbnail} alt="" className="w-20 h-20 object-cover rounded-lg" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{post.title}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>u/{post.author}</span>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4" />
                                                        {post.score}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MessageCircle className="w-4 h-4" />
                                                        {post.comments}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {activeTab === 'youtube' && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">YouTube Results</h3>
                                {result.videos && result.videos.length > 0 ? (
                                    result.videos.map((video: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                                        >
                                            <div className="flex gap-4">
                                                <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover" />
                                                <div className="flex-1 p-4">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{video.title}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                        <span>{video.channel}</span>
                                                        <span>{video.views}</span>
                                                        {video.duration && <span>{video.duration}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-500 py-8">No videos found</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'hackernews' && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Stories</h3>
                                {result.stories.map((story: any, idx: number) => (
                                    <a
                                        key={idx}
                                        href={story.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{story.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span>by {story.by}</span>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                {story.score} points
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                {story.comments} comments
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}

                        {activeTab === 'producthunt' && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today on Product Hunt</h3>
                                {result.products.map((product: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="block bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{product.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.tagline}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'googlemaps' && (
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Google Maps Results: {result.query}</h3>
                                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        💡 <strong>Note:</strong> Google Maps data is heavily JavaScript-rendered. For production applications, use the official <a href="https://developers.google.com/maps/documentation/places/web-service/overview" target="_blank" className="underline">Google Places API</a> for reliable and complete data.
                                    </p>
                                </div>
                                {result.places.map((place: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="block bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-800"
                                    >
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{place.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{place.address}</p>
                                                {place.rating && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        <Star className="w-4 h-4 text-yellow-500" />
                                                        <span>{place.rating}</span>
                                                        {place.type && <span className="text-gray-400">• {place.type}</span>}
                                                    </div>
                                                )}
                                                {place.note && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">{place.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
