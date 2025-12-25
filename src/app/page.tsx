import Image from "next/image";
import ProfileBanner from "@/components/ProfileBanner";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { getProfileData, getBlogPosts, getProjects } from "@/lib/markdown";

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
  const projects = await getProjects();

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

