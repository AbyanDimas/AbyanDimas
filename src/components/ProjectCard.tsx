import { Star, GitFork, Book } from "lucide-react";
import { ProjectData } from "@/lib/markdown";

interface ProjectCardProps {
    project: ProjectData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
        >
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 h-full flex flex-col hover:border-blue-500 transition-colors">
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold group-hover:underline">
                    <Book className="w-4 h-4" />
                    <span className="truncate">{project.title}</span>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-4 flex-1 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-auto">
                    <div className="flex items-center gap-1">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: project.languageColor }}
                        ></span>
                        <span>{project.language}</span>
                    </div>

                    <div className="flex items-center gap-1 hover:text-blue-600">
                        <Star className="w-3.5 h-3.5" />
                        <span>{project.stars}</span>
                    </div>

                    <div className="flex items-center gap-1 hover:text-blue-600">
                        <GitFork className="w-3.5 h-3.5" />
                        <span>{project.forks}</span>
                    </div>
                </div>
            </div>
        </a>
    );
}
