import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work — Joyce Zhou",
};

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Work</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
        {/* PLACEHOLDER — tag filtering (Robotics, AI/ML, UX/Product, Interactive/Creative, PM) goes here */}
        Selected case studies. Click a project for the full write-up.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
