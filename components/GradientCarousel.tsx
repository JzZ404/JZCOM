"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Hobby } from "./HobbyCarousel";
import PlaceholderBlock from "./case-study/PlaceholderBlock";

// Custom build of the "gradient carousel" concept (originally a 3D
// coverflow + a background that tinted to match whichever card was
// centered) — requested as React Bits Pro's gradient-carousel component,
// but that needs a paid license key this project doesn't have, so this
// reimplements the coverflow directly in Framer Motion. The background
// tint itself was dropped per Joyce ("no green backdrop") — just the 3D
// card motion remains. Replaces HobbyCarousel on the About page;
// HobbyCarousel itself is left in place unused rather than deleted, in
// case the flat-row treatment comes back.

// Plain chevron, not the "←"/"→" text glyphs — those render with a full
// arrow shaft/tail in most fonts, not the bare "<" angle Joyce wants.
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={direction === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

const VISIBLE_RANGE = 2; // neighbors shown on each side before fading out
const STEP_X = 190; // px of horizontal offset per step away from center
// Softer again — lower stiffness still read as stiff once triggered by a
// scroll/wheel gesture rather than a click, since the discrete per-step
// jump is more noticeable mid-gesture. Low stiffness + high mass + modest
// damping is what gives a slow, floaty glide instead of a snap.
const CARD_SPRING = { type: "spring" as const, stiffness: 70, damping: 16, mass: 1.1 };
// Minimum ms between accepted wheel steps — a single trackpad swipe fires
// many wheel events, and without this one swipe would fly through several
// cards instead of advancing one at a time. Raised alongside the softer
// spring above so a step has time to actually glide before the next one
// can start, instead of interrupting it mid-flight.
const WHEEL_COOLDOWN_MS = 500;

export default function GradientCarousel({ hobbies }: { hobbies: Hobby[] }) {
  // Starts centered on the middle of whatever array it's given, not
  // always index 0 — lets a caller control which card is front-and-center
  // on load just by where they place it in the array (see about.ts).
  const [active, setActive] = useState(() => Math.floor(hobbies.length / 2));
  const count = hobbies.length;
  const lastWheelRef = useRef(0);

  function go(delta: number) {
    setActive((a) => (a + delta + count) % count);
  }

  // Shortest signed distance from the active card, wrapping around either
  // end — so stepping past the last card continues into the first instead
  // of the whole track sliding back across the entire row.
  function wrappedOffset(i: number) {
    let diff = i - active;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  }

  // Only reacts to a horizontally-dominant wheel/trackpad gesture — a
  // plain vertical mouse-wheel scroll (reading down the page) passes
  // through untouched instead of getting hijacked into flipping cards.
  function onWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) < 10) return;
    const now = Date.now();
    if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) return;
    lastWheelRef.current = now;
    go(e.deltaX > 0 ? 1 : -1);
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Outside of work"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onWheel={onWheel}
      className="relative -mx-3 overflow-hidden rounded-2xl px-3 py-8 sm:-mx-6 sm:px-6"
    >
      {/* perspective on this wrapper, preserve-3d on each card, is what
          turns a flat translateX/rotateY into an actual coverflow tilt
          instead of a 2D skew. */}
      <div
        // h-96, not h-80 — the active card now scales to 1.2x (card +
        // shadow needs more vertical room than before, or the outer
        // overflow-hidden wrapper clips the top/bottom of the enlarged
        // photo and its drop shadow).
        className="relative flex h-96 items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        <motion.button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          whileHover={{ scale: 1.2, x: -2 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          // Bare chevron, no pill/border/background — just the arrow
          // itself, pinned to the row's edge instead of a control bar.
          className="absolute left-0 z-20 text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] sm:left-2"
        >
          <ChevronIcon direction="left" />
        </motion.button>

        {hobbies.map((hobby, i) => {
          const offset = wrappedOffset(i);
          const distance = Math.abs(offset);
          if (distance > VISIBLE_RANGE) return null;
          const isActive = offset === 0;

          return (
            <motion.button
              key={hobby.label}
              type="button"
              onClick={() => setActive(i)}
              animate={{
                x: offset * STEP_X,
                // >1 for the active card, not just "not shrunk" — makes
                // the centered photo read as a deliberate spotlight
                // rather than merely the least-shrunk of the five.
                scale: isActive ? 1.2 : 1 - distance * 0.16,
                rotateY: offset * -28,
                opacity: 1 - distance * 0.3,
              }}
              transition={CARD_SPRING}
              style={{ transformStyle: "preserve-3d", zIndex: VISIBLE_RANGE - distance + 1 }}
              aria-current={isActive}
              aria-label={hobby.label}
              // data-cursor-pill hands the caption off to the same
              // cursor-following green pill the Work grid's project cards
              // and hero headline terms use (see UserCursor.tsx) — no
              // separate in-image overlay of its own anymore. Only the
              // centered/spotlight card gets it; side cards are already
              // mid-transition toward or away from center, so hovering one
              // of those isn't really "looking at" that photo yet.
              data-cursor-pill={isActive ? hobby.label : undefined}
              className="absolute w-64 cursor-pointer overflow-hidden rounded-xl shadow-[0px_10px_24px_rgba(0,0,0,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              {hobby.image ? (
                <div className="aspect-square w-full overflow-hidden rounded-xl">
                  <img
                    src={hobby.image}
                    alt={hobby.label}
                    style={{
                      objectPosition: hobby.objectPosition,
                      ...(hobby.zoom ? { transform: `scale(${hobby.zoom})` } : {}),
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <PlaceholderBlock label={hobby.label} height={256} />
              )}
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          whileHover={{ scale: 1.2, x: 2 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute right-0 z-20 text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)] sm:right-2"
        >
          <ChevronIcon direction="right" />
        </motion.button>
      </div>
    </div>
  );
}
