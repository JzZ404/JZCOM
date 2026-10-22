"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nomiChat } from "@/data/nomiChat";
import TypingDots from "./TypingDots";

type Phase = "hidden" | "typing" | "text";
const FIRST_DELAY_MS = 2500;
const TYPING_MS = 1000;
const TEXT_MS = 3800;
const GAP_MS: [number, number] = [7000, 11000];

// The "Ask me anything" speech bubble: pops in, "types" for a beat, shows its
// text, pops away, and comes back every so often. While Nomi sleeps it says
// "zzz" instead (no typing — she's asleep). Clicking it opens the chat.
export default function NomiBubble({
  enabled,
  asleep,
  right,
  bottom,
  reduceMotion,
  onOpen,
}: {
  enabled: boolean; // false while walking in or while the chat is open
  asleep: boolean;
  right: number; // px from the viewport's right edge to the bubble's center (and its tail)
  bottom: number;
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (!enabled || reduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const cycle = (delay: number) =>
      later(delay, () => {
        setPhase(asleep ? "text" : "typing");
        later(asleep ? 0 : TYPING_MS, () => {
          setPhase("text");
          later(TEXT_MS, () => {
            setPhase("hidden");
            cycle(GAP_MS[0] + Math.random() * (GAP_MS[1] - GAP_MS[0]));
          });
        });
      });
    cycle(FIRST_DELAY_MS);
    return () => {
      timers.forEach(clearTimeout);
      setPhase("hidden");
    };
  }, [enabled, asleep, reduceMotion]);

  // Reduced motion: no pop-in cycle, the bubble just stays up.
  const shown = enabled && (reduceMotion ? "text" : phase);
  const label = asleep ? nomiChat.bubble.asleep : nomiChat.bubble.awake;

  // White base, green text. primary-dark rather than primary for the text:
  // the brand green on white is only ~3:1 contrast at this size.
  const base = "border border-[var(--color-primary-light)] bg-white";
  const textColor = asleep ? "text-[var(--color-primary)]" : "text-[var(--color-primary-dark)]";

  return (
    // Positioning lives on this plain wrapper (centered on `right` via
    // translate), outside the pop animation, so Framer's scale/y transforms
    // never fight the centering transform.
    <div className="absolute translate-x-1/2" style={{ right, bottom }}>
      <AnimatePresence>
        {shown && shown !== "hidden" && (
          <motion.button
            key="bubble"
            type="button"
            onClick={onOpen}
            aria-label={`${nomiChat.bubble.awake} — open chat with Nomi`}
            className="pointer-events-auto block cursor-pointer"
            style={{ transformOrigin: "50% 100%" }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.4, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 8, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* gentle float while it's up */}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <motion.div
                layout
                className={`rounded-2xl px-3.5 py-2 text-[14px] font-semibold whitespace-nowrap shadow-[0_6px_18px_rgba(43,58,26,0.16)] ${base} ${textColor} ${asleep ? "italic" : ""}`}
              >
                {shown === "typing" ? (
                  <TypingDots dotClassName="bg-[var(--color-primary)]" />
                ) : (
                  <motion.span layout="position">{label}</motion.span>
                )}
              </motion.div>
              {/* tail, centered under the bubble, pointing down at her head —
                  only its lower two edges carry the outline, so it reads as
                  part of the bubble rather than a separate diamond */}
              <span
                aria-hidden
                className="absolute -bottom-[5px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-[var(--color-primary-light)] bg-white"
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
