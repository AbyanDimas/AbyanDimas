import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/markdown';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://abyan-portfolio.vercel.app'; // Replace with actual domain if known, or use a variable
    const posts = await getBlogPosts();

    const blogUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
    }));

    const staticRoutes = [
        '',
        '/projects',
        '/services',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
    }));

    return [...staticRoutes, ...blogUrls];
}
