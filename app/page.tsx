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
        headlineLine1="Design Technologist"
        headlineLine2={[
          { text: "working across " },
          { text: "UX" },
          { text: ", " },
          { text: "AI" },
          { text: ", and " },
          { text: "Robotics" },
          { text: "." },
        ]}
      />
      <FeaturedProjects projects={featured} />
    </>
  );
}
