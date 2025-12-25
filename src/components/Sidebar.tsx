'use client';

import { useState, useEffect } from "react";
import { Check, Shield, Smartphone, Mail, Facebook, Linkedin, Twitter, MapPin, Music, Play, SkipForward, Github, Cloud, Server, Settings, Briefcase, Users, Cpu, Code, Globe, Instagram } from "lucide-react";
import { ProfileData } from "@/lib/markdown";

interface SidebarProps {
    data: ProfileData;
}

const iconMap: Record<string, any> = {
    Facebook,
    Linkedin,
    Twitter,
    Smartphone,
    Mail,
    Shield,
    Github,
    Cloud,
    Server,
    Settings,
    Briefcase,
    Users,
    Cpu,
    Code,
    Globe,
    Instagram,
    Phone: Smartphone
};

export default function Sidebar({ data }: SidebarProps) {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-full lg:w-80 space-y-6 shrink-0">


            {/* Time & Location Widget */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Local Time</p>
                    <h2 className="text-4xl font-extrabold mb-4 tabular-nums">{time}</h2>
                    <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs font-semibold">{data.location}</span>
                    </div>
                </div>
            </div>

            {/* Connect Widget */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-4">Connect</h3>
                <div className="space-y-3">
                    {data.socials.map((social) => {
                        const Icon = iconMap[social.icon] || Globe;
                        return (
                            <a
                                key={social.platform}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--card-hover)] transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-[var(--text-primary)] text-sm">{social.platform}</p>
                                    <p className="text-[var(--text-secondary)] text-xs">Connect</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>



            {/* Existing Skills Widget */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-default">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Existing Verifications Widget */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-4">Verifications</h3>
                <ul className="space-y-4">
                    {data.verifications.map((item) => {
                        const Icon = iconMap[item.icon] || Shield;
                        return (
                            <li key={item.label} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-[var(--card-hover)] flex items-center justify-center">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
                                </div>
                                {item.verified ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    item.action && (
                                        <button className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                            {item.action}
                                        </button>
                                    )
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Existing Proficiency Widget */}
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--card-border)]">
                <h3 className="font-bold text-[var(--text-primary)] mb-4">Proficiency</h3>
                <div className="flex flex-wrap gap-2">
                    {data.proficiency.map((item, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-[var(--card-hover)] border border-[var(--card-border)] text-[var(--text-secondary)] text-xs font-semibold rounded-lg flex items-center gap-1">
                            {item.label} <span className="text-blue-500">{item.value}</span>
                        </span>
                    ))}
                </div>
            </div>

        </aside>
    );
}
