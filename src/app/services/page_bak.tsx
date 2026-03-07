import { getProfileData } from '@/lib/markdown';
import { Layout, Code, MessageSquare, PenTool } from 'lucide-react';

// Icon map to dynamically render icons based on string name from markdown
const iconMap: Record<string, any> = {
    Layout,
    Code,
    MessageSquare,
    PenTool
};

export default async function ServicesPage() {
    const data = await getProfileData();

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Services</h1>
                    <p className="text-[var(--text-secondary)] text-lg">Professional services tailored to your needs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.services?.map((service, idx) => {
                        const Icon = iconMap[service.icon] || Layout;
                        return (
                            <div key={idx} className="bg-[var(--card-bg)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{service.title}</h3>
                                <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between">
                                    <span className="text-sm font-semibold text-[var(--text-primary)]">{service.price}</span>
                                    <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
