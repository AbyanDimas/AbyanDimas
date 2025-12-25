'use client'
import { useState } from "react";
import { MapPin, Download, X, Linkedin, Mail, Phone, Globe } from "lucide-react";
import { ProfileData } from "@/lib/markdown";

interface ProfileBannerProps {
    data: ProfileData;
}

export default function ProfileBanner({ data }: ProfileBannerProps) {
    const [activePreview, setActivePreview] = useState<'work' | 'education' | null>(null);

    return (
        <>
            <div className="bg-[var(--card-bg)] rounded-3xl shadow-sm overflow-hidden mb-6">
                {/* Banner Background */}
                <div className="h-48 w-full relative">
                    <img
                        src="/banner.png"
                        alt="Profile Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div> {/* Optional overlay for text readability */}
                </div>

                {/* Profile Info Section */}
                <div className="px-8 pb-8">
                    <div className="flex flex-col lg:flex-row items-start justify-between">

                        {/* Avatar and Basic Info */}
                        <div className="flex flex-col lg:flex-row items-start gap-6 -mt-12 mb-6 lg:mb-0 w-full lg:w-auto">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-[var(--card-bg)] overflow-hidden bg-yellow-100 shadow-md">
                                    <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="mt-14 lg:mt-16 space-y-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{data.name}</h1>
                                    <p className="text-[var(--text-secondary)] font-medium">{data.role}</p>
                                </div>

                                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm bg-[var(--input-border)] px-3 py-1.5 rounded-lg w-fit">
                                    <MapPin className="w-4 h-4" />
                                    <span>{data.location}</span>
                                </div>

                                {/* Social Integrations */}
                                <div className="flex items-center gap-3 mt-4 pt-2">
                                    {data.socials.map((social) => {
                                        const iconMap: Record<string, any> = {
                                            Linkedin: Linkedin,
                                            Mail: Mail,
                                            Phone: Phone,
                                            // Add others if needed or import a shared map
                                        };
                                        const Icon = iconMap[social.icon] || Globe;

                                        return (
                                            <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full shadow-sm hover:shadow-md transition-shadow text-[var(--text-primary)]">
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Stats & Action */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6 lg:mt-8 w-full lg:w-auto">
                            {/* Work Stat */}
                            <button
                                onClick={() => setActivePreview('work')}
                                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 shadow-sm flex-1 sm:min-w-[160px] text-left hover:border-red-500 transition-colors group"
                            >
                                <h3 className="text-red-500 font-semibold text-sm mb-1 group-hover:underline">Work</h3>
                                <p className="text-[var(--text-primary)] font-bold text-sm truncate">{data.stats.work.company}</p>
                                <p className="text-[var(--text-secondary)] text-xs truncate">{data.stats.work.detail}</p>
                            </button>

                            {/* Education Stat */}
                            <button
                                onClick={() => setActivePreview('education')}
                                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 shadow-sm flex-1 sm:min-w-[160px] text-left hover:border-blue-500 transition-colors group"
                            >
                                <h3 className="text-blue-500 font-semibold text-sm mb-1 group-hover:underline">Education</h3>
                                <p className="text-[var(--text-primary)] font-bold text-sm truncate">{data.stats.education.institution}</p>
                                <p className="text-[var(--text-secondary)] text-xs truncate">{data.stats.education.detail}</p>
                            </button>

                            <a href={data.cv_link} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-4 sm:py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Download CV
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {
                activePreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActivePreview(null)}>
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-bold ${activePreview === 'work' ? 'text-red-500' : 'text-blue-500'}`}>
                                    {activePreview === 'work' ? 'Work Experience' : 'Education'}
                                </h3>
                                <button
                                    onClick={() => setActivePreview(null)}
                                    className="p-2 hover:bg-[var(--card-hover)] rounded-full transition-colors text-[var(--text-secondary)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                        {activePreview === 'work' ? 'Company' : 'Institution'}
                                    </h4>
                                    <p className="text-lg font-bold text-[var(--text-primary)]">
                                        {activePreview === 'work' ? data.stats.work.company : data.stats.education.institution}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                                        {activePreview === 'work' ? 'Role / Detail' : 'Location / Degree'}
                                    </h4>
                                    <p className="text-[var(--text-primary)]">
                                        {activePreview === 'work' ? data.stats.work.detail : data.stats.education.detail}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-[var(--card-border)]">
                                    <p className="text-sm text-[var(--text-secondary)] italic">
                                        {activePreview === 'work'
                                            ? "Detailed work history is available in the full CV."
                                            : "Full academic transcript available upon request."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
