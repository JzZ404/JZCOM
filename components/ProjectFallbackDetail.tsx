"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";

// Plain summary layout for any project without a full case-study build-out
// yet. Falls back to the placeholder gallery grid if `coverImage` hasn't
// been supplied (same onError pattern as ProjectCard).
export default function ProjectFallbackDetail({ project }: { project: Project }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const galleryPlaceholderCount = 3;

  return (
    <article className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-[length:var(--text-caption)] text-[var(--color-muted)]">
        {project.tags.join(" · ")}
      </p>
      <h1 className="mt-2 text-[length:var(--text-h1)] font-semibold tracking-tight">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-[length:var(--text-body)] text-[var(--color-fg)]">
        {project.summary}
      </p>
      <p className="mt-2 max-w-2xl text-[length:var(--text-caption)] text-[var(--color-muted)]">
        Role: {project.role}
      </p>

      {project.links && project.links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      {!coverFailed ? (
        <img
          src={project.coverImage}
          alt={project.title}
          onError={() => setCoverFailed(true)}
          className="mt-10 w-full rounded-xl border border-[var(--color-border)] object-cover"
        />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: galleryPlaceholderCount }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] w-full rounded-lg bg-[var(--color-border)]"
              aria-hidden
            />
          ))}
        </div>
      )}
    </article>
  );
}
