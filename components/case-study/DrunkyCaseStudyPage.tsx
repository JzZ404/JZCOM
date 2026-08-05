"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import type { CaseStudyDrunky } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import Reveal from "./Reveal";

// Cocktail illustrations Joyce shot for the Drunky menu, cycled one per
// section instead of a generic icon — same 01-06 order as the printed menu
// (Whiskey & Coke through Gin Buck), so the numbering doubles as a wink at
// the actual drink list. Tequila & Tonic, Tequila Sunrise, and the secret
// Bix Cup stay unused here, free for the hero or an easter egg later.
const SECTION_ICONS = {
  why: { src: "/images/drunky/whiskey-coke.png", alt: "Whiskey & Coke illustration" },
  architecture: { src: "/images/drunky/whiskey-ginger.png", alt: "Whiskey Ginger illustration" },
  pipeline: { src: "/images/drunky/moscow-mule.png", alt: "Moscow Mule illustration" },
  challenges: { src: "/images/drunky/screwdriver.png", alt: "Screwdriver illustration" },
  evaluation: { src: "/images/drunky/gin-tonic.png", alt: "Gin & Tonic illustration" },
  whatsNext: { src: "/images/drunky/gin-buck.png", alt: "Gin Buck illustration" },
};

// Part-to-whole "where it fails" breakdown as a solid pie (donut hole and
// center label removed per Joyce — the wedges themselves plus hover carry
// the read). Colors pull from the existing brand set instead of one hue's
// shades, so neighboring slices are actually distinct rather than just
// lighter/darker green — includes --color-highlight, the yellow-green
// "pop" step from the confirmed palette. Every slice has a legend row
// AND a hover tooltip with its label, so identity never rides on color
// alone even where two of these five sit close in hue.
const PIE_COLORS = [
  "var(--color-primary-dark)",
  "var(--color-primary)",
  "var(--color-highlight)",
  "var(--color-accent)",
  "var(--color-primary-light)",
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Slice path anchored at the true center (cx,cy) — the hover "explode"
// effect below moves the whole slice outward along its own mid-angle
// instead, so the pie stays a clean circle at rest.
function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function FailurePie({ failures }: { failures: { label: string; pct: number }[] }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 120;
  const [hovered, setHovered] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  let cumulative = 0;
  const slices = failures.map((failure) => {
    const startAngle = cumulative * 3.6;
    cumulative += failure.pct;
    const endAngle = cumulative * 3.6;
    const midAngle = (startAngle + endAngle) / 2;
    return { ...failure, startAngle, endAngle, midAngle };
  });

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {slices.map((slice, i) => {
          // Nudge the hovered slice outward along its own mid-angle — a
          // gentle "pop out of the plate" instead of a flat scale, which
          // would just make the wedge overlap its neighbors at the center.
          const isHovered = hovered === i;
          const nudge = polarToCartesian(0, 0, isHovered ? 8 : 0, slice.midAngle);
          return (
            <path
              key={slice.label}
              d={describeSlice(cx, cy, radius, slice.startAngle, slice.endAngle)}
              fill={PIE_COLORS[i % PIE_COLORS.length]}
              stroke="var(--color-bg)"
              strokeWidth={2}
              style={{
                transform: `translate(${nudge.x}px, ${nudge.y}px) scale(${isHovered ? 1.04 : 1})`,
                transformOrigin: `${cx}px ${cy}px`,
                transition: "transform 0.18s ease-out, filter 0.18s ease-out",
                filter: isHovered ? "drop-shadow(0 6px 10px rgba(0,0,0,0.25))" : "none",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
      {hovered !== null && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg bg-[var(--color-fg)] px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[var(--color-bg)] shadow-lg"
          style={{ left: mouse.x + 14, top: mouse.y - 12 }}
        >
          {slices[hovered].label} — {slices[hovered].pct}%
        </div>
      )}
    </div>
  );
}

function FailureLegend({ failures }: { failures: { label: string; pct: number }[] }) {
  return (
    <ul className="flex flex-1 flex-col gap-2.5">
      {failures.map((failure, i) => (
        <Reveal key={failure.label} delay={i * 0.05} className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
          />
          <span className="text-[14px] text-[var(--color-fg)]">{failure.label}</span>
          <span className="ml-auto font-mono text-[13px] font-semibold text-[var(--color-muted)]">
            {failure.pct}%
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

const DRUNKY_TOC_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "Why We Built This" },
  { id: "architecture", label: "System Architecture" },
  { id: "pipeline", label: "The Pipeline" },
  { id: "challenges", label: "Challenges" },
  { id: "evaluation", label: "Evaluation & Results" },
  { id: "whats-next", label: "What's Next" },
];

export default function DrunkyCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudyDrunky;
  nextProject: Project;
}) {
  // Grid/flex auto-sizing can only ever grow a row to fit its tallest
  // item — there's no pure-CSS way to shrink the photo down to match the
  // (shorter) text column instead. So measure the text column's actual
  // rendered height and apply it to the image directly. Desktop only
  // (via the --why-img-h var, read by a sm:-scoped class) — mobile stacks
  // the two and should keep the photo at its own natural aspect ratio.
  const whyTextRef = useRef<HTMLDivElement>(null);
  const [whyImgHeight, setWhyImgHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = whyTextRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWhyImgHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={DRUNKY_TOC_ITEMS} nextProject={nextProject}>
      <CaseStudySection
        id="why"
        number="01 — Why We Built This"
        title="Why We Built This"
        icon={SECTION_ICONS.why}
      >
        {/* Photo left (scaled down, no longer filling the column — it was
            competing too hard with the text), one continuous four-beat
            read on the right. Same 16px size throughout (no hierarchy
            jump), but each beat gets its own color/font treatment so the
            voice visibly shifts: neutral scene-setting → direct problem →
            serif-italic pivot → bold payoff in the brand color. */}
        {/* grid-cols-[2fr_3fr] instead of an even split + w-4/5 on the
            image — that earlier approach left the image's own column 20%
            wider than the image itself, so reducing `gap` barely moved
            the text (it was closing the 12px gap, not the ~94px of dead
            column space next to it). Sizing the column to match the image
            directly means `gap` is now the only space between them. */}
        <div className="mb-11 grid grid-cols-1 gap-5 sm:grid-cols-[2fr_3fr] sm:gap-[40px]">
          {caseStudy.whyWeBuiltThis.image && (
            <img
              src={caseStudy.whyWeBuiltThis.image}
              alt="Drunky bar setup — mini bottles and printed cocktail menus"
              // aspect-[4/5] is the mobile fallback (natural sizing when
              // stacked). At sm+ only, an explicit pixel height measured
              // from the text column overrides it via a CSS var — a plain
              // inline height would apply on mobile too, where the photo
              // should keep its own aspect ratio instead of matching a
              // full-width single-column text block. object-bottom crops
              // off the top of the photo rather than the menus lower in
              // frame.
              className="aspect-[4/5] w-full rounded-xl object-cover object-bottom sm:aspect-auto sm:h-[var(--why-img-h)]"
              style={whyImgHeight ? ({ "--why-img-h": `${whyImgHeight}px` } as React.CSSProperties) : undefined}
            />
          )}
          <div ref={whyTextRef} className="flex flex-col justify-start gap-5 self-start">
            <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">
              {caseStudy.whyWeBuiltThis.lead}
            </p>
            <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">
              {caseStudy.whyWeBuiltThis.problem}
            </p>
            {/* Extra breathing room before the pivot line — the rest of
                the stack shares a tighter gap-5. */}
            <p className="mt-4 font-serif text-[18px] leading-relaxed text-[var(--color-primary)] italic">
              {caseStudy.whyWeBuiltThis.question}
            </p>
            <p className="text-[17px] leading-relaxed font-semibold text-[var(--color-primary-dark)]">
              {caseStudy.whyWeBuiltThis.answer}
            </p>
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="architecture"
        number="02 — System Architecture"
        title="System Architecture"
        icon={SECTION_ICONS.architecture}
      >
        {/* Same left-to-right stage flow as the project deck's diagram —
            arrows only from sm up, since 4 stages + arrows can't fit a
            phone width and just wrap ugly. */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-stretch">
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
        <div className="mb-3 rounded-xl bg-[var(--color-surface)] p-6.5 text-center">
          <p className="font-mono text-[13px] leading-relaxed font-semibold text-[var(--color-fg)]">
            {caseStudy.systemArchitecture.flow}
          </p>
        </div>
        <p className="mb-11 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
          {caseStudy.systemArchitecture.note}
        </p>
      </CaseStudySection>

      <CaseStudySection
        id="pipeline"
        number="03 — The Pipeline"
        title="The Pipeline"
        icon={SECTION_ICONS.pipeline}
      >
        {caseStudy.pipeline.video && (
          <p className="mb-5 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
            {caseStudy.pipeline.video.caption}
          </p>
        )}
        {/* Fixed aspect-ratio (not h-full/min-h) so the video's box always
            exactly matches its own content — forcing extra box height
            beyond that (min-h, tried earlier) just left dead space above
            the picture, which read as a stray gap with square corners
            floating inside the real rounded box. Sizing up now comes from
            a wider column (3fr vs 2fr) instead, which grows the video with
            zero letterboxing since width and height stay locked together. */}
        <div className="mb-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-[3fr_2fr]">
          {caseStudy.pipeline.video && (
            <video
              src={caseStudy.pipeline.video.src}
              className="aspect-[1720/1080] w-full rounded-2xl object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          <div className="flex flex-col gap-4">
            {caseStudy.pipeline.phases.map((phase, i) => (
              <Reveal key={phase.title} delay={i * 0.06} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-serif text-[15px] font-bold text-[var(--color-on-primary)]">
                  {phase.number}
                </div>
                <div>
                  <h3 className="font-serif text-[16px] font-bold text-[var(--color-fg)]">
                    {phase.title}
                  </h3>
                  <p className="text-[13px] leading-snug text-[var(--color-muted)]">{phase.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mb-11 rounded-xl bg-[var(--color-surface)] p-6.5">
          <p className="text-[15px] leading-relaxed text-[var(--color-fg)]">
            {caseStudy.pipeline.summary}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="challenges"
        number="04 — Challenges"
        title="Challenges"
        icon={SECTION_ICONS.challenges}
      >
        <h3 className="mb-4 font-serif text-[19px] font-bold text-[var(--color-fg)]">
          {caseStudy.challenges.pivot.title}
        </h3>
        <div className="mb-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Reveal className="rounded-xl bg-[var(--color-surface)] p-6">
            <h4 className="mb-3 font-serif text-[16px] font-bold text-[var(--color-muted)] italic">
              {caseStudy.challenges.pivot.before.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {caseStudy.challenges.pivot.before.items.map((item) => (
                <li key={item} className="text-[14px] leading-relaxed text-[var(--color-muted)]">
                  • {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-card)] p-6">
            <h4 className="mb-3 font-serif text-[16px] font-bold text-[var(--color-primary)] italic">
              {caseStudy.challenges.pivot.after.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {caseStudy.challenges.pivot.after.items.map((item) => (
                <li key={item} className="text-[14px] leading-relaxed text-[var(--color-fg)]">
                  • {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <p className="mb-11 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
          {caseStudy.challenges.pivot.note}
        </p>

        <h3 className="mb-4 font-serif text-[19px] font-bold text-[var(--color-fg)]">
          Engineering challenges overcome
        </h3>
        <div className="mb-11 flex flex-col gap-5">
          {caseStudy.challenges.engineering.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.06}
              className="grid grid-cols-1 gap-1 border-b border-[var(--color-border)] pb-5 last:border-b-0 sm:grid-cols-[1fr_2fr] sm:gap-6"
            >
              <h4 className="font-serif text-[15px] font-bold text-[var(--color-fg)]">{item.title}</h4>
              <p className="text-[14px] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection
        id="evaluation"
        number="05 — Evaluation & Results"
        title="Evaluation & Results"
        icon={SECTION_ICONS.evaluation}
      >
        {/* One row, four numbers — the trial-design stats plus the overall
            result, instead of a separate oversized green block for 62.7%
            that made a middling number look like the headline stat. Same
            row, same scale, just the last cell gets the green highlight. */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {caseStudy.evaluation.experiment.map((stat, i) => (
            // Same py-3 as the highlighted tile below, even though these
            // three have no visible box — otherwise the tile's own padding
            // pushes its number/label down and the row reads misaligned.
            <Reveal key={stat.label} delay={i * 0.06} className="py-3 text-center">
              <div className="font-serif text-[2rem] leading-none font-bold text-[var(--color-fg)] sm:text-[2.5rem]">
                {stat.value}
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-muted)]">{stat.label}</p>
            </Reveal>
          ))}
          <Reveal
            delay={caseStudy.evaluation.experiment.length * 0.06}
            className="rounded-xl bg-[var(--color-primary)] py-3 text-center"
          >
            <div className="font-serif text-[2rem] leading-none font-bold text-[var(--color-on-primary)] sm:text-[2.5rem]">
              {caseStudy.evaluation.headline.value}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-on-primary)] opacity-90">
              {caseStudy.evaluation.headline.label}
            </p>
          </Reveal>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {caseStudy.evaluation.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} className="rounded-xl bg-[var(--color-card)] p-6">
              <div className="font-serif text-[1.5rem] leading-none font-bold text-[var(--color-fg)]">
                {stat.value}
              </div>
              <p className="mt-1.5 text-[14px] leading-snug text-[var(--color-muted)]">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        {/* Timing sits right under the vodka/coke result pair — the last
            two "how well does it perform" numbers grouped with the rest.
            Same bg-card + text-[1.5rem] as the stats grid above, not
            bg-surface/1.75rem — this row needs to read as one continuous
            set of result tiles, not a visually distinct group. */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {caseStudy.evaluation.timing.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} className="rounded-xl bg-[var(--color-card)] p-6">
              <div className="font-serif text-[1.5rem] leading-none font-bold text-[var(--color-fg)]">
                {stat.value}
              </div>
              <p className="mt-1.5 text-[14px] leading-snug text-[var(--color-muted)]">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mb-11 flex flex-col gap-3">
          {caseStudy.evaluation.insights.map((insight, i) => {
            const isEmphasis = typeof insight === "object";
            return (
              <Reveal key={i} delay={i * 0.06}>
                <p
                  className={
                    isEmphasis
                      ? "text-[15px] leading-relaxed font-bold text-[var(--color-primary)]"
                      : "text-[15px] leading-relaxed text-[var(--color-muted)]"
                  }
                >
                  {isEmphasis ? insight.text : insight}
                </p>
              </Reveal>
            );
          })}
        </div>

        <h3 className="mb-1 font-serif text-[19px] font-bold text-[var(--color-fg)]">
          Where it fails
        </h3>
        <p className="mb-5 text-[13px] text-[var(--color-muted)]">{caseStudy.evaluation.failuresNote}</p>
        <div className="mb-11 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
          <FailurePie failures={caseStudy.evaluation.failures} />
          <FailureLegend failures={caseStudy.evaluation.failures} />
        </div>

        <p className="mb-11 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
          {caseStudy.evaluation.mitigations}
        </p>
      </CaseStudySection>

      <CaseStudySection
        id="whats-next"
        number="06 — What's Next"
        title="What's Next"
        icon={SECTION_ICONS.whatsNext}
        className="mb-20"
      >
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
