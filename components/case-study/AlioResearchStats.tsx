"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

// The site's own card colors, with the numbers in Alio's indigo
const INDIGO = "#4F46E5";
const LINE = 1.15; // em — the number's line height, and each digit window's

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

// One digit in a window one line tall, over a strip of 0–9 twice. At rest it
// shows its digit in the first set; a roll spins a full turn to the same digit
// in the second set (each hover restarts from the first). Digits further right
// take a beat longer, like an odometer. With reduced motion on, the case
// study's MotionConfig skips the spin and the digit simply stays put.
function RollingDigit({ digit, rolls, order }: { digit: number; rolls: number; order: number }) {
  return (
    // The invisible copy of the digit sets the window to its own width (a
    // "1" stays narrow); the spinning strip is centered over it.
    <span aria-hidden className="relative inline-block overflow-hidden align-top" style={{ height: `${LINE}em` }}>
      <span className="invisible">{digit}</span>
      <motion.span
        key={rolls}
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        style={{ lineHeight: `${LINE}em` }}
        initial={{ y: `${-digit * LINE}em` }}
        animate={{ y: rolls ? [`${-digit * LINE}em`, `${-(digit + 10) * LINE}em`] : `${-digit * LINE}em` }}
        transition={rolls ? { duration: 0.75 + order * 0.08, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      >
        {[...Array(20)].map((_, n) => (
          <span key={n}>{n % 10}</span>
        ))}
      </motion.span>
    </span>
  );
}
