import { getBlogPosts } from "@/lib/markdown";
import Link from "next/link";

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog</h1>
                <p className="text-gray-500">Thoughts, tutorials, and insights.</p>
                <div className="space-y-6 mt-10">
                    {posts.map((post) => (
                        <div key={post.slug} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.author}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                                    {post.title}
                                </Link>
                            </h3>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                                Read More &rarr;
                            </Link>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center text-gray-400">
                            No blog posts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
