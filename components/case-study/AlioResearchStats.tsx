"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { ROLL_LINE as LINE, RollingDigit } from "./researchMotion";

// The site's own card colors, with the numbers in Alio's indigo
const INDIGO = "#4F46E5";

type Stat = { value: string; finding: string };

// The research numbers: a big figure and what it means. Hovering a card rolls
// its digits like a slot machine before they settle back on the value — for
// figures with more than one digit; a lone digit ("#1") gives a quick
// attention-wiggle instead.
export default function AlioResearchStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <Reveal key={stat.value} delay={i * 0.08} variant="scale">
          <StatCard stat={stat} />
        </Reveal>
      ))}
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  // Bumped on each hover; every digit re-runs its roll when it changes
  const [rolls, setRolls] = useState(0);
  const rolling = (stat.value.match(/\d/g) ?? []).length > 1;
  return (
    <div className="h-full rounded-xl bg-[var(--color-card)] p-6" onMouseEnter={() => setRolls((n) => n + 1)}>
      <motion.div
        // Re-keyed per hover so the wiggle replays each time
        key={rolling ? "number" : rolls}
        className="inline-block origin-[30%_80%] font-serif text-[2.25rem] font-bold"
        // Same line height as the digit windows, so digits and symbols align
        style={{ color: INDIGO, lineHeight: LINE }}
        animate={!rolling && rolls ? { rotate: [0, -10, 8, -6, 4, -2, 0] } : undefined}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <span className="sr-only">{stat.value}</span>
        {[...stat.value].map((char, i) =>
          rolling && /\d/.test(char) ? (
            <RollingDigit key={i} digit={Number(char)} rolls={rolls} order={i} />
          ) : (
            <span key={i} aria-hidden>
              {char}
            </span>
          ),
        )}
      </motion.div>
      <p className="mt-1.5 text-[16px] leading-snug text-[var(--color-muted)]">
        {stat.finding}
      </p>
    </div>
  );
}
