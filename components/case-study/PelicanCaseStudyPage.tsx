"use client";

import { Fragment } from "react";
import type { Project } from "@/data/projects";
import type { CaseStudyPelican } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import Reveal from "./Reveal";
import PhotoFan from "./PhotoFan";

const PELICAN_TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "Why We Built This" },
  { id: "architecture", label: "System Architecture" },
  { id: "process", label: "Design Process" },
  { id: "pipeline", label: "The Pipeline" },
  { id: "challenges", label: "Challenges" },
  { id: "whats-next", label: "What's Next" },
];

export default function PelicanCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudyPelican;
  nextProject: Project;
}) {
  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={PELICAN_TOC_ITEMS} nextProject={nextProject}>
      <CaseStudySection id="why" number="01 — Why We Built This" title="Why We Built This">
        {/* items-center — the fan's aspect-ratio-locked height doesn't
            play well with the grid's default stretch, so without this the
            text column sat at its own shorter natural height instead of
            matching the taller image's box, reading as misaligned. */}
        <div className="mb-11 grid grid-cols-1 items-center gap-8 sm:grid-cols-2 sm:gap-12">
          <PhotoFan images={caseStudy.whyWeBuiltThis.images} />
          <div className="flex flex-col justify-center gap-4">
            {/* Sizes match Drunky's Why We Built This (17px body / 18px
                emphasis) so the two case studies read consistently. */}
            {caseStudy.whyWeBuiltThis.story.map((paragraph, i) => {
              const isEmphasis = typeof paragraph === "object";
              return (
                <p
                  key={i}
                  className={
                    isEmphasis
                      ? "text-[18px] leading-relaxed font-bold text-[var(--color-primary)]"
                      : "text-[17px] leading-relaxed text-[var(--color-muted)]"
                  }
                >
                  {isEmphasis ? paragraph.text : paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="architecture" number="02 — System Architecture" title="System Architecture">
        {/* Same 3-stage arrow flow as Drunky's, one fewer stage since
            Pelican's hardware gets its own flat list below instead of
            being stage 4 — the Pi/desktop split earns the dedicated card
            here instead. */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          {caseStudy.systemArchitecture.stages.map((stage, i) => (
            <Fragment key={stage.title}>
              <Reveal delay={i * 0.08} className="rounded-xl bg-[var(--color-card)] p-5">
                <div className="mb-1 font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  {stage.title}
                </div>
                <h3 className="mb-2 font-serif text-[16px] font-bold text-[var(--color-fg)] italic">
                  {stage.body}
                </h3>
                <ul className="flex flex-col gap-1">
                  {stage.items.map((item) => (
                    <li key={item} className="text-[13px] leading-snug text-[var(--color-muted)]">
                      • {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              {i < caseStudy.systemArchitecture.stages.length - 1 && (
                <div
                  aria-hidden
                  className="hidden items-center justify-center text-[20px] text-[var(--color-border)] sm:flex"
                >
                  →
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="mb-3 rounded-xl bg-[var(--color-surface)] p-6.5">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            Hardware Stack
          </div>
          <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
            {caseStudy.systemArchitecture.hardware.join(" · ")}
          </p>
        </div>
        <p className="mb-11 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
          {caseStudy.systemArchitecture.note}
        </p>
      </CaseStudySection>

      <CaseStudySection id="process" number="03 — Design Process" title="Design Process">
        <img
          src={caseStudy.designProcess.image}
          alt="PELICAN design process — sketch, CAD model, cardboard mockup, 3D-printed shell, final assembly, and live testing"
          width={1328}
          height={570}
          className="aspect-[1328/570] mb-4 w-full rounded-xl object-cover"
        />
        <p className="mb-11 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
          {caseStudy.designProcess.caption}
        </p>
      </CaseStudySection>

      <CaseStudySection id="pipeline" number="04 — The Pipeline" title="The Pipeline">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {caseStudy.pipeline.states.map((state, i) => (
            <Reveal
              key={state.title}
              delay={i * 0.06}
              className="flex flex-col items-center rounded-xl bg-[var(--color-card)] p-5 text-center"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] font-serif text-[15px] font-bold text-[var(--color-on-primary)]">
                {i + 1}
              </div>
              <h3 className="mb-1 font-serif text-[16px] font-bold text-[var(--color-fg)]">
                {state.title}
              </h3>
              <p className="text-[13px] leading-snug text-[var(--color-muted)]">{state.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mb-8 rounded-xl bg-[var(--color-surface)] p-6.5">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            {caseStudy.pipeline.interrupt.title}
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--color-fg)]">
            {caseStudy.pipeline.interrupt.body}
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {caseStudy.pipeline.videos.map((video, i) => (
            <Reveal key={video.src} delay={i * 0.08}>
              <video
                src={video.src}
                className="aspect-video w-full rounded-xl object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
                {video.caption}
              </p>
            </Reveal>
          ))}
        </div>

        <p className="mb-11 text-[15px] leading-relaxed text-[var(--color-fg)]">
          {caseStudy.pipeline.summary}
        </p>
      </CaseStudySection>

      <CaseStudySection id="challenges" number="05 — Challenges" title="Challenges">
        {/* Same title/body treatment as Drunky's "Engineering challenges
            overcome" — font-serif bold header, muted body below it. */}
        <div className="mb-11 flex flex-col gap-5">
          {caseStudy.challenges.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.06}
              className="border-b border-[var(--color-border)] pb-5 last:border-b-0"
            >
              <h3 className="mb-1.5 font-serif text-[17px] font-bold text-[var(--color-fg)]">
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="whats-next" number="06 — What's Next" title="What's Next" className="mb-20">
        <ul className="flex flex-col gap-4">
          {caseStudy.whatsNext.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <p className="text-[16px] leading-relaxed text-[var(--color-fg)]">
                <span className="font-bold">{item.title}</span> {item.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </CaseStudySection>
    </CaseStudyShell>
  );
}
