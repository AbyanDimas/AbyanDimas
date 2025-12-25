'use client';

import Link from "next/link";
import { Search, Bookmark, Users, Bell, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function Header() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if (path === '/') return 'Home';
        const segment = path.split('/')[1];
        return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Home';
    };

    const currentPageTitle = getPageTitle(pathname);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigateToPage(searchQuery);
    };

    const navigateToPage = (query: string) => {
        const pages = ['projects', 'services', 'blog', 'contact', 'home'];
        const lowerQuery = query.toLowerCase();

        const matchedPage = pages.find(p => p.includes(lowerQuery));
        if (matchedPage) {
            router.push(matchedPage === 'home' ? '/' : `/${matchedPage}`);
            setSearchQuery("");
            setSuggestions([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 0) {
            const pages = ['projects', 'services', 'blog', 'contact', 'home'];
            const filtered = pages.filter(p => p.includes(value.toLowerCase()));
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <header className="bg-[var(--card-bg)] border-b border-[var(--card-border)] sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                {/* Left Section: Logo & Nav */}
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block text-[var(--text-primary)]">Abyan Dimas</span>
                    </Link>

                    {/* Mobile Navigation Dropdown */}
                    <div className="relative lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center gap-1 font-bold text-[var(--text-primary)] text-sm"
                        >
                            {currentPageTitle}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-lg z-50 py-1">
                                {['Home', 'Projects', 'Services', 'Blog', 'Contact'].map((page) => {
                                    const path = page === 'Home' ? '/' : `/${page.toLowerCase()}`;
                                    const isActive = pathname === path;
                                    return (
                                        <Link
                                            key={page}
                                            href={path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-2 text-sm ${isActive ? 'text-blue-600 font-bold bg-[var(--card-hover)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]'
                                                }`}
                                        >
                                            {page}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative hidden md:block group">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-1.5 rounded-lg border border-[var(--input-border)] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-64">
                            <Search className="w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                                value={searchQuery}
                                onChange={handleInputChange}
                                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                            />
                        </form>

                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--card-border)] py-2 z-50">
                                <div className="px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Suggested Pages</div>
                                {suggestions.map(page => (
                                    <button
                                        key={page}
                                        onClick={() => navigateToPage(page)}
                                        className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <Search className="w-3 h-3 text-[var(--text-muted)]" />
                                        <span className="capitalize">{page}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
                    <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
                        Home
                    </Link>
                    <Link href="/projects" className="hover:text-[var(--text-primary)] transition-colors">
                        Projects
                    </Link>
                    <Link href="/services" className="hover:text-[var(--text-primary)] transition-colors">
                        Services
                    </Link>
                    <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">
                        Blog
                    </Link>
                    <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <button className="p-2 hover:bg-[var(--card-hover)] rounded-full transition-colors text-[var(--text-secondary)]">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-[var(--card-hover)] rounded-full transition-colors text-[var(--text-secondary)]">
                            <Link href="/contact" className="hover:text-[var(--text-primary)] transition-colors">
                                <Users className="w-5 h-5" />
                            </Link>
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <ThemeToggle />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                            className="w-8 h-8 rounded-full bg-[var(--card-border)] overflow-hidden border border-[var(--card-border)] hover:ring-2 hover:ring-[var(--card-border)] transition-all"
                        >
                            <img src="/avatar.png" alt="Profile" className="w-full h-full object-cover" />
                        </button>

                        {/* Mobile Avatar Menu */}
                        {isAvatarMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl z-50 p-4 flex flex-col gap-4 lg:hidden">
                                {/* Styled Name */}
                                <div>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Signed in as</p>
                                    <h3 className="font-extrabold text-xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Jenny Wilson</h3>
                                </div>

                                <hr className="border-[var(--card-border)]" />

                                {/* Mobile Search */}
                                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[var(--input-bg)] px-3 py-2 rounded-lg border border-[var(--input-border)] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                    <Search className="w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Search pages..."
                                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                                        value={searchQuery}
                                        onChange={handleInputChange}
                                    />
                                </form>

                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[var(--text-primary)]">Theme</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
