"use client";

import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import Reveal from "./Reveal";

// Approximated from Joyce's palette swatch image (no hex values given) —
// Lime Deep, Mint Bright, Periwinkle. Adjust if she supplies exact hex.
// rgba (not opacity) so the color itself is softer/less saturated while the
// text on top stays fully legible. `fold` is just a touch darker than `bg` —
// the underside of the paper at the peeled corner, not a hard contrast.
const STICKY_NOTE_STYLES = [
  { bg: "rgba(141, 198, 63, 0.7)", fold: "rgba(112, 165, 48, 0.75)", rotate: -4 },
  { bg: "rgba(126, 238, 196, 0.7)", fold: "rgba(95, 205, 168, 0.75)", rotate: 3 },
  { bg: "rgba(140, 147, 240, 0.7)", fold: "rgba(108, 114, 205, 0.75)", rotate: -2 },
];

const NEST_TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "persona-alex", label: "Personas" },
  { id: "journey-alex", label: "Journey Map" },
  { id: "problem", label: "Problem Statement" },
  { id: "competitive", label: "Competitive Analysis" },
  { id: "hmw", label: "How Might We" },
  { id: "goal", label: "Goal Statement" },
  { id: "flow", label: "User Flow" },
  { id: "lofi", label: "Lo-fi" },
  { id: "hifi", label: "Hi-fi" },
  { id: "design-system", label: "Design System" },
];

export default function CaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudy;
  nextProject: Project;
}) {
  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={NEST_TOC_ITEMS} nextProject={nextProject}>
      <CaseStudySection id="research" number="01 — Research" title="What we heard">
        <p className="mb-8 w-full text-[16px] leading-relaxed text-[var(--color-muted)]">
          {caseStudy.research.intro}
        </p>
        {/* Exactly 3 findings, evenly spaced. The third has no numeral
            to anchor to, so the key phrase itself gets the same
            big/bold/green treatment as the other two numbers. */}
        <div className="mb-11 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {caseStudy.research.stats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.08} className="rounded-xl bg-[var(--color-card)] p-6">
              <div
                className={`font-serif leading-tight font-bold text-[var(--color-primary)] ${
                  stat.compact ? "text-[1.4rem]" : "text-[2.75rem] leading-none"
                }`}
              >
                {stat.value}
              </div>
              <p className="mt-1.5 text-[16px] leading-snug text-[var(--color-muted)]">
                {stat.finding}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mb-8">
          <div className="mb-4 font-mono text-[12px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            {caseStudy.research.quotesTitle}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {caseStudy.research.quotes.map((quote, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="font-serif text-[2.5rem] leading-none text-[var(--color-border)]">
                  “
                </div>
                <p className="-mt-3 font-serif text-[16px] leading-relaxed text-[var(--color-fg)] italic">
                  {quote}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mb-11 rounded-xl bg-[var(--color-surface)] p-6.5">
          <div className="mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            Hypothesis
          </div>
          <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
            {caseStudy.research.hypothesis}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="personas" number="02 — Persona & Journey Map" title="Who we designed for">
        <div className="mb-11 flex flex-col gap-10">
          {caseStudy.personas.map((persona, i) => {
            const journey = caseStudy.journeys[i];
            const slug = persona.name.split(" ")[0].toLowerCase();
            return (
              <Reveal key={persona.name} delay={i * 0.1}>
                <div className="mb-3 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  User {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-col gap-4">
                  <img
                    id={`persona-${slug}`}
                    src={persona.image}
                    alt={`${persona.name} persona`}
                    width={1326}
                    height={663}
                    className="aspect-[1326/663] w-full scroll-mt-28 rounded-xl border border-[var(--color-border)]"
                  />
                  {journey && (
                    <img
                      id={`journey-${slug}`}
                      src={journey.image}
                      alt={`${journey.persona} journey map`}
                      width={1326}
                      height={632}
                      className="aspect-[1326/632] w-full scroll-mt-28 rounded-xl border border-[var(--color-border)]"
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" number="03 — Problem Statement" title="The problem">
        <div className="mb-11 rounded-xl border-l-4 border-[var(--color-primary)] bg-[var(--color-card)] p-8">
          <p className="w-full text-[18px] font-semibold leading-relaxed text-[var(--color-fg)]">
            {caseStudy.problem}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="competitive"
        number="04 — Competitive Analysis"
        title="What the market already knows"
      >
        <img
          src={caseStudy.competitiveAuditImage}
          alt="Competitive audit"
          width={1121}
          height={720}
          className="aspect-[1121/720] mb-11 w-full rounded-xl border border-[var(--color-border)]"
        />
      </CaseStudySection>

      <CaseStudySection id="hmw" number="05 — How Might We" title="Where we chose to focus">
        {/* Sticky-note treatment — colors approximated from the palette
            swatch Joyce shared (Lime Deep / Mint Bright / Periwinkle).
            Slight alternating rotation + overlap so they read as
            notes pinned up, not a tidy grid. */}
        <div className="mb-11 flex flex-wrap justify-center gap-6 py-6">
          {caseStudy.hmws.map((hmw, i) => {
            const note = STICKY_NOTE_STYLES[i % STICKY_NOTE_STYLES.length];
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: note.bg,
                    transform: `rotate(${note.rotate}deg)`,
                    boxShadow: "6px 12px 20px rgba(0,0,0,0.3)",
                  }}
                  className="relative flex h-56 w-64 shrink-0 items-center justify-center rounded-sm p-7"
                >
                  <p className="text-center text-[16px] leading-snug font-semibold text-[#1a1f16]">
                    {hmw}
                  </p>
                  {/* Folded corner: a darker triangle (the paper's
                      underside) with its own drop-shadow, like a real
                      peeled sticky-note corner lifting off the page. */}
                  <div
                    className="pointer-events-none absolute right-0 bottom-0 h-11 w-11"
                    style={{
                      backgroundColor: note.fold,
                      clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)",
                      filter: "drop-shadow(-2px -3px 3px rgba(0,0,0,0.35))",
                    }}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </CaseStudySection>

      <CaseStudySection id="goal" number="06 — Goal Statement" title="The goal">
        <div className="mb-11 rounded-xl bg-[var(--color-card)] p-8">
          <p className="w-full text-[16px] leading-relaxed text-[var(--color-muted)]">
            {caseStudy.goal}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="flow" number="07 — User Flow" title="Structure & flow">
        <img
          src={caseStudy.userFlowImage}
          alt="Information architecture and user flow"
          width={3169}
          height={1672}
          className="aspect-[3169/1672] mb-11 w-full rounded-xl"
        />
      </CaseStudySection>

      <CaseStudySection id="lofi" number="08 — Lo-fi" title="Early wireframes">
        <img
          src={caseStudy.lofiImage}
          alt="Lo-fi wireframes"
          width={4833}
          height={3182}
          className="aspect-[4833/3182] w-full rounded-xl"
        />
      </CaseStudySection>

      <CaseStudySection id="hifi" number="09 — Hi-fi" title="Final prototype">
        <img
          src={caseStudy.hifiImage}
          alt="Hi-fi prototype screens"
          width={3683}
          height={2460}
          className="aspect-[3683/2460] w-full rounded-xl"
        />
      </CaseStudySection>

      <CaseStudySection
        id="design-system"
        number="10 — Design System"
        title="Built to scale"
        className="mb-16"
      >
        <img
          src={caseStudy.designSystemImage}
          alt="Design system"
          width={912}
          height={601}
          className="aspect-[912/601] w-full rounded-xl"
        />
      </CaseStudySection>
    </CaseStudyShell>
  );
}
