import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import { projects } from "@/data/projects";

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <HeroSection
        name="Joyce Zhou"
        // Drawn from PORTFOLIO_HANDOFF.md positioning statement — adjust wording, not the substance
        positioning="A design technologist working across the full stack of an idea — from interface to physical system."
        bio="Currently finishing an MS in Technology Innovation (Robotics concentration) at UW GIX. Background in Interdisciplinary Computing & Arts, Communication, and Cognitive Science from UC San Diego."
      />
      <FeaturedProjects projects={featured} />
    </>
  );
}
