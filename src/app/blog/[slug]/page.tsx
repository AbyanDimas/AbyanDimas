import { getPostData } from "@/lib/markdown";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
                    url: '/banner.png', // Or a specific blog image if available
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

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Blog</span>
                </Link>

                <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm">
                    <header className="mb-10">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">{post.title}</h1>
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
                </article>
            </div>
        </div>
    );
}
