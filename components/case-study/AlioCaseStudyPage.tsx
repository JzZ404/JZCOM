"use client";

import type { Project } from "@/data/projects";
import type { CaseStudyAlio } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import PlaceholderBlock from "./PlaceholderBlock";
import AiRoadmapTimeline, { phaseColor, phaseDelay } from "./AiRoadmapTimeline";
import BusinessModelCanvas from "./BusinessModelCanvas";
import AlioPositioningMap from "./AlioPositioningMap";
import AlioFeatureMatrix from "./AlioFeatureMatrix";
import AlioArchitectureFlow from "./AlioArchitectureFlow";
import ResponsibleAiSafeguards from "./ResponsibleAiSafeguards";
import AlioTechStack from "./AlioTechStack";
import AlioResearchStats from "./AlioResearchStats";
import Reveal from "./Reveal";
import AlternatingVideos from "./AlternatingVideos";
import { IconGlyph } from "./IconBadge";

const ALIO_PROBLEM_HIGHLIGHTS = [
  "constant, valuable information",
  "clinically useful",
  "unstructured",
  "raw caregiver input",
  "actionable",
  "interpreted labs, triage, structured logs, and visit reports",
];

function HighlightedAlioProblem({ text }: { text: string }) {
  const pattern = new RegExp(
    `(${ALIO_PROBLEM_HIGHLIGHTS.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g",
  );

  return (
    <>
      {text.split(pattern).map((part, i) =>
        ALIO_PROBLEM_HIGHLIGHTS.includes(part) ? (
          <strong key={i} className="font-bold text-[#3730A3]">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

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
    { id: "problem", label: "Problem" },
    { id: "competitive", label: "Competitor" },
    { id: "architecture", label: "Architecture" },
    { id: "tech-stack", label: "Technical" },
    { id: "demo", label: "Demo" },
    { id: "design-system", label: "Design System" },
    { id: "business-model", label: "Business Model" },
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
          <Reveal variant="left">
            <img
              src={caseStudy.whyWeBuiltThis.image}
              alt="Joyce and her grandmother"
              width={2401}
              height={1958}
              // Scaled down within its own grid column (not the column
              // itself) — the text column's position stays put either way.
              className="aspect-[2401/1958] w-5/6 rounded-xl object-cover"
            />
          </Reveal>
          <Reveal variant="right" delay={0.08} className="relative right-[10px] flex flex-col justify-center">
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
          </Reveal>
        </div>

        <h3
          id="research-results"
          className="mb-3.5 scroll-mt-28 font-serif text-[length:var(--text-h2)] font-bold text-[var(--color-fg)]"
        >
          Research Results
        </h3>
        <AlioResearchStats stats={caseStudy.researchResults.stats} />

        <Reveal variant="soft" delay={0.1} className="mb-11 rounded-xl bg-[var(--color-card)] p-8">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            {caseStudy.researchResults.gapLabel}
          </div>
          <p className="text-[16px] leading-relaxed font-normal text-[var(--color-fg)]">
            {caseStudy.researchResults.gap}
          </p>
        </Reveal>
      </CaseStudySection>

      <CaseStudySection id="problem" number="02 — Problem" title="The problem">
        {/* Editorial pull-quote treatment instead of a bordered info-card —
            matches the "Why We Built This" quote styling elsewhere on the
            page, reads as a statement rather than a templated callout box. */}
        <Reveal variant="soft" className="relative mb-11 w-full pl-8 sm:pl-12">
          <div className="absolute top-0 left-0 font-serif text-[5.5rem] leading-none text-[var(--color-border)]">
            “
          </div>
          <p className="pt-7 font-serif text-[22px] leading-relaxed text-[var(--color-fg)]">
            <HighlightedAlioProblem text={caseStudy.problem} />
          </p>
        </Reveal>
      </CaseStudySection>

      <CaseStudySection id="competitive" number="03 — Competitive Analysis" title="Competitive Analysis">
        {/* What each one does (left) beside where everyone sits (right) */}
        {/* Both columns stretch to the same height: the table sets it and
            the map fills it */}
        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-4">
          <div className="flex flex-col">
            <h3 className="mb-4 font-serif text-[20px] font-bold text-[var(--color-fg)]">Feature comparison</h3>
            <div className="flex-1">
              <AlioFeatureMatrix {...caseStudy.competitive.features} />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="mb-4 font-serif text-[20px] font-bold text-[var(--color-fg)]">Positioning</h3>
            <div className="flex-1">
              <AlioPositioningMap
                {...caseStudy.competitive.positioning}
                descriptions={Object.fromEntries(caseStudy.competitive.competitors.map((c) => [c.name, c.description]))}
              />
            </div>
          </div>
        </div>
        {/* The takeaway pair under the cards: the gap in the field (neutral)
            beside Alio's answer to it (light purple, the differentiation) */}
        <div className="mb-11 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal variant="left" className="flex flex-col justify-center rounded-xl bg-[var(--color-card)] p-8">
            <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
              {caseStudy.competitive.gapLabel}
            </div>
            <p className="text-[16px] leading-relaxed font-normal text-[var(--color-fg)]">
              {caseStudy.competitive.gap}
            </p>
          </Reveal>
          <Reveal variant="right" delay={0.08} className="rounded-xl bg-[#EAEBF7]/75 p-8">
            <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[#3730A3] uppercase">
              {caseStudy.competitive.positionLabel}
            </div>
            <p className="text-[16px] leading-relaxed font-semibold text-[#1E1B4B]">
              {caseStudy.competitive.position}
            </p>
          </Reveal>
        </div>
      </CaseStudySection>

      <CaseStudySection id="architecture" number="04 — System Architecture" title="System Architecture">
        {/* The flowchart on the left; the three ideas on the right, staying in
            view while the (tall) chart scrolls past on wide screens */}
        <div className="mb-11 grid grid-cols-1 items-start gap-10 lg:grid-cols-[3fr_2fr]">
          <AlioArchitectureFlow
            lanes={caseStudy.systemArchitecture.lanes}
            crossLinks={caseStudy.systemArchitecture.crossLinks}
          />
          <div className="flex flex-col gap-7 lg:sticky lg:top-32">
            {caseStudy.systemArchitecture.blocks.map((block, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1} variant="right">
                <h3 className="mb-1.5 font-serif text-[19px] font-bold text-[var(--color-fg)]">{block.title}</h3>
                <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">{block.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="tech-stack" number="05 — Technical Stack" title="Technical Stack">
        <AlioTechStack layers={caseStudy.technicalStack} />
      </CaseStudySection>

      <CaseStudySection id="demo" number="06 — Demo" title="Demo">
        <div className="flex flex-col gap-1">
          {caseStudy.prototypeDemo.features.map((feature, i) => (
            // Each row's media slides in from its own side and the text from
            // the other, so the alternating layout reads as it arrives.
            <div key={i} className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:items-center">
              <Reveal variant={i % 2 === 0 ? "left" : "right"} className={i % 2 === 1 ? "sm:order-2" : ""}>
                {feature.media && feature.media.length > 1 ? (
                  <AlternatingVideos media={feature.media} />
                ) : feature.media ? (
                  <figure className="mx-auto w-3/5">
                    <video
                      src={feature.media[0].src}
                      // The default rate too: loading a source resets the speed to it.
                      ref={(el) => {
                        if (!el) return;
                        el.defaultPlaybackRate = el.playbackRate = feature.media?.[0].playbackRate ?? 1;
                      }}
                      // Paused while the mouse is over it (mouse only — not taps)
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") e.currentTarget.pause();
                      }}
                      onPointerLeave={(e) => {
                        if (e.pointerType === "mouse") e.currentTarget.play().catch(() => {});
                      }}
                      className="w-full rounded-[1.4rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    {feature.media[0].caption && (
                      <figcaption className="mt-3 text-center text-[14px] leading-relaxed text-[var(--color-muted)] italic">
                        {feature.media[0].caption}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <PlaceholderBlock label={feature.title} height={220} />
                )}
              </Reveal>
              <Reveal
                variant={i % 2 === 0 ? "right" : "left"}
                delay={0.1}
                // Text on the left under a single video on the left (centered at
                // w-3/5, so inset 20%) starts at that video's left edge
                className={`${i % 2 === 1 ? "sm:order-1" : ""} ${
                  i % 2 === 1 && caseStudy.prototypeDemo.features[i - 1]?.media?.length === 1 ? "sm:pl-[20%]" : ""
                }`}
              >
                <h3 className="mb-1.5 flex items-center gap-2.5 font-serif text-[19px] font-bold text-[var(--color-fg)]">
                  {/* In Alio's indigo, matching the page's other accents */}
                  {feature.icon && (
                    <IconGlyph name={feature.icon} className="h-6 w-6 shrink-0" style={{ color: "#3730A3" }} />
                  )}
                  {feature.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
                  {feature.body}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="design-system" number="07 — Design System" title="Built to scale">
        <Reveal variant="scale" className="mb-11">
          <img
            src={caseStudy.designSystemImage}
            alt="Alio design system — color palette, type scale, radii, and component sticker sheet"
            width={3429}
            height={1558}
            className="aspect-[3429/1558] w-full rounded-xl object-contain"
          />
        </Reveal>
      </CaseStudySection>

      <CaseStudySection
        id="business-model"
        number="08 — Business Model Canvas"
        title="Business Model Canvas"
      >
        <BusinessModelCanvas topRow={caseStudy.businessModel.topRow} bottomRow={caseStudy.businessModel.bottomRow} />
      </CaseStudySection>

      <CaseStudySection id="roadmap" number="09 — AI Product Roadmap" title="AI Product Roadmap">
        <div className="mb-11">
          <AiRoadmapTimeline count={caseStudy.aiRoadmap.phases.length} />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {caseStudy.aiRoadmap.phases.map((phase, i) => {
              const color = phaseColor(i, caseStudy.aiRoadmap.phases.length);
              return (
                <Reveal key={i} delay={phaseDelay(i, caseStudy.aiRoadmap.phases.length)}>
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
        <ResponsibleAiSafeguards rows={caseStudy.responsibleAi.rows} />
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
