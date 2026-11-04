"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { CaseStudyHelport } from "@/data/caseStudies";
import Reveal from "./Reveal";
import {
  BoldPhrases,
  inView,
  ROLL_LINE,
  RollingNumber,
  useHoverReplay,
} from "./researchMotion";

type Research = CaseStudyHelport["research"];
type Stat = Research["stats"][number];

// Helport's greens (as in HelportCaseStudyPage). Cards are white in both site
// themes, like the rest of Helport's cards, so text colors are explicit.
const MINT = "#0AD48C";
const MEDIUM = "#00774D";
const DARK = "#00422B";
const INK = "#1C2420";
const CARD_BORDER = `color-mix(in srgb, ${MINT} 22%, white)`;
const SOFT_SHADOW =
  "0px 1px 2px rgba(0,0,0,0.06), 0px 6px 18px rgba(0,0,0,0.05)";

// Helport's research: the situation in one line, the three numbers, and the
// market's readiness for AI (its headline number rolls on hover).
export default function HelportResearch({ research }: { research: Research }) {
  return (
    <>
      <Reveal variant="soft">
        <p className="mb-8 text-[19px] leading-relaxed text-[var(--color-fg)]">
          <BoldPhrases
            text={research.intro}
            phrases={research.introBold}
            className="text-[#00774D]"
          />
        </p>
      </Reveal>
      <div className="mb-8 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
        {research.stats.map((stat, i) => (
          <Reveal
            key={stat.value}
            delay={i * 0.08}
            variant="scale"
            className="h-full"
          >
            <StatCard stat={stat} />
          </Reveal>
        ))}
      </div>
      <Readiness label={research.gapLabel} gap={research.gap} />
    </>
  );
}

// The original stat card: the number and what it means
function StatCard({ stat }: { stat: Stat }) {
  return (
    <div
      className="flex h-full flex-col rounded-xl border bg-white p-6"
      style={{ borderColor: CARD_BORDER, boxShadow: SOFT_SHADOW }}
    >
      <div
        className="font-serif text-[2.25rem] leading-tight font-bold"
        style={{ color: MEDIUM }}
      >
        {stat.value}
      </div>
      <p className="mt-1.5 text-[16px] leading-snug" style={{ color: INK }}>
        {stat.finding}
      </p>
    </div>
  );
}

function HeadlineNumber({
  value,
  caption,
}: {
  value: string;
  caption: string;
}) {
  const { replays, handlers } = useHoverReplay();
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center text-center"
      {...handlers}
    >
      <div
        className="font-serif text-[3.25rem] font-bold"
        style={{ color: DARK, lineHeight: ROLL_LINE }}
      >
        <RollingNumber value={value} rolls={replays} />
      </div>
      <p
        className="mt-2 text-[15px] leading-snug whitespace-nowrap"
        style={{ color: INK }}
      >
        {caption}
      </p>
    </div>
  );
}

// The market's readiness: the headline number on the left, the two signals
// on the right
function Readiness({ label, gap }: { label: string; gap: Research["gap"] }) {
  return (
    <div className="mb-11">
      {/* The label above the box, like the page's other small headings */}
      <div
        className="mb-3 font-mono text-xs font-bold tracking-wider uppercase"
        style={{ color: MEDIUM }}
      >
        {label}
      </div>
      <Reveal
        variant="soft"
        className="grid grid-cols-1 gap-6 rounded-xl border p-8 lg:grid-cols-[1fr_1.6fr] lg:gap-10"
        style={{
          background: `color-mix(in srgb, ${MINT} 9%, white)`,
          borderColor: CARD_BORDER,
        }}
      >
        {/* The headline number, centered in its half both ways; hovering it
          rolls the digits */}
        <div className="flex flex-col">
          <HeadlineNumber value={gap.value} caption={gap.valueLabel} />
        </div>
        <div>
          <p className="mb-4 text-[15px] font-semibold" style={{ color: INK }}>
            {gap.signalsLead}
          </p>
          <ul className="flex flex-col gap-3">
            {gap.signals.map((signal, i) => (
              <motion.li
                key={signal.text}
                className="flex items-start gap-4 rounded-lg bg-white p-4"
                style={{ boxShadow: SOFT_SHADOW }}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={inView}
                transition={{
                  duration: 0.45,
                  delay: 0.2 + i * 0.15,
                  ease: "easeOut",
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${MINT} 18%, white)`,
                  }}
                >
                  <Building2
                    aria-hidden
                    className="h-5 w-5"
                    color={MEDIUM}
                    strokeWidth={2}
                  />
                </span>
                <span
                  className="pt-2 text-[15px] leading-snug"
                  style={{ color: INK }}
                >
                  <BoldPhrases
                    text={signal.text}
                    phrases={signal.bold}
                    className="text-[#00774D]"
                  />
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
