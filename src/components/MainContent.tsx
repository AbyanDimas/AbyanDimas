'use client';

import { useState } from "react";
import { Github, Briefcase, Code, Users, Cpu, MoreHorizontal, MessageCircle, Pen, QrCode, Link2, Image as ImageIcon, FileText, Timer, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ProfileData, BlogPostData, ProjectData } from "@/lib/markdown";
import ProjectCard from "./ProjectCard";

interface MainContentProps {
    data: ProfileData;
    blogPosts: BlogPostData[];
    projects: ProjectData[];
}

type Tab = "overview" | "projects" | "articles" | "apps";

const iconMap: Record<string, any> = {
    Briefcase,
    Code,
    Users,
    Cpu,
    Github
};

export default function MainContent({ data, blogPosts, projects }: MainContentProps) {
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    // Transform proficiency data for Radar Chart
    const radarData = data.proficiency.map(item => ({
        subject: item.label,
        A: parseInt(item.value.replace('%', '')),
        fullMark: 100
    }));

    return (
        <div className="flex-1 space-y-6">

            {/* Tabs */}
            <div className="bg-[var(--card-bg)] rounded-3xl px-8 py-4 shadow-sm flex items-center gap-8 border-b border-[var(--card-border)] overflow-x-auto">
                {[
                    { id: "overview", label: "Overview" },
                    { id: "projects", label: "Projects" },
                    { id: "articles", label: "Articles" },
                    { id: "apps", label: "Apps" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`font-bold text-sm border-b-2 pb-4 -mb-4.5 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? "text-blue-600 border-blue-600"
                            : "text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-[var(--card-bg)] rounded-3xl p-8 shadow-sm space-y-8">

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* About Me */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">About Me</h2>
                            <div
                                className="text-[var(--text-secondary)] text-sm leading-relaxed space-y-4 prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                            />
                        </section>

                        {/* Experience */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Experience</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {data.experience.map((job, idx) => {
                                    const Icon = iconMap[job.icon] || Briefcase;
                                    return (
                                        <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--card-hover)] transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[var(--text-primary)] text-sm">{job.role}</h3>
                                                <p className="text-[var(--text-secondary)] text-xs mt-0.5">{job.company}</p>
                                                <p className="text-[var(--text-muted)] text-xs mt-1">{job.period}</p>
                                                {job.github_link && (
                                                    <a href={job.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2">
                                                        <Github className="w-3 h-3" />
                                                        <span>View Project</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </section>



                        {/* Skills Chart */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Skills Proficiency</h2>
                            <div className="h-80 w-full bg-[var(--card-hover)] rounded-3xl p-6 relative overflow-hidden">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={radarData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--card-border)" />
                                        <XAxis type="number" domain={[0, 100]} hide />
                                        <YAxis
                                            dataKey="subject"
                                            type="category"
                                            width={100}
                                            tick={{ fill: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'var(--card-border)', opacity: 0.4 }}
                                            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)', borderRadius: '12px' }}
                                            itemStyle={{ color: 'var(--text-primary)' }}
                                        />
                                        <Bar
                                            dataKey="A"
                                            name="Proficiency"
                                            fill="#3b82f6"
                                            radius={[0, 4, 4, 0]}
                                            barSize={32}
                                            background={{ fill: 'var(--card-border)' }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                        {/* Achievements */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Achievements</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-[var(--card-hover)] rounded-2xl">
                                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                                        🏆
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-sm">Best Mobile App Award</h3>
                                        <p className="text-[var(--text-secondary)] text-xs">TechCrunch 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[var(--card-hover)] rounded-2xl">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        🚀
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-sm">100k+ App Downloads</h3>
                                        <p className="text-[var(--text-secondary)] text-xs">Google Play Store</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Tech Stack */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Tech Stack</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'PostgreSQL', 'AWS', 'Figma'].map((tech) => (
                                    <div key={tech} className="bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-primary)] rounded-xl p-3 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:text-blue-600 transition-colors">
                                        <span className="text-xs font-semibold">{tech}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Upcoming Goals */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Upcoming Goals</h2>
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">1</span>
                                        Master Rust Programming
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">2</span>
                                        Launch SaaS Product
                                    </li>
                                    <li className="flex items-center gap-3 text-sm font-medium">
                                        <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">3</span>
                                        Contribute to Open Source
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Testimonials */}
                        <section>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Testimonials</h2>
                            <div className="bg-[var(--card-hover)] rounded-3xl p-6 relative">
                                <span className="text-4xl text-[var(--text-muted)] absolute top-4 left-6">"</span>
                                <p className="text-[var(--text-secondary)] text-sm italic relative z-10 pt-4 px-2 mb-4">
                                    One of the most talented developers I've had the pleasure of working with. Delivered the project ahead of schedule and the code quality was top-notch.
                                </p>
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-8 h-8 bg-[var(--card-border)] rounded-full"></div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--text-primary)]">Sarah Johnson</p>
                                        <p className="text-[10px] text-[var(--text-secondary)]">CTO, TechStart</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                    <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {projects && projects.length > 0 ? (
                                projects.map((project) => (
                                    <ProjectCard key={project.slug} project={project} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No projects found.</p>
                            )}
                        </div>
                    </section>
                )}

                {/* Articles Tab */}
                {activeTab === "articles" && (
                    <section className="space-y-6">
                        {blogPosts && blogPosts.length > 0 ? (
                            blogPosts.map((post, idx) => (
                                <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-blue-600">{post.date}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-500">{post.author}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                                        <a href={`/blog/${post.slug}`} className="hover:underline">{post.title}</a>
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm mb-3">{post.excerpt}</p>
                                    <a href={`/blog/${post.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                                        Read Article &rarr;
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No articles found.</p>
                        )}
                    </section>
                )}

                {/* Apps Tab */}
                {activeTab === "apps" && (
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">My Applications</h2>
                            <p className="text-sm text-[var(--text-secondary)]">Interactive tools and applications I've built</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {[
                                {
                                    name: 'Ask Me',
                                    description: 'AI Chat Assistant',
                                    href: '/ask-me',
                                    icon: MessageCircle,
                                    gradient: 'from-blue-500 to-cyan-500',
                                    bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                },
                                {
                                    name: 'Canvas',
                                    description: 'Drawing Board',
                                    href: '/canvas',
                                    icon: Pen,
                                    gradient: 'from-purple-500 to-pink-500',
                                    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500'
                                },
                                {
                                    name: 'QR Code',
                                    description: 'Generator & Scanner',
                                    href: '/qr-code',
                                    icon: QrCode,
                                    gradient: 'from-green-500 to-emerald-500',
                                    bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500'
                                },
                                {
                                    name: 'URL Short',
                                    description: 'Link Shortener',
                                    href: '/url-shortener',
                                    icon: Link2,
                                    gradient: 'from-orange-500 to-red-500',
                                    bgColor: 'bg-gradient-to-br from-orange-500 to-red-500'
                                },
                                {
                                    name: 'OCR Reader',
                                    description: 'Text from Images',
                                    href: '/ocr-reader',
                                    icon: Code,
                                    gradient: 'from-indigo-500 to-pink-500',
                                    bgColor: 'bg-gradient-to-br from-indigo-500 to-pink-500'
                                },
                                {
                                    name: 'Compressor',
                                    description: 'Reduce Image Size',
                                    href: '/image-compressor',
                                    icon: ImageIcon,
                                    gradient: 'from-teal-500 to-cyan-500',
                                    bgColor: 'bg-gradient-to-br from-teal-500 to-cyan-500'
                                },
                                {
                                    name: 'MD Editor',
                                    description: 'Markdown Editor',
                                    href: '/markdown-editor',
                                    icon: FileText,
                                    gradient: 'from-amber-500 to-orange-500',
                                    bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500'
                                },
                                {
                                    name: 'Pomodoro',
                                    description: 'Focus Timer',
                                    href: '/pomodoro-timer',
                                    icon: Timer,
                                    gradient: 'from-rose-500 to-red-500',
                                    bgColor: 'bg-gradient-to-br from-rose-500 to-red-500'
                                },
                                {
                                    name: 'Scraper',
                                    description: 'Web Scraping',
                                    href: '/scraping',
                                    icon: Search,
                                    gradient: 'from-purple-500 to-blue-500',
                                    bgColor: 'bg-gradient-to-br from-purple-500 to-blue-500'
                                },
                            ].map((app) => {
                                const Icon = app.icon;
                                return (
                                    <a
                                        key={app.name}
                                        href={app.href}
                                        className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-[var(--card-hover)] transition-all duration-300 hover:scale-105"
                                    >
                                        <div className={`w-16 h-16 rounded-[1.25rem] ${app.bgColor} shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300`}>
                                            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors">
                                                {app.name}
                                            </h3>
                                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                                {app.description}
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}
