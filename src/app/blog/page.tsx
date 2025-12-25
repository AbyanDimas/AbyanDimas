import { getBlogPosts } from "@/lib/markdown";
import BlogList from "@/components/BlogList";

export const metadata = {
    title: "Blog | Profile Dashboard",
    description: "Thoughts, tutorials, and insights.",
};

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Blog</h1>
                    <p className="text-[var(--text-secondary)] text-lg">Thoughts, tutorials, and insights about development.</p>
                </div>

                <BlogList initialPosts={posts} />
            </div>
        </div>
    );
}
