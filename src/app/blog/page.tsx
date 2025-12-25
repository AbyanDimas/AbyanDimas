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
                {/* Header removed to be handled by BlogList for better layout integration */}

                <BlogList initialPosts={posts} />
            </div>
        </div>
    );
}
