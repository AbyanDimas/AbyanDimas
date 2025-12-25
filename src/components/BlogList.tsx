'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, FileText, Sparkles, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPostData } from '@/lib/markdown';

interface BlogListProps {
    initialPosts: BlogPostData[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 7; // 1 Hero + 6 Grid items on first page

    // Filter posts based on search query
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialPosts, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const currentPosts = useMemo(() => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    }, [filteredPosts, currentPage, postsPerPage]);

    // Reset to page 1 when search changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Pagination Logic
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Search Bar & Header Controls */}
            {/* Header: Title & Search */}
            <div className="flex flex-col md:flex-row gap-8 justify-between items-end mb-20 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
                        Writing<span className="text-blue-600">.</span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md leading-relaxed">
                        Insights on software engineering, infrastructure, and the tools that power the web.
                    </p>
                </div>

                <div className="w-full md:w-auto">
                    <div className="relative group min-w-[300px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 border-none rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredPosts.length > 0 ? (
                <>
                    {/* Hero Post - Only show on first page when looking at all posts */}
                    {currentPage === 1 && searchQuery === '' && currentPosts.length > 0 && (
                        <div className="mb-16">
                            <Link href={`/blog/${currentPosts[0].slug}`} className="group relative block">
                                <div className="relative h-[400px] w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                                    {/* Background Image / Blur */}
                                    {currentPosts[0].coverImage && (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${currentPosts[0].coverImage})` }}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-400/30">
                                            <Sparkles className="w-3 h-3" /> Featured
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                                            {currentPosts[0].title}
                                        </h2>
                                        <p className="text-zinc-200 text-lg line-clamp-2 md:line-clamp-none mb-6 max-w-2xl">
                                            {currentPosts[0].excerpt}
                                        </p>
                                        <div className="flex items-center gap-6 text-zinc-300 text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-white/10 rounded-full">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                {currentPosts[0].author}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-white/10 rounded-full">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                {currentPosts[0].date}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* 
                            If Page 1 & No Search: Skip first item (Hero)
                            Else: Show all items
                        */}
                        {currentPosts.slice((currentPage === 1 && searchQuery === '') ? 1 : 0).map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    {post.coverImage ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${post.coverImage})` }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-300">
                                            <FileText className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {post.date}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[100px]">
                                                {post.author}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                                            Read <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No articles found</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                        We couldn't find any articles matching "{searchQuery}". Try searching for something else.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                        className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                    >
                        Clear Search
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-20">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-4 py-2 text-zinc-400 font-medium">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(Number(page))}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500/50 hover:text-blue-500'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    <div className="sm:hidden flex items-center px-4 font-medium text-zinc-600 dark:text-zinc-400">
                        Page {currentPage} of {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
