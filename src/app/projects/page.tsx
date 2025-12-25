import { getProjects } from "@/lib/markdown";
import ProjectCard from "@/components/ProjectCard";

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Projects</h1>
                <p className="text-gray-500">Showcase of my latest work and contributions.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                    {projects.length === 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center text-gray-400">
                            No projects found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
