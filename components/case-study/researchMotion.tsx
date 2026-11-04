"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

// Shared motion pieces for the research-stat cards (Nest, Helport).

// Top and bottom only: a side margin would keep things near the screen's
// left/right edges from ever counting as "in view"
export const inView = { once: true, margin: "-80px 0px -80px 0px" } as const;

// Counts a number up from 0 the first time it scrolls into view. The final
// value renders on the server, so it reads correctly without JavaScript;
// reduced motion skips the count. `replay` (a hover replay, see
// useHoverReplay) starts at 0 and counts right away, since the card is
// already on screen.
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  replay = false,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  replay?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, inView);
  const go = seen || replay;
  useEffect(() => {
    if (!go) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (ref.current) ref.current.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(n)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [go, to, prefix, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {replay ? 0 : to}
      {suffix}
    </span>
  );
}

// Replays a card's animation on hover: key the animated content on
// `replays` (it remounts and plays again) and spread `handlers` on the card.
// Replaying swaps the content under the cursor, which makes React report the
// mouse entering again — so each hover only counts once, until it leaves.
export function useHoverReplay(enabled = true) {
  const [replays, setReplays] = useState(0);
  const hovering = useRef(false);
  const handlers = enabled
    ? {
        onMouseEnter: () => {
          if (hovering.current) return;
          hovering.current = true;
          setReplays((n) => n + 1);
        },
        onMouseLeave: () => {
          hovering.current = false;
        },
      }
    : {};
  return { replays, replay: replays > 0, handlers };
}

// A sentence with the given phrases set in bold, in `className` (a color)
export function BoldPhrases({ text, phrases = [], className }: { text: string; phrases?: string[]; className: string }) {
  if (!phrases.length) return <>{text}</>;
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return (
    <>
      {text.split(new RegExp(`(${escaped.join("|")})`)).map((part, i) =>
        phrases.includes(part) ? (
          <strong key={i} className={`font-semibold ${className}`}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

// Line height (em) for a number with rolling digits — each digit's window is
// exactly one line, so set the number's own line-height to this too.
export const ROLL_LINE = 1.15;

// One digit in a window one line tall, over a strip of 0–9 twice. At rest it
// shows its digit in the first set; a roll spins a full turn to the same digit
// in the second set (each hover restarts from the first). Digits further right
// take a beat longer, like an odometer. With reduced motion on, the case
// study's MotionConfig skips the spin and the digit simply stays put.
export function RollingDigit({ digit, rolls, order }: { digit: number; rolls: number; order: number }) {
  return (
    // The invisible copy of the digit sets the window to its own width (a
    // "1" stays narrow); the spinning strip is centered over it.
    <span aria-hidden className="relative inline-block overflow-hidden align-top" style={{ height: `${ROLL_LINE}em` }}>
      <span className="invisible">{digit}</span>
      <motion.span
        key={rolls}
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        style={{ lineHeight: `${ROLL_LINE}em` }}
        initial={{ y: `${-digit * ROLL_LINE}em` }}
        animate={{ y: rolls ? [`${-digit * ROLL_LINE}em`, `${-(digit + 10) * ROLL_LINE}em`] : `${-digit * ROLL_LINE}em` }}
        transition={rolls ? { duration: 0.75 + order * 0.08, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
      >
        {[...Array(20)].map((_, n) => (
          <span key={n}>{n % 10}</span>
        ))}
      </motion.span>
    </span>
  );
}

// A number whose digits roll (RollingDigit) each time `rolls` goes up;
// everything else in it ("~", "M", "%") stays put. Give the element around
// it a line-height of ROLL_LINE so digits and symbols share a baseline.
// Screen readers get the plain value.
export function RollingNumber({ value, rolls }: { value: string; rolls: number }) {
  return (
    <span style={{ lineHeight: ROLL_LINE }}>
      <span className="sr-only">{value}</span>
      {[...value].map((char, i) =>
        /\d/.test(char) ? (
          <RollingDigit key={i} digit={Number(char)} rolls={rolls} order={i} />
        ) : (
          <span key={i} aria-hidden>
            {char}
          </span>
        ),
      )}
    </span>
  );
}
