'use client';

import { useState } from "react";
import { Github } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ProfileData, BlogPostData, ProjectData } from "@/lib/markdown";
import ProjectCard from "./ProjectCard";

interface MainContentProps {
  data: ProfileData;
  blogPosts: BlogPostData[];
  projects: ProjectData[];
}

type Tab = "overview" | "projects" | "articles" | "apps";

const materialIconMap: Record<string, string> = {
  Briefcase: "work",
  Code: "code",
  Users: "group",
  Cpu: "memory"
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
      <div className="bg-[var(--card-bg)] rounded-3xl px-8 py-4 shadow-sm flex items-center gap-8 border-b border-[var(--card-border)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                className="text-[var(--text-secondary)] text-sm leading-relaxed space-y-4 prose prose-sm max-w-none dark:prose-invert mb-6"
                dangerouslySetInnerHTML={{ __html: data.contentHtml }}
              />
              <div className="flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-orange-800/50 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  Fast Learner
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-indigo-800/50 text-blue-700 dark:text-blue-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  Terminal Lover
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-rose-800/50 text-pink-700 dark:text-pink-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  Clean Code
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-teal-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-[16px]">coffee</span>
                  Coffee Fueled
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 border border-purple-200 dark:border-fuchsia-800/50 text-purple-700 dark:text-purple-400 text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default">
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  Always Shipping
                </div>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {data.experience.map((job, idx) => {
                  const mIcon = materialIconMap[job.icon] || "work";
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--card-hover)] transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px]">{mIcon}</span>
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
                  icon: "chat",
                  gradient: 'from-blue-500 to-cyan-500',
                  bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500'
                },
                {
                  name: 'Canvas',
                  description: 'Drawing Board',
                  href: '/canvas',
                  icon: "edit",
                  gradient: 'from-purple-500 to-pink-500',
                  bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500'
                },
                {
                  name: 'QR Code',
                  description: 'Generator & Scanner',
                  href: '/qr-code',
                  icon: "qr_code",
                  gradient: 'from-green-500 to-emerald-500',
                  bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500'
                },
                {
                  name: 'URL Short',
                  description: 'Link Shortener',
                  href: '/url-shortener',
                  icon: "link",
                  gradient: 'from-orange-500 to-red-500',
                  bgColor: 'bg-gradient-to-br from-orange-500 to-red-500'
                },
                {
                  name: 'OCR Reader',
                  description: 'Text from Images',
                  href: '/ocr-reader',
                  icon: "code",
                  gradient: 'from-indigo-500 to-pink-500',
                  bgColor: 'bg-gradient-to-br from-indigo-500 to-pink-500'
                },
                {
                  name: 'Compressor',
                  description: 'Reduce Image Size',
                  href: '/image-compressor',
                  icon: "image",
                  gradient: 'from-teal-500 to-cyan-500',
                  bgColor: 'bg-gradient-to-br from-teal-500 to-cyan-500'
                },
                {
                  name: 'MD Editor',
                  description: 'Markdown Editor',
                  href: '/markdown-editor',
                  icon: "description",
                  gradient: 'from-amber-500 to-orange-500',
                  bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500'
                },
                {
                  name: 'Pomodoro',
                  description: 'Focus Timer',
                  href: '/pomodoro-timer',
                  icon: "timer",
                  gradient: 'from-rose-500 to-red-500',
                  bgColor: 'bg-gradient-to-br from-rose-500 to-red-500'
                },
                {
                  name: 'Scraper',
                  description: 'Web Scraping',
                  href: '/scraping',
                  icon: "search",
                  gradient: 'from-purple-500 to-blue-500',
                  bgColor: 'bg-gradient-to-br from-purple-500 to-blue-500'
                },
              ].map((app) => {
                const Icon = app.icon;
                return (
                  <a
                    key={app.name}
                    href={app.href}
                    className="relative group flex flex-col items-center gap-3 p-5 rounded-3xl bg-transparent hover:bg-gradient-to-b hover:from-[var(--card-hover)] hover:to-transparent border border-transparent hover:border-[var(--card-border)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Background glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl rounded-full" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} ></div>

                    <div className={`relative z-10 w-16 h-16 rounded-2xl ${app.bgColor} shadow-lg flex items-center justify-center group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:scale-110 transition-all duration-500 overflow-hidden`}>
                      {/* Inner card shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:animate-shimmer delay-100"></div>
                      <span className="material-symbols-outlined text-[32px] text-white" style={{ fontVariationSettings: "'wght' 500" }}>{app.icon}</span>
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
