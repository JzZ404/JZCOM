"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { CaseStudy, CaseStudyResearchStat } from "@/data/caseStudies";
import Reveal from "./Reveal";

type Research = CaseStudy["research"];

// The HMW sticky notes' palette, as tints that sit on either site theme
const LIME_TINT = "rgba(141, 198, 63, 0.16)";
const LIME_INK = "#5E9A1F";
const MINT_TINT = "rgba(126, 238, 196, 0.28)";
const MINT_INK = "#1F7A5A";
const PERIWINKLE_TINT = "rgba(140, 147, 240, 0.22)";
const inView = { once: true, margin: "-80px" } as const;

// Nest's research, told in four beats, each with its own form: what we did
// (the counts in the intro count up), what we found (percentages as filling
// rings), what people said (speech
// bubbles, like the interviews they came from), and what we bet on (the
// hypothesis as If → Then).
export default function NestResearch({ research }: { research: Research }) {
  return (
    <>
      <IntroWithCounts text={research.intro} />
      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {research.stats.map((stat, i) => (
          <Reveal key={i} delay={i * 0.08} variant="scale" className="h-full">
            <FindingCard stat={stat} />
          </Reveal>
        ))}
      </div>
      <Voices title={research.quotesTitle} quotes={research.quotes} />
      <Hypothesis hypothesis={research.hypothesis} />
    </>
  );
}

// Counts a number up from 0 the first time it scrolls into view. The final
// value renders on the server, so it reads correctly without JavaScript;
// reduced motion skips the count.
function CountUp({ to, suffix = "", replay = false }: { to: number; suffix?: string; replay?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, inView);
  // A hover replay starts right away (the card is already on screen)
  const go = seen || replay;
  useEffect(() => {
    if (!go) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (ref.current) ref.current.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        if (ref.current) ref.current.textContent = `${Math.round(n)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [go, to, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {replay ? 0 : to}
      {suffix}
    </span>
  );
}

// The intro sentence with its numbers set large and counting up
function IntroWithCounts({ text }: { text: string }) {
  return (
    <p className="mb-9 text-[17px] leading-relaxed text-[var(--color-muted)]">
      {text.split(/(\d+)/).map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className="mx-0.5 font-serif text-[1.75em] leading-none font-bold text-[var(--color-primary)]">
            <CountUp to={Number(part)} />
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}

// A finding card. Hovering replays its ring and count-up (by remounting them
// under a new key) when it has one.
function FindingCard({ stat }: { stat: CaseStudyResearchStat }) {
  const [replays, setReplays] = useState(0);
  // Replaying swaps the content under the cursor, which makes React report
  // the mouse entering again — so each hover only counts once, until it
  // actually leaves.
  const hovering = useRef(false);
  return (
    <div
      className="flex h-full flex-col justify-center rounded-xl bg-[var(--color-card)] p-6"
      onMouseEnter={
        stat.percent !== undefined
          ? () => {
              if (hovering.current) return;
              hovering.current = true;
              setReplays((n) => n + 1);
            }
          : undefined
      }
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      <Finding key={replays} stat={stat} replay={replays > 0} />
    </div>
  );
}

// The finding sentence with its `bold` phrases emphasized
function FindingText({ stat }: { stat: CaseStudyResearchStat }) {
  const phrases = stat.bold ?? [];
  const parts = phrases.length
    ? stat.finding.split(new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`))
    : [stat.finding];
  return (
    <>
      {parts.map((part, i) =>
        phrases.includes(part) ? (
          <strong key={i} className="font-semibold text-[var(--color-primary)]">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Finding({ stat, replay }: { stat: CaseStudyResearchStat; replay: boolean }) {
  if (stat.percent !== undefined) {
    return (
      <div className="flex items-center gap-5">
        <Ring percent={stat.percent} replay={replay} />
        <p className="text-[15px] leading-snug text-[var(--color-muted)]">
          <FindingText stat={stat} />
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="font-serif text-[1.4rem] leading-tight font-bold text-[var(--color-primary)]">{stat.value}</div>
      <p className="mt-1.5 text-[16px] leading-snug text-[var(--color-muted)]">{stat.finding}</p>
    </>
  );
}

// A ring that fills to the percentage while the number counts up inside it
function Ring({ percent, replay }: { percent: number; replay: boolean }) {
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="10" style={{ stroke: "var(--color-border)" }} />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          style={{ stroke: "var(--color-primary)" }}
          initial={{ pathLength: 0 }}
          // First time: fills on scroll-in; a hover replay fills right away
          {...(replay ? { animate: { pathLength: percent / 100 } } : { whileInView: { pathLength: percent / 100 }, viewport: inView })}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[1.6rem] font-bold text-[var(--color-primary)]">
        <CountUp to={percent} suffix="%" replay={replay} />
      </span>
    </div>
  );
}

// The quotes as interview speech bubbles, alternating sides like a
// conversation and appearing one after the other
function Voices({ title, quotes }: { title: string; quotes: string[] }) {
  return (
    <div className="mb-12">
      <div className="mb-5 font-mono text-[12px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
        {title}
      </div>
      <div className="flex flex-col gap-4">
        {quotes.map((quote, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <motion.figure
              key={i}
              className={`relative max-w-[min(34rem,88%)] rounded-3xl px-6 py-5 ${
                fromLeft ? "self-start rounded-bl-md" : "self-end rounded-br-md"
              }`}
              style={{
                background: fromLeft ? MINT_TINT : PERIWINKLE_TINT,
                transformOrigin: fromLeft ? "0% 100%" : "100% 100%",
              }}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={inView}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 + i * 0.35 }}
            >
              <blockquote className="font-serif text-[18px] leading-relaxed text-[var(--color-fg)] italic">
                “{quote}”
              </blockquote>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}

// If → Then, with the arrow drawing across once both sides are in
function Hypothesis({ hypothesis }: { hypothesis: Research["hypothesis"] }) {
  const sides = [
    { word: "If", text: hypothesis.if, tint: LIME_TINT, ink: LIME_INK },
    { word: "Then", text: hypothesis.then, tint: MINT_TINT, ink: MINT_INK },
  ];
  return (
    <div className="mb-11">
      <div className="mb-4 font-mono text-[12px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
        {hypothesis.label}
      </div>
      <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        {sides.map((side, i) => (
          <Fragment key={side.word}>
            {i === 1 && (
              <motion.div
                aria-hidden
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={inView}
                transition={{ duration: 0.35, delay: 0.45 }}
              >
                <ArrowRight className="hidden h-6 w-6 text-[var(--color-primary)] lg:block" strokeWidth={2.25} />
                <ArrowDown className="h-6 w-6 text-[var(--color-primary)] lg:hidden" strokeWidth={2.25} />
              </motion.div>
            )}
            <Reveal variant={i === 0 ? "left" : "right"} delay={i * 0.5} className="rounded-2xl p-7" style={{ background: side.tint }}>
              <div className="mb-2 font-serif text-[2rem] leading-none font-bold" style={{ color: side.ink }}>
                {side.word}
              </div>
              <p className="text-[16.5px] leading-relaxed text-[var(--color-fg)]">{side.text}</p>
            </Reveal>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
