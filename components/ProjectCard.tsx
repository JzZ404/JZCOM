import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-lg border border-[var(--color-border)]"
    >
      <div className="aspect-[4/3] w-full bg-[var(--color-border)]" aria-hidden />
      <div className="p-4">
        <h3 className="font-medium group-hover:text-[var(--color-accent)]">
          {project.title}
        </h3>
        <p className="mt-1 text-[length:var(--text-caption)] text-[var(--color-muted)]">
          {project.tags.join(" · ")}
        </p>
      </div>
    </Link>
  );
}
