import ProjectCard from "@/components/ProjectCard";
import { ProjectData } from "@/lib/markdown";

// Helper to assign colors to languages
function getLanguageColor(language: string | null) {
    if (!language) return "#ccc";
    const colors: Record<string, string> = {
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        Python: "#3572A5",
        Java: "#b07219",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Vue: "#41b883",
        PHP: "#4F5D95",
        Shell: "#89e051",
        Go: "#00ADD8",
        Rust: "#dea584",
        C: "#555555",
        "C++": "#f34b7d",
        "C#": "#178600",
        Ruby: "#701516",
        Dart: "#00B4AB",
        Swift: "#F05138",
        Kotlin: "#A97BFF",
        Solidity: "#AA6746",
    };
    return colors[language] || "#8b949e";
}

async function getGithubProjects(): Promise<ProjectData[]> {
    try {
        // Fetch repositories for abyandimas, sort by updated
        const res = await fetch("https://api.github.com/users/abyandimas/repos?sort=updated&per_page=100", {
            next: { revalidate: 3600 }, // Cache for 1 hour
            headers: {
                Accept: "application/vnd.github.v3+json",
                // Add Authorization header locally if you hit rate limits, but usually fine for public repos
            },
        });

        if (!res.ok) {
            console.error("Failed to fetch github projects");
            return [];
        }

        const repos = await res.json();

        return repos.map((repo: any) => ({
            slug: repo.name,
            title: repo.name,
            description: repo.description || "No description provided.",
            language: repo.language || "Unknown",
            languageColor: getLanguageColor(repo.language),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            githubUrl: repo.html_url,
            contentHtml: "", // Not used in card, but required by type
            tags: repo.topics || [], // Topics if available
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getGithubProjects();

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Projects</h1>
                <p className="text-gray-500">Showcase of my latest work and contributions sourced directly from GitHub.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {projects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                    {projects.length === 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm h-64 flex items-center justify-center text-gray-400">
                            No projects found or rate limit exceeded.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
