import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <HeroSection
        name="Joyce Zhou"
        leadWord="A"
        headlineLine1="Design technologist"
        headlineLine2="working across UX, AI, and robotics."
      />
      <FeaturedProjects projects={featured} />
    </>
  );
}
