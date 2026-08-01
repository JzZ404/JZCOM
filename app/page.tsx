import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";

export default function Home() {
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
      <WorkSection />
    </>
  );
}
