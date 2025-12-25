'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { BlogPostData } from '@/lib/markdown';

interface BlogListProps {
    initialPosts: BlogPostData[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

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

    // Generate page numbers for "breadcrumb" style pagination
    const getPageNumbers = () => {
        const pages = [];
        // Always show first, last, current, and neighbors.
        // For simplicity with < 20 pages, we can just show standard ranges or all if small.
        // User asked for "breadcrumbs" style when > 20. 
        // Let's implement a smart visible range.

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
        <div>
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-12">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-11 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                />
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
                {currentPosts.map((post) => (
                    <div key={post.slug} className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-blue-500/50 group">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-2">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-blue-600 transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                                {post.title}
                            </Link>
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">{post.excerpt}</p>
                        <Link href={`/blog/${post.slug}`} className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                            Read More &rarr;
                        </Link>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
                <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--input-border)] mb-4">
                        <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No articles found</h3>
                    <p className="text-[var(--text-secondary)]">Try adjusting your search terms.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-[var(--text-muted)]">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(Number(page))}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all ${currentPage === page
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--card-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next Page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
