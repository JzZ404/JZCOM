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
        headlineLine2={[
          { text: "working across " },
          { text: "UX", bold: true },
          { text: ", " },
          { text: "AI", bold: true },
          { text: ", and " },
          { text: "Robotics", bold: true },
          { text: "." },
        ]}
      />
      <FeaturedProjects projects={featured} />
    </>
  );
}
