"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import type { CaseStudyHelport } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import Reveal from "./Reveal";

// Helport's local visual system for this case-study page.
const HELPORT_MINT = "#0AD48C";
const HELPORT_MEDIUM = "#00774D";
const HELPORT_DARK = "#00422B";
const HELPORT_PANEL_STYLE = {
  backgroundColor: `color-mix(in srgb, ${HELPORT_MINT} 7%, white)`,
  borderColor: `color-mix(in srgb, ${HELPORT_MINT} 26%, white)`,
};
const HELPORT_CARD_BORDER = `color-mix(in srgb, ${HELPORT_MINT} 22%, white)`;
const HELPORT_SOFT_SHADOW =
  "0px 1px 2px rgba(0,0,0,0.08), 0px 6px 18px rgba(0,0,0,0.06)";

// Small shared card shape for the pillar/feature/market blocks below — just
// a title + body on the site's card surface, reused four times at slightly
// different grid widths rather than four near-identical one-off blocks.
function TitleBodyCard({ title, body, index }: { title: string; body: string; index?: number }) {
  return (
    <div
      className="relative flex h-full flex-col rounded-xl border bg-white p-6"
      style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
    >
      {index !== undefined && (
        <div className="absolute -top-5 left-0 font-serif text-[28px] leading-none font-bold text-[#0AD48C]">
          #{index + 1}
        </div>
      )}
      <h3 className="mb-1.5 font-serif text-[17px] font-bold text-[var(--color-fg)]">{title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--color-fg)]">{body}</p>
    </div>
  );
}

// Problem-statement pillars only (not the shared TitleBodyCard used by
// Solution Overview) — center-aligned, with its illustration absolutely
// positioned and pulled up by 65% of its own height so it straddles the
// card's top edge instead of sitting fully inside or fully outside it.
function PillarCard({ pillar }: { pillar: CaseStudyHelport["painPoints"]["pillars"][number] }) {
  return (
    <div
      className="relative rounded-xl border bg-white p-6 pt-16 text-center"
      style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
    >
      {pillar.image && (
        <img
          src={pillar.image}
          alt=""
          aria-hidden
          className="absolute top-0 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-[40%] object-contain"
        />
      )}
      <h3 className="mb-1.5 font-serif text-[17px] font-bold text-[var(--color-fg)]">{pillar.title}</h3>
      <p className="text-[15px] leading-relaxed text-[var(--color-fg)]">{pillar.body}</p>
    </div>
  );
}

// One card split light/dark instead of two separate boxes — "what they pay"
// on a plain card surface, "what they get back" on the same dark fg/bg
// pairing the Service Blueprint's stage boxes already use elsewhere on this
// page. Each half leads with its own headline stat, then a receipt-style
// row list (label left, monospace value right, dotted dividers) — per
// Joyce's second pricing mockup.
function PricingHalf({
  data,
  dark,
}: {
  data: CaseStudyHelport["marketPlan"]["pricing"]["whatTheyPay" | "whatTheyGetBack"];
  dark?: boolean;
}) {
  return (
    <div className={`p-8 ${dark ? "bg-[#00422B]" : "bg-[var(--color-card)]"}`}>
      <div
        className={`mb-2 font-mono text-[11px] font-semibold tracking-wider uppercase ${
          dark ? "text-[var(--color-primary-light)]" : "text-[var(--color-muted)]"
        }`}
      >
        {data.title}
      </div>
      <div
        className={`font-serif text-[28px] leading-tight font-bold ${
          dark ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]"
        }`}
      >
        {data.headline}
      </div>
      <p
        className={`mt-1 mb-6 text-[14px] ${
          dark ? "text-[color-mix(in_srgb,var(--color-bg)_70%,transparent)]" : "text-[var(--color-muted)]"
        }`}
      >
        {data.headlineDetail}
      </p>
      <div
        className={`flex flex-col divide-y divide-dotted ${
          dark ? "divide-[color-mix(in_srgb,var(--color-bg)_20%,transparent)]" : "divide-[var(--color-border)]"
        }`}
      >
        {data.rows.map((row, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 py-3">
            <span className={`text-[14px] ${dark ? "text-[var(--color-bg)]" : "text-[var(--color-fg)]"}`}>
              {row.label}
            </span>
            <span
              className={`font-mono text-[13px] whitespace-nowrap ${
                "highlight" in row && row.highlight
                  ? "font-bold text-[var(--color-primary-light)]"
                  : dark
                    ? "text-[color-mix(in_srgb,var(--color-bg)_75%,transparent)]"
                    : "text-[var(--color-muted)]"
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingCard({ pricing }: { pricing: CaseStudyHelport["marketPlan"]["pricing"] }) {
  return (
    <Reveal variant="scale" className="mb-11 grid grid-cols-1 overflow-hidden rounded-xl sm:grid-cols-2">
      <PricingHalf data={pricing.whatTheyPay} />
      <PricingHalf data={pricing.whatTheyGetBack} dark />
    </Reveal>
  );
}

// Per Joyce's target-market mockup: no outer card/header band (the section's
// own "06 — Target Market" heading covers that) — just one box for the
// 01-02-03 phases, then two smaller boxes below, half-and-half, for Market
// Size / Why Now. No per-phase Value line anymore (removed per Joyce) — the
// eyebrow/heading still reserve fixed height (min-h) so bullets start at
// the same row across all three columns regardless of how many wrapped
// lines each phase's step label or heading happens to need.
function TargetMarketCard({ targetMarket }: { targetMarket: CaseStudyHelport["marketPlan"]["targetMarket"] }) {
  return (
    <div className="flex flex-col gap-6">
      <Reveal
        variant="scale"
        className="rounded-xl border p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.08),0px_6px_18px_rgba(0,0,0,0.06)] sm:p-8"
        style={HELPORT_PANEL_STYLE}
      >
        {/* Progress stepper — same grid-cols-3/gap as the phase columns
            below so each dot+bar lines up with its own column. #0AD48C is
            Helport's own brand mint, same reasoning as the flow diagram. */}
        <div className="mb-8 grid grid-cols-3 gap-6 sm:gap-8">
          {targetMarket.phases.map((phase, i) => (
            <div key={phase.step} className="flex items-center gap-2">
              <span
                className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                  i === 0 ? "border-[#00422B] bg-[#00422B]" : "border-[#0AD48C]/60 bg-white"
                }`}
              />
              <span
                className={`h-0.5 w-full rounded-full ${i === 0 ? "bg-[#00422B]" : "bg-[#0AD48C]/35"}`}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {targetMarket.phases.map((phase, i) => (
            <Reveal key={phase.step} delay={i * 0.08} className="flex h-full flex-col">
              {/* min-h reserves 2 lines on the eyebrow (phase 1's "Start
                  Here (already built)" runs noticeably longer than "Expand
                  To"/"Then") and on the heading (only phase 1's wraps to 2
                  lines at this column width) — without it, whichever
                  column wraps starts its bullets lower than its neighbors. */}
              <div className="mb-2 min-h-8 font-mono text-[11px] leading-snug font-bold tracking-wider text-[#00774D] uppercase">
                {phase.step} — {phase.stepLabel}
              </div>
              <h4 className="mb-3 min-h-13 font-serif text-[19px] leading-snug font-bold text-[var(--color-fg)]">
                {phase.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {phase.bullets.map((bullet, j) => (
                  <li key={j} className="flex gap-2 text-[14px] leading-relaxed text-[var(--color-fg)]">
                    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0AD48C]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[targetMarket.marketSize, targetMarket.whyNow].map((block, i) => (
          <Reveal
            key={block.label}
            delay={i * 0.08}
            variant={i === 0 ? "left" : "right"}
            className="rounded-xl border bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.06),0px_4px_14px_rgba(0,0,0,0.05)]"
            style={{ borderColor: HELPORT_CARD_BORDER }}
          >
            <div className="mb-2 font-mono text-[11px] font-bold tracking-wider text-[#00774D] uppercase">
              {block.label}
            </div>
            <ul className="flex flex-col gap-2">
              {block.bullets.map((bullet, j) => (
                <li key={j} className="flex gap-2 text-[14px] leading-relaxed text-[var(--color-fg)]">
                  <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0AD48C]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// Each iteration alternates sides — image left/text right for the first,
// image right/text left for the second — same left/right alternation Alio's
// prototypeDemo features use (sm:order-2 on whichever side needs to flip).
// Only order-2 needs setting: an un-ordered flex/grid item defaults to
// order 0, which already sorts before order-2 without needing its own
// override. Final-prototype demo clips render below the iterations, after
// Iteration 2 — stacked vertically (not a grid) with space reserved under
// each clip for Joyce's own written explanation, rather than side by side.
function DemoIterations({
  demoIterations,
}: {
  demoIterations: CaseStudyHelport["demoIterations"];
}) {
  return (
    <div className="mb-11 flex flex-col gap-16">
      <div className="flex flex-col gap-16">
        {demoIterations.iterations.map((iteration, i) => (
          <Reveal
            key={iteration.image}
            delay={i * 0.08}
            variant={i % 2 === 0 ? "left" : "right"}
            // Both iterations show their image in full rather than cropped to
            // fill the row (object-contain, not object-cover). Iteration 2's
            // column also gets more of the row's width — the text box next
            // to it goes narrower (2fr) instead of splitting evenly.
            className={`grid grid-cols-1 gap-6 sm:items-stretch ${
              i === 1 ? "sm:grid-cols-[2fr_3fr]" : "sm:grid-cols-2"
            }`}
          >
            <div className={i % 2 === 1 ? "sm:order-2" : ""}>
              <img
                src={iteration.image}
                alt={iteration.title}
                className="h-full w-full rounded-xl object-contain"
              />
            </div>
            {/* Same mint-bordered white card treatment as TitleBodyCard/
                PillarCard elsewhere on this page, per Joyce. */}
            <div
              className="flex flex-col rounded-xl border bg-white p-6"
              style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
            >
              {i !== 1 && (
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--color-muted)] uppercase">
                    {iteration.title}
                  </span>
                  {iteration.stage && (
                    <span className="rounded-full bg-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted)] uppercase">
                      {iteration.stage}
                    </span>
                  )}
                </div>
              )}
              {/* No fallback line when feedback is empty — the box just goes
                  straight to its Design Outcome below. Every iteration uses
                  the same header+body pattern (no bullets) — each label is
                  its own heading line, the detail its own paragraph below. */}
              {iteration.feedback.length > 0 && (
                <>
                  {iteration.feedbackLabel && (
                    <div className="mb-2 font-mono text-[11px] font-bold tracking-wider text-[var(--color-muted)] uppercase">
                      {iteration.feedbackLabel}
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    {iteration.feedback.map((item, j) => (
                      <div key={j}>
                        <h4 className="text-[14px] font-semibold text-[var(--color-fg)]">{item.label}</h4>
                        <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--color-muted)]">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {iteration.outcome && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: HELPORT_CARD_BORDER }}>
                  <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--color-muted)] uppercase">
                    Design Outcome
                  </span>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-fg)]">
                    {iteration.outcome.map((segment, k) =>
                      typeof segment === "string" ? (
                        <Fragment key={k}>{segment}</Fragment>
                      ) : (
                        <strong key={k} className="font-bold">
                          {segment.text}
                        </strong>
                      ),
                    )}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {demoIterations.videos.length > 0 && (
        <div className="flex flex-col gap-7">
          <span className="self-center text-center font-mono text-[11px] font-bold tracking-wider text-[var(--color-muted)] uppercase">
            Final Prototype
          </span>
          <div className="flex flex-col gap-20">
            {demoIterations.videos.map((video) => (
              <Reveal key={video.src} variant="scale" className="flex flex-col gap-5">
                <div className="mx-auto w-full max-w-[900px] text-center">
                  <div className="font-mono text-[12px] font-bold tracking-wider text-[#0AD48C] uppercase">
                    {video.title}
                  </div>
                  <h3 className="mt-2 font-serif text-[22px] leading-tight font-bold whitespace-nowrap text-[var(--color-fg)] sm:text-[30px] lg:text-[34px]">
                    {video.subtitle}
                  </h3>
                </div>
                <video
                  src={video.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  // No controls — these are silent looping demo clips, not a
                  // player. controlsList/disablePictureInPicture just belt-
                  // and-suspenders against the browser offering its own UI.
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  className="mx-auto w-full max-w-2xl rounded-xl border border-[var(--color-border)] object-cover"
                />
                <p className="mx-auto w-full max-w-2xl text-[16px] leading-relaxed text-[var(--color-fg)]">
                  {video.explanation}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Per Joyce's persona-card mockup: a colored header band (primary-green for
// the frontline agent, the site's dark fg tone for the student — same
// dark treatment the Service Blueprint's stage boxes already use) holding
// a headshot circle + name/role, then quote, a label/value meta table,
// and bold-lead-in objectives/frustrations lists.
function PersonaHeadshot({ name, image }: { name: string; image?: string }) {
  if (image) {
    return <img src={image} alt={name} className="h-16 w-16 shrink-0 rounded-full object-cover" />;
  }
  // Diagonal-stripe placeholder, same idiom as PlaceholderBlock elsewhere
  // on the site, just circular to fit this slot.
  return (
    <div
      aria-hidden
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.14) 5px, transparent 5px, transparent 10px)",
      }}
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-center font-mono text-[8px] leading-tight text-white/70 uppercase"
    >
      Headshot
    </div>
  );
}

function PersonaCard({
  persona,
  delay,
  tone,
}: {
  persona: CaseStudyHelport["personas"][number];
  delay: number;
  tone: "primary" | "dark";
}) {
  return (
    // flex flex-col (no h-full) — the parent grid's own align-items:stretch
    // (default, see the personas section below) already gives both cards
    // the taller sibling's height; an explicit h-full here would just fight
    // that the same way it did on Target Market's phase columns. flex-1 on
    // the body below is what actually uses the extra stretched height.
    <Reveal delay={delay} className="flex flex-col overflow-hidden rounded-xl bg-[var(--color-card)]">
      {/* Meta (Age/Sex/Experience-or-Education/Location) moved into the
          banner, right of the avatar+name. Grid (not stacked flex rows) so
          every label right-aligns to the same column regardless of length
          ("Age" vs "Experience") and every value starts flush after it —
          flex rows were sizing each row's gap independently, which read as
          unaligned. sm:min-h-32 reserves the same banner height on both
          cards regardless of whose meta list happens to wrap a line (e.g.
          Jasmine's longer location), so the banner/body boundary lines up
          across the two cards instead of drifting with content length. */}
      <div
        className={`flex flex-col gap-4 px-6 py-6 sm:min-h-32 sm:flex-row sm:items-center sm:justify-between ${
          tone === "primary" ? "bg-[var(--color-primary)]" : "bg-[var(--color-fg)]"
        }`}
      >
        <div className="flex items-center gap-4">
          <PersonaHeadshot name={persona.name} image={persona.image} />
          <div>
            <h3 className="font-serif text-[26px] font-bold text-white">{persona.name}</h3>
            <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/85 uppercase">
              {persona.role}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[auto_auto] items-baseline gap-x-2 gap-y-1 sm:justify-end">
          {persona.meta.map((row) => (
            <Fragment key={row.label}>
              <span className="text-right font-mono text-[10px] font-semibold tracking-wider text-white/60 uppercase">
                {row.label}
              </span>
              <span className="text-[12px] text-white/95">{row.value}</span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        <p className="mb-5 border-b border-[var(--color-border)] pb-5 font-serif text-[17px] leading-relaxed text-[var(--color-fg)] italic">
          “{persona.quote}”
        </p>

        <div className="mb-5">
          <div className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            Objectives
          </div>
          <ul className="flex flex-col gap-2">
            {persona.objectives.map((item, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-[var(--color-muted)]">
                • <span className="font-semibold text-[var(--color-fg)]">{item.label}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--color-border)] pt-5">
          <div className="mb-2 font-mono text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
            Frustrations
          </div>
          <ul className="flex flex-col gap-2">
            {persona.frustrations.map((item, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-[var(--color-muted)]">
                • <span className="font-semibold text-[var(--color-fg)]">{item.label}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

// Human call stages on top, the co-pilot layer below, paired 1:1 by column
// with a dotted connector and a small caption describing what that system
// does during the step.
function DemoFlowDiagram({
  coPilotSystems,
  flow,
}: {
  coPilotSystems: CaseStudyHelport["demo"]["coPilotSystems"];
  flow: CaseStudyHelport["demo"]["flow"];
}) {
  return (
    <Reveal
      variant="soft"
      className="mb-6 rounded-xl border p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.08),0px_6px_18px_rgba(0,0,0,0.06)] sm:p-8"
      style={{
        ...HELPORT_PANEL_STYLE,
      }}
    >
      {/* Mobile-only compact legend — at this width there's no room for the
          side gutter the sm+ layout uses below, so the two layers are named
          once up top instead. */}
      <div className="mb-5 flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase sm:hidden">
        <span
          className="rounded-2xl border bg-white px-3 py-1.5 text-center leading-tight text-[var(--color-fg)]"
          style={{ borderColor: HELPORT_CARD_BORDER }}
        >
          Human
          <br />
          Layer
        </span>
        <span
          className="rounded-2xl border px-3 py-1.5 text-center leading-tight"
          style={{
            backgroundColor: `color-mix(in srgb, ${HELPORT_MINT} 16%, white)`,
            borderColor: `color-mix(in srgb, ${HELPORT_MINT} 42%, white)`,
            color: HELPORT_DARK,
          }}
        >
          Co-Pilot
          <br />
          Layer
        </span>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Corner labels for the sm+ layout — each vertically centered on
            its own band and colored to match that band's own boxes (white/
            bordered for Human, mint for Co-Pilot) instead of a shared
            legend. Two lines each (word / "Layer") instead of one nowrap
            line. The min-h-[72px] zones and h-5 spacer below mirror the
            stage/co-pilot box height and connector height so each label
            centers against the band it names. */}
        <div className="hidden shrink-0 flex-col gap-2 sm:flex">
          <div className="flex min-h-[72px] items-center">
            <span
              className="rounded-2xl border bg-white px-3 py-2 text-center text-[10px] leading-tight font-bold tracking-wider text-[var(--color-fg)] uppercase"
              style={{ borderColor: HELPORT_CARD_BORDER }}
            >
              Human
              <br />
              Layer
            </span>
          </div>
          <div className="h-5" aria-hidden />
          <div className="flex min-h-[72px] items-center">
            <span
              className="rounded-2xl border px-3 py-2 text-center text-[10px] leading-tight font-bold tracking-wider uppercase"
              style={{
                backgroundColor: `color-mix(in srgb, ${HELPORT_MINT} 16%, white)`,
                borderColor: `color-mix(in srgb, ${HELPORT_MINT} 42%, white)`,
                color: HELPORT_DARK,
              }}
            >
              Co-Pilot
              <br />
              Layer
            </span>
          </div>
        </div>

        {/* Same 1fr/auto interleaved grid Drunky's pipeline stages use for
            arrow-connected boxes — arrows only from sm up, phone width can't
            fit 4 stages plus arrows without wrapping ugly. The arrow glyph
            sits at pt-6 (not vertically centered) so it lines up with the
            stage row specifically, not the middle of the whole 4-item stack
            each column now holds (stage → connector → co-pilot → caption). */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:flex-1 sm:items-stretch">
          {flow.map((step, i) => {
            const system = coPilotSystems[i];
            return (
              <Fragment key={step.title}>
                <div className="flex h-full flex-col items-center gap-2">
                  <div
                    className="flex min-h-[72px] w-full items-center justify-center rounded-xl border bg-white px-4 py-4 text-center text-[14px] leading-snug font-bold text-[var(--color-fg)] shadow-[0px_1px_2px_rgba(0,0,0,0.06),0px_4px_14px_rgba(0,0,0,0.05)]"
                    style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: "0px 1px 2px rgba(0,0,0,0.06), 0px 4px 14px rgba(0,0,0,0.05)" }}
                  >
                    {step.title}
                  </div>
                  {system && (
                    <>
                      <div
                        className="h-5 w-1 rounded-full"
                        style={{
                          backgroundImage: `radial-gradient(circle, ${HELPORT_MINT} 1.5px, transparent 1.8px)`,
                          backgroundSize: "4px 8px",
                          backgroundRepeat: "repeat-y",
                        }}
                      />
                      <div
                        className="flex min-h-[72px] w-full items-center justify-center rounded-xl border px-4 py-3 text-center text-[14px] leading-snug font-bold"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${HELPORT_MINT} 16%, white)`,
                          borderColor: `color-mix(in srgb, ${HELPORT_MINT} 42%, white)`,
                          color: HELPORT_DARK,
                        }}
                      >
                        {system.label}
                      </div>
                      <div className="w-full rounded-md bg-white/70 p-2.5 text-center text-[13px] leading-snug text-[var(--color-fg)]">
                        {system.caption}
                      </div>
                    </>
                  )}
                </div>
                {i < flow.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden items-start justify-center pt-6 text-[18px] font-bold text-[#00774D] sm:flex"
                  >
                    →
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

// Use Case / Pros / Cons grid, one column per real competitor — per Joyce's
// market-research-audit template. The 4 logo PNGs are opaque (not
// transparent), so each gets its own white box rather than sitting flush
// against the section's card/tinted backgrounds.
function CompetitorAuditGrid({
  competitors,
}: {
  competitors: CaseStudyHelport["competitive"]["competitors"];
}) {
  const gridTemplateColumns = `minmax(46px, 64px) repeat(${competitors.length}, minmax(0, 1fr))`;
  const consBg = `color-mix(in srgb, ${HELPORT_MINT} 14%, white)`;
  const bodyRows = [
    {
      label: "Use Case",
      type: "text" as const,
      getItems: (competitor: (typeof competitors)[number]) => [competitor.useCase],
    },
    {
      label: "Pros +",
      type: "list" as const,
      getItems: (competitor: (typeof competitors)[number]) => competitor.pros,
    },
    {
      label: "Cons −",
      type: "list" as const,
      tone: "cons" as const,
      getItems: (competitor: (typeof competitors)[number]) => competitor.cons,
    },
  ];

  return (
    // No overflow-x-auto/min-w — a fixed static grid that shrinks to fit.
    // minmax(0, 1fr) on competitor columns keeps long text from forcing
    // the columns wider than the container; the label column stays narrow
    // so most of the width goes to the actual analysis.
    <div className="flex h-full flex-col gap-1.5">
      <div
        className="grid min-h-16 gap-x-1.5 overflow-hidden rounded-xl bg-[var(--color-card)]"
        style={{
          gridTemplateColumns,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div aria-hidden />
        {competitors.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-center border-l border-white/80 p-2"
          >
            <div className="flex h-11 w-full items-center justify-center rounded-md bg-white p-1.5">
              <img src={c.logo} alt={c.name} className="max-h-7 max-w-full object-contain" />
            </div>
          </div>
        ))}
      </div>

      {bodyRows.map((row, rowIndex) => (
        <div
          key={row.label}
          className="grid gap-x-1.5"
          style={{ gridTemplateColumns }}
        >
          <div
            className="flex items-start rounded-xl bg-[var(--color-card)] px-2 py-4 text-[12px] leading-tight font-bold text-[#00422B] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]"
          >
            {row.label}
          </div>
          {competitors.map((c, competitorIndex) => {
            const items = row.getItems(c);
            const isCons = row.tone === "cons";
            return (
              <div
                key={c.name}
                className={`min-w-0 px-2.5 py-4 text-[12.5px] leading-snug ${
                  competitorIndex === 0 ? "" : "border-l border-dashed border-[var(--color-border)]"
                } ${
                  rowIndex === bodyRows.length - 1
                    ? "rounded-xl"
                    : "border-b border-dashed border-[var(--color-border)]"
                }`}
                style={isCons ? { backgroundColor: consBg } : undefined}
              >
                {row.type === "text" ? (
                  <p className="text-[var(--color-fg)]">{items[0]}</p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className={`flex gap-2 ${
                          isCons
                            ? "font-bold text-[#00422B]"
                            : "text-[var(--color-fg)]"
                        }`}
                      >
                        <span aria-hidden className="shrink-0">
                          •
                        </span>
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// A 2x2 positioning chart — axis choice and point coordinates are my own
// reading of the pros/cons above, not sourced external research (see the
// type comment in data/caseStudies.ts). Points are placed by percentage
// (x/y: 0-100) rather than pixels, so the chart stays proportional at any
// width.
function PerceptualMap({
  perceptualMap,
}: {
  perceptualMap: CaseStudyHelport["competitive"]["perceptualMap"];
}) {
  const { title, xAxis, yAxis, points } = perceptualMap;
  return (
    <div
      className="flex h-full flex-col rounded-xl border bg-[var(--color-card)] p-4"
      style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
    >
      <h4 className="mb-4 text-center font-serif text-[17px] font-bold text-[var(--color-fg)]">
        {title}
      </h4>
      <div className="relative min-h-[300px] w-full flex-1 overflow-hidden">
        <div className="absolute inset-x-4 top-1/2 h-px bg-[#0AD48C]/45" />
        <div
          aria-hidden
          className="absolute top-1/2 right-4 h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[8px] border-y-transparent border-l-[#0AD48C]/70"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-4 h-0 w-0 -translate-y-1/2 border-y-[5px] border-r-[8px] border-y-transparent border-r-[#0AD48C]/70"
        />
        <div className="absolute inset-y-4 left-1/2 w-px bg-[#0AD48C]/45" />
        <div
          aria-hidden
          className="absolute top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[8px] border-x-transparent border-b-[#0AD48C]/70"
        />
        <div
          aria-hidden
          className="absolute bottom-4 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[8px] border-x-transparent border-t-[#0AD48C]/70"
        />
        <span className="absolute top-0 left-1/2 max-w-[12rem] -translate-x-1/2 text-center text-[11px] leading-tight font-semibold text-[var(--color-muted)]">
          {yAxis[1]}
        </span>
        <span className="absolute bottom-0 left-1/2 max-w-none -translate-x-1/2 text-center text-[11px] leading-tight font-semibold whitespace-nowrap text-[var(--color-muted)]">
          {yAxis[0]}
        </span>
        <span className="absolute top-[calc(50%+0.5rem)] left-4 w-[4.25rem] text-left text-[11px] leading-tight font-semibold text-[var(--color-muted)]">
          {xAxis[0]}
        </span>
        <span className="absolute top-[calc(50%+0.5rem)] right-1 w-[5.75rem] text-right text-[11px] leading-tight font-semibold text-[var(--color-muted)]">
          {xAxis[1]}
        </span>

        {points.map((point) => (
          <div
            key={point.name}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{
              left: `clamp(2.5rem, ${point.x}%, calc(100% - 2.5rem))`,
              top: `clamp(4rem, ${100 - point.y}%, calc(100% - 4rem))`,
            }}
          >
            {point.isHelport ? (
              <div
                className="flex h-11 w-16 items-center justify-center rounded-md border bg-white p-1.5 shadow-sm"
                style={{ borderColor: HELPORT_MINT }}
              >
                <img src={point.logo} alt={point.name} className="max-h-8 max-w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-9 w-16 items-center justify-center rounded-md bg-white p-1 shadow-sm">
                <img src={point.logo} alt={point.name} className="max-h-6 max-w-full object-contain" />
              </div>
            )}
            <span className="text-[10px] font-semibold whitespace-nowrap text-[var(--color-muted)]">
              {point.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitiveConclusionCallout({ conclusion }: { conclusion: string }) {
  const lead = "Helport AI fills the gap";
  const focus = "real-time agent guidance, compliance support, and workflow automation";
  const [beforeFocus, afterFocus = ""] = conclusion.split(focus);

  return (
    <div className="mb-11 flex flex-col items-center">
      <div className="flex h-20 flex-col items-center" aria-hidden>
        <div
          className="h-11 w-1 rounded-full"
          style={{
            backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${HELPORT_MINT} 18%, white), ${HELPORT_MINT})`,
            WebkitMaskImage: "radial-gradient(circle, black 1.5px, transparent 1.8px)",
            WebkitMaskSize: "4px 8px",
            WebkitMaskRepeat: "repeat-y",
            maskImage: "radial-gradient(circle, black 1.5px, transparent 1.8px)",
            maskSize: "4px 8px",
            maskRepeat: "repeat-y",
          }}
        />
        <div className="h-0 w-0 border-x-[6px] border-t-[9px] border-x-transparent border-t-[#0AD48C]" />
      </div>
      <div
        className="w-full rounded-xl border p-6 text-center sm:p-7"
        style={{
          backgroundImage: "linear-gradient(135deg, rgb(103 209 144 / 0.72), rgb(92 188 180 / 0.72))",
          borderColor: "rgb(92 188 180 / 0.5)",
        }}
      >
        <p className="mx-auto max-w-5xl text-[18px] leading-snug font-normal text-white">
          <strong className="font-bold">{lead}</strong>
          {beforeFocus.replace(lead, "")}
          <strong className="font-bold">{focus}</strong>
          {afterFocus}
        </p>
      </div>
    </div>
  );
}

export default function HelportCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudyHelport;
  nextProject: Project;
}) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "research", label: "Research" },
    { id: "pain-points", label: "Pain Points" },
    { id: "problem", label: "Problem Statement" },
    { id: "solution", label: "Solutions" },
    { id: "personas", label: "User Personas" },
    { id: "target-market", label: "Target Market" },
    { id: "demo", label: "Service Blueprint" },
    { id: "demo-iterations", label: "Design Process" },
    { id: "competitive", label: "Competitor Analysis" },
    { id: "pricing", label: "Pricing Model" },
    { id: "outcomes", label: "Quantitative Outcomes" },
    ...caseStudy.sections.map((section) => ({ id: section.id, label: section.title })),
  ];

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={tocItems} nextProject={nextProject}>
      <CaseStudySection id="research" number="01 — Research" title="Why We Built This">
        <div className="mb-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
          {caseStudy.research.stats.map((stat, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              variant="scale"
              className="flex h-full flex-col rounded-xl border bg-white p-6"
              style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
            >
              <div className="font-serif text-[2.25rem] leading-tight font-bold text-[#00774D]">
                {stat.value}
              </div>
              <p className="mt-1.5 text-[16px] leading-snug text-[var(--color-fg)]">{stat.finding}</p>
            </Reveal>
          ))}
        </div>
        <p className="mb-8 text-[16px] leading-relaxed text-[var(--color-fg)]">{caseStudy.research.intro}</p>
        <div
          className="mb-11 rounded-xl border p-8"
          style={HELPORT_PANEL_STYLE}
        >
          <div className="mb-2 font-mono text-xs font-bold tracking-wider text-[#00774D] uppercase">
            {caseStudy.research.gapLabel}
          </div>
          <p className="text-[16px] leading-relaxed font-normal text-[var(--color-fg)]">
            {caseStudy.research.gap}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="pain-points" number="02 — Pain Points" title="Three ways it breaks down">
        {/* mt-14 (was mt-6) — the illustrations overlap upward into this gap
            by ~38px (translateY(-40%) of their own 96px height, see
            PillarCard), so mt-6 left almost no visible breathing room
            between the heading and the icons, reading as crowded. */}
        <div className="mt-14 mb-11 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {caseStudy.painPoints.pillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 0.08} variant="scale">
              <PillarCard pillar={pillar} />
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="problem" number="03 — Problem Statement" title="The problem">
        {/* Same pull-quote treatment as Alio/Nest's problem statement — a
            single scoped user/need/insight sentence, not another pillar
            grid, so it reads as the one problem the product targets rather
            than a fourth pain point. Quote mark sized up (was 3rem) and the
            load-bearing phrases bolded in Helport's own teal so the
            statement doesn't just blend into the surrounding body copy. */}
        <div className="relative mb-16 w-full pl-8 sm:mb-20 sm:pl-12">
          <div className="absolute top-0 left-0 font-serif text-[5.5rem] leading-none text-[var(--color-border)]">
            “
          </div>
          <p className="pt-7 font-serif text-[22px] leading-relaxed text-[var(--color-fg)]">
            {caseStudy.problemStatement.map((segment, i) =>
              typeof segment === "string" ? (
                <Fragment key={i}>{segment}</Fragment>
              ) : (
                <strong key={i} className="font-bold text-[#00B675]">
                  {segment.text}
                </strong>
              ),
            )}
          </p>
        </div>
      </CaseStudySection>

      <CaseStudySection id="solution" number="04 — Solutions" title="Built to fix it">
        <p className="mb-8 text-[18px] leading-relaxed font-semibold text-[var(--color-fg)]">
          {caseStudy.solution.intro}
        </p>
        <div className="mt-3 mb-11 grid grid-cols-1 items-stretch gap-x-6 gap-y-10 sm:grid-cols-2">
          {caseStudy.solution.features.map((feature, i) => (
            <Reveal key={i} delay={i * 0.08} variant={i % 2 === 0 ? "left" : "right"} className="h-full">
              <TitleBodyCard title={feature.title} body={feature.body} index={i} />
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="personas" number="05 — User Personas" title="Both sides of the call">
        {/* Coded persona cards — commented out for now to compare against
            the two raw photos directly (below). Uncomment to bring back.
        <div className="mb-11 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {caseStudy.personas.map((persona, i) => (
            <PersonaCard
              key={persona.name}
              persona={persona}
              delay={i * 0.1}
              tone={i === 0 ? "primary" : "dark"}
            />
          ))}
        </div>
        */}
        <div className="mb-11 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {caseStudy.personas.map((persona, i) => (
            <Reveal key={persona.name} delay={i * 0.1} variant={i === 0 ? "left" : "right"}>
              <img
                src={persona.image}
                alt={persona.name}
                className="w-full rounded-xl object-cover"
              />
            </Reveal>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection id="target-market" number="06 — Target Market" title="Who we're built for">
        <div className="mb-11">
          <TargetMarketCard targetMarket={caseStudy.marketPlan.targetMarket} />
        </div>
      </CaseStudySection>

      <CaseStudySection id="demo" number="07 — Service Blueprint" title="Inside a call">
        <DemoFlowDiagram
          coPilotSystems={caseStudy.demo.coPilotSystems}
          flow={caseStudy.demo.flow}
        />
        <p className="mb-11 text-[16px] leading-relaxed text-[var(--color-fg)]">{caseStudy.demo.summary}</p>
      </CaseStudySection>

      <CaseStudySection id="demo-iterations" number="08 — Design Process" title="Design Process">
        <DemoIterations demoIterations={caseStudy.demoIterations} />
      </CaseStudySection>

      <CaseStudySection id="competitive" number="09 — Competitor Analysis" title="Where Helport fits">
        <div className="mb-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.9fr_0.85fr]">
          <Reveal variant="left" className="h-full">
            <CompetitorAuditGrid competitors={caseStudy.competitive.competitors} />
          </Reveal>
          <Reveal variant="right" className="h-full">
            <PerceptualMap perceptualMap={caseStudy.competitive.perceptualMap} />
          </Reveal>
        </div>
        <CompetitiveConclusionCallout conclusion={caseStudy.competitive.conclusion} />
      </CaseStudySection>

      <CaseStudySection id="pricing" number="10 — Pricing Model" title="Who pays, and how">
        <PricingCard pricing={caseStudy.marketPlan.pricing} />
      </CaseStudySection>

      <CaseStudySection id="outcomes" number="11 — Quantitative Outcomes" title="The numbers">
        <div className="mb-11 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {caseStudy.outcomes.impact.map((stat, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              variant="scale"
              className="rounded-xl border bg-white p-6"
              style={{ borderColor: HELPORT_CARD_BORDER, boxShadow: HELPORT_SOFT_SHADOW }}
            >
              <div className="font-serif text-[1.75rem] leading-tight font-bold text-[#00774D]">
                {stat.value}
              </div>
              <p className="mt-1 text-[14px] leading-snug font-semibold text-[var(--color-fg)]">{stat.label}</p>
              <p className="mt-1.5 text-[14px] leading-snug text-[var(--color-fg)]">{stat.detail}</p>
            </Reveal>
          ))}
        </div>
      </CaseStudySection>
    </CaseStudyShell>
  );
}
