import Link from "next/link";
import type { Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  // 2x2 grid — only ever shows the first 4 featured projects.
  const featured = projects.slice(0, 4);

  return (
    <section className="mx-auto max-w-5xl px-6 pt-40 pb-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[length:var(--text-h2)] font-semibold tracking-tight">
          Featured work
        </h2>
        <Link href="/work" className="text-sm hover:text-[var(--color-accent)]">
          View all work →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
