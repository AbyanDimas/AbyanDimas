import Image from "next/image";
import ProfileBanner from "@/components/ProfileBanner";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { getProfileData, getBlogPosts, ProjectData } from "@/lib/markdown";

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

export async function generateMetadata() {
  const data = await getProfileData();
  return {
    title: `${data.name} - ${data.role} `,
    description: `Portfolio of ${data.name}, a ${data.role} based in ${data.location}.`,
    openGraph: {
      images: [data.avatar],
    },
  };
}

export default async function Home() {
  const data = await getProfileData();
  const blogPosts = await getBlogPosts();
  const projects = await getGithubProjects();

  return (
    <main className="min-h-screen pt-4 pb-20 px-6 max-w-7xl mx-auto space-y-6">
      <ProfileBanner data={data} />

      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar data={data} />
        <MainContent data={data} blogPosts={blogPosts} projects={projects} />
      </div>
    </main>
  );
}

