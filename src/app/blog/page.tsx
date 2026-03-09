import { getBlogPosts } from "@/lib/markdown";
import BlogList from "@/components/BlogList";

export const metadata = {
    title: "Blog | Profile Dashboard",
    description: "Thoughts, tutorials, and insights.",
};

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <BlogList initialPosts={posts} />
            </div>
        </div>
    );
}
