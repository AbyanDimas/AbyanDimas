'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { BlogPostData } from '@/lib/markdown';

interface BlogListProps {
    initialPosts: BlogPostData[];
}

const CATEGORIES = ['All', 'Engineering', 'Infrastructure', 'Tools', 'Tutorials', 'Design'];

export default function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
    const postsPerPage = 12; // Adjusted to evenly fit grid after hero

    // Filter posts based on search query and category
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            // Since we don't have real categories in BlogPostData yet, 
            // we will simulate category filtering by checking tags or if 'All' is selected.
            // For now, let's just use 'All' or randomly assign for demo, or match full if 'All'.
            const matchesCategory = activeCategory === 'All'; // Adjust if real categories are added
            return matchesSearch && matchesCategory;
        });
    }, [initialPosts, searchQuery, activeCategory]);

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

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
        setCurrentPage(1);
    }

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

    // We use the first 3 posts as the Hero slider, only if on page 1, search is empty, category is All
    const isDefaultView = currentPage === 1 && searchQuery === '' && activeCategory === 'All';
    const heroPostsCount = Math.min(3, currentPosts.length);
    const heroPosts = isDefaultView ? currentPosts.slice(0, heroPostsCount) : [];
    const heroPost = heroPosts.length > 0 ? heroPosts[currentHeroIndex % heroPostsCount] : null;
    const gridPosts = isDefaultView ? currentPosts.slice(heroPostsCount) : currentPosts;

    useEffect(() => {
        if (!isDefaultView || heroPostsCount <= 1) return;
        const interval = setInterval(() => {
            setCurrentHeroIndex((prev) => (prev + 1) % heroPostsCount);
        }, 5000);
        return () => clearInterval(interval);
    }, [isDefaultView, heroPostsCount]);

    return (
        <div className="space-y-16 animate-in fade-in duration-500 font-sans">
            {/* Hero Section */}
            {heroPosts.length > 0 && (
                <div className="relative mb-24 lg:mb-32">
                    {/* Maintain layout space since content will be absolute positioned */}
                    <div className="hidden lg:block w-full" style={{ paddingBottom: '45%' }}></div>
                    <div className="block lg:hidden w-full" style={{ paddingBottom: '120%' }}></div>

                    {heroPosts.map((post, index) => {
                        const isActive = index === currentHeroIndex;
                        return (
                            <div
                                key={post.slug}
                                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10 translate-y-0 pointer-events-auto' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
                                    {/* Left: Image with decorative background */}
                                    <Link href={`/blog/${post.slug}`} className="relative block group w-full lg:w-[85%] mx-auto lg:mx-0 h-full max-h-[500px]">
                                        {/* Decorative Background Pattern/Shadow */}
                                        <div className="absolute inset-0 bg-transparent rounded-[1.5rem] transform translate-x-4 -translate-y-4 opacity-50 pointer-events-none transition-transform group-hover:translate-x-6 group-hover:-translate-y-6 duration-300 border border-zinc-200 dark:border-zinc-800" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }}>
                                            <div className="w-full h-full dark:hidden" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                            <div className="w-full h-full hidden dark:block" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                        </div>

                                        {/* Image */}
                                        <div className="relative z-10 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full h-full overflow-hidden rounded-[1.5rem] shadow-2xl bg-zinc-100 dark:bg-zinc-800">
                                            {post.coverImage ? (
                                                <Image
                                                    src={post.coverImage}
                                                    alt={`Cover image for ${post.title}`}
                                                    fill
                                                    priority={index === 0}
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[64px] text-zinc-400">image</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Right: Content */}
                                    <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                                        <span className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-6 block">Latest Post</span>
                                        <Link href={`/blog/${post.slug}`} className="group inline-block">
                                            <h2 className={`text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 leading-[1.1] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform duration-700 ease-out delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                                {post.title}
                                            </h2>
                                        </Link>

                                        <div className={`flex items-center justify-center lg:justify-start gap-2 text-zinc-600 dark:text-zinc-400 text-sm font-medium mb-10 transform duration-700 ease-out delay-200 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                            <span>{post.date}</span>
                                            <span>/</span>
                                            <span>{post.author}</span>
                                        </div>

                                        <div className={`transform duration-700 ease-out delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                                            <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                                                Read more <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Slider Navigation Dots */}
                    {heroPostsCount > 1 && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                            {heroPosts.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentHeroIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentHeroIndex === idx
                                        ? 'bg-zinc-900 dark:bg-zinc-100 scale-110 w-8'
                                        : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Categories & Search Bar */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center py-4 border-y border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-30 rounded-xl p-4">
                {/* Categories */}
                <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap text-sm">Categories:</span>
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`whitespace-nowrap font-medium text-sm transition-colors ${activeCategory === category ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72 shrink-0 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[18px] text-zinc-400">search</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a keyword..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-8 pr-4 py-2 bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-0 text-sm transition-colors placeholder:font-normal font-medium"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="pt-8">
                {gridPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-x-8">
                        {gridPosts.map((post) => (
                            <div key={post.slug} className="flex flex-col group h-full">
                                <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-xl mb-6 relative aspect-[3/2] bg-zinc-100 dark:bg-zinc-800">
                                    {post.coverImage ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${post.coverImage})` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                            <span className="material-symbols-outlined text-[48px]">image</span>
                                        </div>
                                    )}
                                </Link>
                                <h3 className="text-xl md:text-[22px] font-bold text-zinc-900 dark:text-zinc-100 mb-3 leading-snug">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                    {post.date}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-[48px] text-zinc-300 md:mb-4">search_off</span>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No articles found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your search or category filter.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center flex-wrap items-center gap-2 mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all font-medium text-sm disabled:cursor-not-allowed hidden sm:block mr-2"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 py-1 text-zinc-400 font-medium text-sm">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(Number(page))}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentPage === page
                                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                                            : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-all font-medium text-sm disabled:cursor-not-allowed hidden sm:block ml-2"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

