import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

export interface ProfileData {
    name: string;
    role: string;
    location: string;
    avatar: string;
    cv_link: string;
    stats: {
        work: { label: string; company: string; detail: string };
        education: { label: string; institution: string; detail: string };
    };
    socials: { platform: string; icon: string; url: string }[];
    skills: string[];
    portfolio_links: { platform: string; url: string; icon?: string; color: string; label?: string; lucideIcon?: string }[];
    verifications: { label: string; icon: string; verified: boolean; action?: string }[];
    proficiency: { label: string; value: string }[];
    experience: { role: string; company: string; period: string; icon: string; github_link?: string }[];
    portfolio_images: string[];
    services: { title: string; icon: string; description: string; price: string }[];
    articles: { title: string; excerpt: string; date: string; url: string }[];
    contentHtml: string;
}

export async function getProfileData(): Promise<ProfileData> {
    const fullPath = path.join(contentDirectory, "profile.md");
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
        ...data,
        contentHtml,
    } as ProfileData;
}

const projectsDirectory = path.join(process.cwd(), "content/projects");
const blogDirectory = path.join(process.cwd(), "content/blog");

export interface ProjectData {
    slug: string;
    title: string;
    description: string;
    // GitHub specific fields
    language: string;
    languageColor: string;
    stars: number;
    forks: number;
    githubUrl: string;
    // Optional legacy fields if you want to keep them just in case, or remove if unused. 
    // Plan says "Update", so let's stick to the new requirement mainly, but keeping 'image' might not be needed for pure github style? 
    // The plan didn't explicitly say DELETE 'image' but the github card usually doesn't show a big image. 
    // However, the `ProjectsPage` currently uses `image`. 
    // Let's keep `image` as optional or just leave it if it's not hurting, but for the "GitHub style" we might not use it.
    // Wait, the plan says "Update ProjectData interface to include...". It doesn't strictly say remove others.
    // But for a pure GitHub card, we don't need `image` usually.
    // I'll keep existing fields to avoid breaking if referenced elsewhere initially, but the prompt implies a switch.
    // Let's add the new ones.
    image?: string;
    tags?: string[];
    link?: string;

    contentHtml: string;
}

export interface BlogPostData {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    coverImage?: string;
    contentHtml: string;
}

export async function getProjects(): Promise<ProjectData[]> {
    if (!fs.existsSync(projectsDirectory)) return [];
    const fileNames = fs.readdirSync(projectsDirectory);
    const allProjectsData = await Promise.all(fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(projectsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();

        return {
            slug,
            contentHtml,
            ...(data as any),
        } as ProjectData;
    }));
    return allProjectsData;
}

export async function getBlogPosts(): Promise<BlogPostData[]> {
    if (!fs.existsSync(blogDirectory)) return [];
    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();

        return {
            slug,
            contentHtml,
            ...(data as any),
        } as BlogPostData;
    }));
    return allPostsData;
}
export async function getPostData(slug: string): Promise<BlogPostData> {
    const fullPath = path.join(blogDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        ...(data as any),
    } as BlogPostData;
}
