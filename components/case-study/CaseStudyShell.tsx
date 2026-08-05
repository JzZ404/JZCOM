"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import CaseStudySidebar, { type CaseStudyMode, type CaseStudyTocItem } from "./CaseStudySidebar";
import PlaceholderBlock from "./PlaceholderBlock";
import CaseStudyLinkIcons, { type CaseStudyLink } from "./CaseStudyLinkIcons";

// The chrome every case study shares — sidebar, overview header, hero image,
// Detailed/TL;DR toggle, next-case-study footer — regardless of how
// different their own detailed content ends up looking (Nest's bespoke
// sections vs. a plain skeleton). `children` is that detailed-mode content.
export type CaseStudyShellData = {
  title: string;
  subheading: string;
  tldr: string;
  heroLabel: string;
  heroVideo?: string; // optional cover video shown in place of the hero placeholder
  heroImage?: string; // optional static cover image — checked if heroVideo isn't set
  // CSS object-position — for covers whose focal point isn't centered, same
  // convention as Project.coverPosition on the Work grid cards. Needed now
  // that the hero is a fixed 16:9 crop instead of the raw image's own ratio.
  heroImagePosition?: string;
  meta: { label: string; value: string }[];
  links?: CaseStudyLink[]; // optional external links (GitHub, Kaggle, etc.), shown top-right of the title
  // Rendered as a button top-right of the title (next to `links`, if any)
  // and as a click-through overlay on the hero image — no separate "Live
  // Demo" pill elsewhere on the page.
  liveDemo?: { label: string; href: string };
};

export default function CaseStudyShell({
  caseStudy,
  tocItems,
  nextProject,
  children,
}: {
  caseStudy: CaseStudyShellData;
  tocItems: CaseStudyTocItem[];
  nextProject: Project;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<CaseStudyMode>("detailed");
  const detailed = mode === "detailed";
  // Falls back to a plain solid background if the next project doesn't
  // have a cover image yet (see ProjectCard for the same pattern).
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <div className="mx-auto flex max-w-[1280px]">
      <CaseStudySidebar mode={mode} onModeChange={setMode} tocItems={tocItems} />

      <div className="min-w-0 flex-1">
        {/* Sidebar (with "Back to work") is hidden below lg, so this stands
            in as the mobile/tablet way back to the work grid. */}
        <Link
          href="/#work"
          className="block px-5 pt-6 text-[15px] font-medium text-[var(--color-muted)] no-underline sm:px-6 lg:hidden"
        >
          ← Back to work
        </Link>
        {/* pt-9 matches the sidebar's py-9, so the title lines up with
            "Back to work" instead of sitting lower than it. */}
        <div id="overview" className="scroll-mt-28 px-5 pt-4 sm:px-6 lg:px-10 lg:pt-9">
          {/* flex-col below sm — a title plus the link icons/live-demo
              button side by side was overflowing the viewport on phone
              widths (e.g. "FocusFarm" + GitHub icon + "Try Live Demo"). */}
          <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <h1 className="font-serif text-[32px] leading-[1.1] font-bold text-[var(--color-fg)] sm:text-[40px] lg:text-[56px]">
              {caseStudy.title}
            </h1>
            <div className="flex shrink-0 items-center gap-3">
              {caseStudy.links && <CaseStudyLinkIcons links={caseStudy.links} />}
              {caseStudy.liveDemo && (
                <a
                  href={caseStudy.liveDemo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-[14px] font-semibold whitespace-nowrap text-white no-underline transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-[15px]"
                >
                  {caseStudy.liveDemo.label}
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>
          <p className="mb-8 w-full text-[18px] leading-relaxed font-semibold text-[var(--color-muted)] sm:text-[20px] lg:mb-14 lg:text-[24px]">
            {caseStudy.subheading}
          </p>
          {/* grid-cols-4 splits the row into 4 equal columns with a
              consistent gap, instead of a fixed gap that just pushes items
              apart by the same amount regardless of row width — and it
              bounds each item's width so a long value wraps instead of
              overflowing into the next column. Collapses to 2 columns below
              sm so long meta values have room to wrap without overflowing. */}
          <div className="grid grid-cols-2 gap-4 border-b border-[var(--color-border)] pb-7 sm:grid-cols-4 sm:gap-6">
            {caseStudy.meta.map((item) => (
              <div key={item.label} className="flex min-w-0 flex-col gap-1">
                <span className="text-[12px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  {item.label}
                </span>
                <span className="text-[16px] font-semibold text-balance text-[var(--color-fg)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {caseStudy.heroVideo ? (
          // overflow-hidden + a slight scale crops out the black stroke
          // baked into the source recording's edges.
          <div className="mx-5 my-7 w-[calc(100%-2.5rem)] overflow-hidden rounded-xl sm:mx-6 sm:w-[calc(100%-3rem)] lg:mx-10 lg:w-[calc(100%-5rem)]">
            <video
              src={caseStudy.heroVideo}
              className="w-full scale-[1.03]"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        ) : caseStudy.heroImage ? (
          caseStudy.liveDemo ? (
            <a
              href={caseStudy.liveDemo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mx-5 my-7 block w-[calc(100%-2.5rem)] overflow-hidden rounded-xl sm:mx-6 sm:w-[calc(100%-3rem)] lg:mx-10 lg:w-[calc(100%-5rem)]"
            >
              <img
                src={caseStudy.heroImage}
                alt={caseStudy.heroLabel}
                style={{ objectPosition: caseStudy.heroImagePosition }}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="rounded-full bg-white px-6 py-3 text-[16px] font-semibold text-[var(--color-fg)]">
                  {caseStudy.liveDemo.label}
                </span>
              </div>
            </a>
          ) : (
            <img
              src={caseStudy.heroImage}
              alt={caseStudy.heroLabel}
              style={{ objectPosition: caseStudy.heroImagePosition }}
              // Fixed 16:9 so every project's hero reads the same height —
              // without it, each project's own cover photo aspect ratio
              // drove the box height directly, so a squarer source photo
              // (Drunky, Pelican) rendered visibly taller than the rest.
              className="mx-5 my-7 aspect-[16/9] w-[calc(100%-2.5rem)] rounded-xl object-cover sm:mx-6 sm:w-[calc(100%-3rem)] lg:mx-10 lg:w-[calc(100%-5rem)]"
            />
          )
        ) : (
          <PlaceholderBlock
            label={caseStudy.heroLabel}
            height={360}
            className="mx-5 my-7 sm:mx-6 lg:mx-10"
          />
        )}

        {detailed ? (
          children
        ) : (
          <div className="mx-5 mb-10 rounded-xl bg-[var(--color-surface)] p-5 sm:mx-6 sm:p-7 lg:mx-10">
            <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
              TL;DR
            </div>
            <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
              {caseStudy.tldr}
            </p>
          </div>
        )}

        <Link
          href={`/work/${nextProject.slug}`}
          className="relative block overflow-hidden bg-[var(--color-fg)] px-5 py-10 text-center no-underline sm:px-6 lg:px-10 lg:py-14"
        >
          {!coverFailed && (
            <>
              <img
                src={nextProject.coverImage}
                alt=""
                onError={() => setCoverFailed(true)}
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </>
          )}
          <div className="relative mb-3 text-[0.9375rem] text-white opacity-70">
            Next case study
          </div>
          <div className="relative font-serif text-2xl font-bold text-white">
            {nextProject.title} →
          </div>
        </Link>
      </div>
    </div>
  );
}
