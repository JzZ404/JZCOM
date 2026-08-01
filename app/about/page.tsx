import type { Metadata } from "next";
import { about } from "@/data/about";
import AboutPageContent from "@/components/AboutPageContent";

export const metadata: Metadata = {
  title: "About — Joyce Zhou",
};

export default function AboutPage() {
  return <AboutPageContent about={about} />;
}
