import { getPostData, getBlogPosts } from "@/lib/markdown";
import Link from "next/link";
import { ArrowLeft, Share2, Twitter, Linkedin, MessageCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostData(slug);

    return {
        title: `${post.title} | Profile Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: '/banner.png',
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
            images: ['/banner.png'],
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
        .slice(0, 2);

    const shareUrl = `https://abyandimasrmussyafa.vercel.app/blog/${slug}`;
    const shareText = `Check out this article: ${post.title}`;

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Blog</span>
                </Link>

                <article className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 md:p-12 rounded-3xl shadow-sm mb-12">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-4">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">{post.title}</h1>
                    </header>

                    <div
                        className="prose prose-lg max-w-none 
                        prose-headings:font-bold prose-headings:text-[var(--text-primary)] 
                        prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-p:my-6
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-[var(--text-primary)]
                        prose-li:text-[var(--text-secondary)]
                        prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                        prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                        dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                    />

                    {/* Share Buttons */}
                    <div className="mt-12 pt-8 border-t border-[var(--card-border)]">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share this article
                        </h3>
                        <div className="flex gap-4">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-[var(--card-hover)] hover:bg-blue-500 hover:text-white rounded-xl transition-all text-[var(--text-secondary)]"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-[var(--card-hover)] hover:bg-blue-700 hover:text-white rounded-xl transition-all text-[var(--text-secondary)]"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-[var(--card-hover)] hover:bg-green-500 hover:text-white rounded-xl transition-all text-[var(--text-secondary)]"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </article>

                {/* Random/Related Articles */}
                {otherPosts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Read Next</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {otherPosts.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:border-blue-500/50">
                                    <h3 className="font-bold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                        {p.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4">
                                        {p.excerpt}
                                    </p>
                                    <span className="text-xs font-semibold text-blue-600 group-hover:underline">Read Article</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
