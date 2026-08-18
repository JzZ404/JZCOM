"use client";

import type { Project } from "@/data/projects";
import type { CaseStudyAlio } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import PlaceholderBlock from "./PlaceholderBlock";
import AiRoadmapTimeline, { phaseColor } from "./AiRoadmapTimeline";
import BusinessModelCanvas from "./BusinessModelCanvas";
import ResponsibleAiTable from "./ResponsibleAiTable";
import Reveal from "./Reveal";

export default function AlioCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudyAlio;
  nextProject: Project;
}) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "why", label: "Research" },
    { id: "problem", label: "Problem Statement" },
    { id: "competitive", label: "Competitive Analysis" },
    { id: "architecture", label: "System Architecture" },
    { id: "tech-stack", label: "Technical Stack" },
    { id: "prototype-demo", label: "Prototype Demo" },
    { id: "design-system", label: "Design System" },
    { id: "business-model", label: "Business Model Canvas" },
    { id: "roadmap", label: "AI Product Roadmap" },
    { id: "responsible-ai", label: "Responsible AI" },
    ...caseStudy.sections.map((section) => ({ id: section.id, label: section.title })),
  ];

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={tocItems} nextProject={nextProject}>
      {/* One numbered section ("01 — Research") holding two sub-headings —
          "Why We Built This" and "Research Results" don't each get their
          own number, they're both part of the same research beat. */}
      <CaseStudySection id="why" number="01 — Research" title="Why We Built This">
        <div className="mb-11 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <img
            src={caseStudy.whyWeBuiltThis.image}
            alt="Joyce and her grandmother"
            width={2401}
            height={1958}
            // Scaled down within its own grid column (not the column
            // itself) — the text column's position stays put either way.
            className="aspect-[2401/1958] w-5/6 rounded-xl object-cover"
          />
          <div className="relative right-[10px] flex flex-col justify-center">
            {/* Per-paragraph margin instead of a uniform flex gap — the
                1st-to-2nd gap grew by 8px and the 2nd-to-3rd gap shrank by
                the same 8px, so paragraph 2 shifts down without changing
                the block's total height (24+24 → 32+16, still 48px). */}
            {caseStudy.whyWeBuiltThis.story.map((paragraph, i) => {
              const isEmphasis = typeof paragraph === "object";
              const marginTop = i === 0 ? "" : i === 1 ? "mt-8" : "mt-4";
              return (
                <p
                  key={i}
                  className={`${marginTop} ${
                    isEmphasis
                      ? "text-[20px] leading-relaxed font-semibold text-[var(--color-primary)]"
                      : "text-[18px] leading-relaxed text-[var(--color-muted)]"
                  }`}
                >
                  {isEmphasis ? paragraph.text : paragraph}
                </p>
              );
            })}
          </div>
        </div>

        <h3
          id="research-results"
          className="mb-3.5 scroll-mt-28 font-serif text-[length:var(--text-h2)] font-bold text-[var(--color-fg)]"
        >
          Research Results
        </h3>
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {caseStudy.researchResults.stats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.08} className="rounded-xl bg-[var(--color-card)] p-6">
              <div className="font-serif text-[2.25rem] leading-tight font-bold text-[var(--color-primary)]">
                {stat.value}
              </div>
              <p className="mt-1.5 text-[16px] leading-snug text-[var(--color-muted)]">
                {stat.finding}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mb-11 rounded-xl bg-[var(--color-card)] p-8">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            {caseStudy.researchResults.gapLabel}
          </div>
          <p className="text-[16px] leading-relaxed font-normal text-[var(--color-fg)]">
            {caseStudy.researchResults.gap}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" number="02 — Problem Statement" title="The problem">
        {/* Editorial pull-quote treatment instead of a bordered info-card —
            matches the "Why We Built This" quote styling elsewhere on the
            page, reads as a statement rather than a templated callout box. */}
        <div className="mb-11 w-full">
          <div className="font-serif text-[3rem] leading-none text-[var(--color-border)]">“</div>
          <p className="-mt-5 font-serif text-[22px] leading-relaxed text-[var(--color-fg)]">
            {caseStudy.problem}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="competitive" number="03 — Competitive Analysis" title="Competitive Analysis">
        <div className="mb-6 grid grid-cols-1 gap-8 sm:grid-cols-[1.6fr_1fr]">
          <img
            src={caseStudy.competitive.image}
            alt="Competitive analysis of elder-care coordination and AI platforms"
            width={3690}
            height={2056}
            className="aspect-[3690/2056] w-full rounded-xl object-cover"
          />
          <div className="flex flex-col justify-center rounded-xl bg-[var(--color-card)] p-8">
            <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
              {caseStudy.competitive.gapLabel}
            </div>
            <p className="text-[16px] leading-relaxed font-normal text-[var(--color-fg)]">
              {caseStudy.competitive.gap}
            </p>
          </div>
        </div>
        {/* Distinct treatment from the neutral Gap card above — a light
            purple fill marks this as the differentiation takeaway, not
            another finding. */}
        <div className="mb-11 rounded-xl bg-[#EAEBF7]/75 p-8">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[#3730A3] uppercase">
            {caseStudy.competitive.positionLabel}
          </div>
          <p className="text-[16px] leading-relaxed font-semibold text-[#1E1B4B]">
            {caseStudy.competitive.position}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="architecture" number="04 — System Architecture" title="System Architecture">
        <div className="mb-11 grid grid-cols-1 gap-8 sm:grid-cols-[1.15fr_1fr]">
          <img
            src={caseStudy.systemArchitecture.image}
            alt="Alio system architecture: Caregiver Portal and Family Portal linked by the Alio AI Core"
            width={1892}
            height={1796}
            className="aspect-[1892/1796] w-full object-contain"
          />
          <div className="flex flex-col justify-center gap-6">
            {caseStudy.systemArchitecture.blocks.map((block, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <h3 className="mb-1.5 font-serif text-[19px] font-bold text-[var(--color-fg)]">
                  {block.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
                  {block.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="tech-stack" number="05 — Technical Stack" title="Technical Stack">
        <img
          src={caseStudy.technicalStackImage}
          alt="Alio technical stack: frontend, AI model, model behavior and constraints, data and sync"
          width={3423}
          height={796}
          className="mb-11 aspect-[3423/796] w-full rounded-xl object-contain"
        />
      </CaseStudySection>

      <CaseStudySection id="prototype-demo" number="06 — Prototype Demo" title="Prototype Demo">
        <div className="flex flex-col gap-1">
          {caseStudy.prototypeDemo.features.map((feature, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-center"
            >
              <div className={i % 2 === 1 ? "sm:order-2" : ""}>
                {feature.media ? (
                  <div
                    className={
                      feature.media.length > 1
                        ? "grid grid-cols-2 gap-4"
                        : "mx-auto w-3/5"
                    }
                  >
                    {feature.media.map((src, j) => (
                      <video
                        key={j}
                        src={src}
                        className="w-full rounded-[1.4rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ))}
                  </div>
                ) : (
                  <PlaceholderBlock label={feature.title} height={220} />
                )}
              </div>
              <div className={i % 2 === 1 ? "sm:order-1" : ""}>
                <h3 className="mb-1.5 font-serif text-[19px] font-bold text-[var(--color-fg)]">
                  {feature.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="design-system" number="07 — Design System" title="Built to scale">
        <img
          src={caseStudy.designSystemImage}
          alt="Alio design system — color palette, type scale, radii, and component sticker sheet"
          width={3429}
          height={1558}
          className="mb-11 aspect-[3429/1558] w-full rounded-xl object-contain"
        />
      </CaseStudySection>

      <CaseStudySection
        id="business-model"
        number="08 — Business Model Canvas"
        title="Business Model Canvas"
      >
        {/* Reverted to the static export for now — the code-rebuilt grid's
            hierarchy wasn't reading clearly enough yet. BusinessModelCanvas
            is kept around to pick back up later. */}
        <img
          src="/images/alio/business-model.png"
          alt="Alio business model canvas"
          width={1206}
          height={681}
          className="mb-11 aspect-[1206/681] w-full rounded-xl object-contain"
        />
      </CaseStudySection>

      <CaseStudySection id="roadmap" number="09 — AI Product Roadmap" title="AI Product Roadmap">
        <div className="mb-11">
          <AiRoadmapTimeline count={caseStudy.aiRoadmap.phases.length} />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {caseStudy.aiRoadmap.phases.map((phase, i) => {
              const color = phaseColor(i, caseStudy.aiRoadmap.phases.length);
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <h3 className="font-serif text-[17px] font-bold" style={{ color }}>
                    {phase.title}
                  </h3>
                  <p className="mb-4 text-[14px] leading-snug text-[var(--color-fg)]">
                    {phase.goal}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {phase.steps.map((step, j) => (
                      <li key={j} className="text-[12px] leading-snug text-[var(--color-muted)]">
                        • {step}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="responsible-ai" number="10 — Responsible AI" title="Responsible AI">
        <ResponsibleAiTable rows={caseStudy.responsibleAi.rows} />
      </CaseStudySection>

      {caseStudy.sections.map((section) => (
        <CaseStudySection
          key={section.id}
          id={section.id}
          number={section.number}
          title={section.title}
        >
          <PlaceholderBlock label={section.placeholder} height={240} className="mb-11" />
        </CaseStudySection>
      ))}
    </CaseStudyShell>
  );
}
