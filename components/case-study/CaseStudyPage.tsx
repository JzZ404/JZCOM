"use client";

import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import Reveal from "./Reveal";
import MarkedQuote from "./MarkedQuote";
import NestCompetitiveTable from "./NestCompetitiveTable";
import NestGoal from "./NestGoal";
import NestResearch from "./NestResearch";
import StickyNote from "./StickyNote";

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
  { id: "problem", label: "Problem" },
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
        <NestResearch research={caseStudy.research} />
      </CaseStudySection>

      <CaseStudySection id="personas" number="02 — Persona & Journey Map" title="Who we designed for">
        <div className="mb-11 flex flex-col gap-10">
          {caseStudy.personas.map((persona, i) => {
            const journey = caseStudy.journeys[i];
            const slug = persona.name.split(" ")[0].toLowerCase();
            return (
              // Persona slides in from the left, its journey map from the right
              <div key={persona.name}>
                <div className="mb-3 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                  User {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex flex-col gap-4">
                  <Reveal variant="left">
                    <img
                      id={`persona-${slug}`}
                      src={persona.image}
                      alt={`${persona.name} persona`}
                      width={1326}
                      height={663}
                      className="aspect-[1326/663] w-full scroll-mt-28 rounded-xl border border-[var(--color-border)]"
                    />
                  </Reveal>
                  {journey && (
                    <Reveal variant="right" delay={0.08}>
                      <img
                        id={`journey-${slug}`}
                        src={journey.image}
                        alt={`${journey.persona} journey map`}
                        width={1326}
                        height={632}
                        className="aspect-[1326/632] w-full scroll-mt-28 rounded-xl border border-[var(--color-border)]"
                      />
                    </Reveal>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" number="03 — Problem" title="The problem">
        {/* Same pull-quote treatment as Alio's problem, with the key phrases
            highlighted in the HMW notes' mint */}
        <MarkedQuote
          text={caseStudy.problem}
          highlights={caseStudy.problemHighlights}
          color="rgba(126, 238, 196, 0.55)"
        />
      </CaseStudySection>

      <CaseStudySection
        id="competitive"
        number="04 — Competitive Analysis"
        title="What the market already knows"
      >
        <NestCompetitiveTable {...caseStudy.competitiveAudit} />
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
              <Reveal key={i} delay={i * 0.1} variant="scale">
                <StickyNote text={hmw} bg={note.bg} fold={note.fold} rotate={note.rotate} />
              </Reveal>
            );
          })}
        </div>
      </CaseStudySection>

      <CaseStudySection id="goal" number="06 — Goal Statement" title="The goal">
        <NestGoal goal={caseStudy.goal} />
      </CaseStudySection>

      <CaseStudySection id="flow" number="07 — User Flow" title="Structure & flow">
        <Reveal variant="scale" className="mb-11">
          <img
            src={caseStudy.userFlowImage}
            alt="Information architecture and user flow"
            width={3169}
            height={1672}
            className="aspect-[3169/1672] w-full rounded-xl"
          />
        </Reveal>
      </CaseStudySection>

      <CaseStudySection id="lofi" number="08 — Lo-fi" title="Early wireframes">
        <Reveal variant="scale">
          <img
            src={caseStudy.lofiImage}
            alt="Lo-fi wireframes"
            width={4833}
            height={3182}
            className="aspect-[4833/3182] w-full rounded-xl"
          />
        </Reveal>
      </CaseStudySection>

      <CaseStudySection id="hifi" number="09 — Hi-fi" title="Final prototype">
        <Reveal variant="scale">
          <img
            src={caseStudy.hifiImage}
            alt="Hi-fi prototype screens"
            width={3683}
            height={2460}
            className="aspect-[3683/2460] w-full rounded-xl"
          />
        </Reveal>
      </CaseStudySection>

      <CaseStudySection
        id="design-system"
        number="10 — Design System"
        title="Built to scale"
        className="mb-16"
      >
        <Reveal variant="scale">
          <img
            src={caseStudy.designSystemImage}
            alt="Design system"
            width={1312}
            height={687}
            className="aspect-[1312/687] w-full rounded-xl"
          />
        </Reveal>
      </CaseStudySection>
    </CaseStudyShell>
  );
}
