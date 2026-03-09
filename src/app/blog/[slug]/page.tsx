import { getPostData, getBlogPosts } from "@/lib/markdown";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";
import MarkdownViewer from "@/components/MarkdownViewer";
import CopyLinkButton from "@/components/CopyLinkButton";
import TableOfContents from "@/components/TableOfContents";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { Metadata } from "next";

export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostData(slug);
    const postUrl = `https://abyandimas.me/blog/${slug}`;

    return {
        title: `${post.title} | Abyan Dimas`,
        description: post.excerpt,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: post.coverImage || '/banner.png',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage || '/banner.png'],
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);
    const allPosts = await getBlogPosts();

    // Randomly select 2 other posts
    const otherPosts = allPosts
        .filter(p => p.slug !== slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    const shareUrl = `https://abyandimas.me/blog/${slug}`;
    const shareText = `Check out this article: ${post.title}`;

    return (
        <div className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-[#0a0a0a]">
            <ReadingProgressBar />
            <div className="max-w-[1400px] mx-auto">
                <article>
                    {/* JSON-LD Structured Data for Google Rich Results */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'BlogPosting',
                                headline: post.title,
                                image: post.coverImage ? [post.coverImage] : ['https://abyandimas.me/banner.png'],
                                datePublished: post.date,
                                dateModified: post.date,
                                author: [{
                                    '@type': 'Person',
                                    name: post.author,
                                    url: 'https://abyandimas.me'
                                }],
                                description: post.excerpt,
                                mainEntityOfPage: {
                                    '@type': 'WebPage',
                                    '@id': shareUrl
                                }
                            })
                        }}
                    />

                    {/* Top Header Section (Spans full center width) */}
                    <div className="max-w-[900px] mx-auto mb-16">
                        <Link href="/blog" className="flex justify-end items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-10 transition-colors">
                            Back <span className="material-symbols-outlined text-[16px] -scale-x-100 hover:text-zinc-900 dark:hover:text-white">arrow_back</span>
                        </Link>

                        {/* Tags / Badges */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                {post.tags.map((tag, i) => (
                                    <span key={tag} className={`px-3 py-1 rounded-[6px] text-[10px] font-bold tracking-widest uppercase border ${i === 0
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-transparent'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                                        }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title & Excerpt */}
                        <h1 className="text-4xl md:text-[56px] font-bold text-zinc-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                            {post.title}
                        </h1>
                        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed mb-12 max-w-3xl font-medium">
                            {post.excerpt}
                        </p>

                        {/* Hero Image Container */}
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.3/1] bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm flex items-center justify-center p-2">
                            {post.coverImage ? (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 900px"
                                    className="object-cover rounded-[1.25rem] shadow-sm"
                                />
                            ) : (
                                <div className="w-full h-full bg-white dark:bg-[#111] rounded-[1.25rem] shadow-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-[64px] text-zinc-300 dark:text-zinc-700 mb-2">image</span>
                                        <span className="text-zinc-400 dark:text-zinc-600 font-medium text-sm">Play video</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Meta: Date & Read Time */}
                        <div className="flex items-center gap-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400 py-4 border-b border-zinc-200 dark:border-zinc-800">
                            <span>{post.date}</span>
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span>5 mins read</span>
                            </div>
                        </div>
                    </div>

                    {/* 3-Column Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_80px] gap-12 max-w-[1200px] mx-auto items-start">

                        {/* Left Sidebar: Table of Contents */}
                        <aside className="hidden lg:block sticky top-32">
                            {post.toc && post.toc.length > 0 && (
                                <TableOfContents toc={post.toc} />
                            )}
                        </aside>

                        {/* Center: Main Article Content */}
                        <div className="min-w-0">
                            <MarkdownViewer html={post.contentHtml} />
                        </div>

                        {/* Right Sidebar: Social Sharing */}
                        <aside className="hidden lg:flex flex-col items-center gap-6 sticky top-32 pt-2">
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-blue-700 dark:hover:bg-zinc-800 dark:hover:text-blue-500 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-sky-500 dark:hover:bg-zinc-800 dark:hover:text-sky-400 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-blue-800 dark:hover:bg-zinc-800 dark:hover:text-blue-600 transition-colors"
                            >
                                {/* Generic Facebook icon replacement or share link */}
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.239 3h-2.761v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z" /></svg>
                            </a>
                            <CopyLinkButton
                                url={shareUrl}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                            />
                        </aside>
                    </div>
                </article>

                {/* Mobile Share Buttons (Visible only on small screens) */}
                <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 lg:hidden max-w-[900px] mx-auto">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">share</span>
                        Share this article
                    </h3>
                    <div className="flex gap-4">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-sky-500 hover:text-white rounded-xl transition-all text-zinc-600 dark:text-zinc-400"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-blue-700 hover:text-white rounded-xl transition-all text-zinc-600 dark:text-zinc-400"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-green-500 hover:text-white rounded-xl transition-all text-zinc-600 dark:text-zinc-400"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                        </a>
                        <CopyLinkButton
                            url={shareUrl}
                            className="p-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white rounded-xl transition-all text-zinc-600 dark:text-zinc-400"
                        />
                    </div>
                </div>

                {/* Read Next Section */}
                {otherPosts.length > 0 && (
                    <section className="mt-24 pt-16 border-t border-zinc-200 dark:border-zinc-800 max-w-[900px] mx-auto">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Read Next</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {otherPosts.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                                        {p.title}
                                    </h3>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-[15px] leading-relaxed line-clamp-2 mb-6 font-medium">
                                        {p.excerpt}
                                    </p>
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        Read Article <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
