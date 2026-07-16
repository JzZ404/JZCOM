import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Joyce Zhou` : "Work — Joyce Zhou" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  // PLACEHOLDER — real gallery images come from project.coverImage + additional
  // per-project image sets once Joyce supplies them. Three blocks stand in for now.
  const galleryPlaceholderCount = 3;

  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-[length:var(--text-caption)] text-[var(--color-muted)]">
        {project.tags.join(" · ")}
      </p>
      <h1 className="mt-2 text-[length:var(--text-h1)] font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--color-fg)]">{project.summary}</p>
      <p className="mt-2 max-w-2xl text-[length:var(--text-caption)] text-[var(--color-muted)]">
        Role: {project.role}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: galleryPlaceholderCount }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] w-full rounded-lg bg-[var(--color-border)]"
            aria-hidden
          />
        ))}
      </div>
    </article>
  );
}
