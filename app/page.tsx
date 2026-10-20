import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";

export default function Home() {
  return (
    <>
      <HeroSection
        name="Joyce Zhou"
        namePill="Yes, It's Me, Welcome!"
        leadWord="A"
        headlineLine1="Design Technologist"
        headlineLine1Pill="Design → Prototype → Code"
        headlineLine2={[
          { text: "working across " },
          { text: "UX", cursorPill: "From User Insight To Interface" },
          { text: ", " },
          { text: "AI", cursorPill: "Designing With + For AI" },
          { text: ", and " },
          { text: "Robotics", cursorPill: "Human-Robot Interaction" },
          { text: "." },
        ]}
      />
      <WorkSection />
    </>
  );
}
