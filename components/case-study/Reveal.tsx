"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";

type RevealVariant = "up" | "left" | "right" | "scale" | "soft";

const revealMotion: Record<RevealVariant, { initial: { opacity: number; x?: number; y?: number; scale?: number }; show: { opacity: number; x?: number; y?: number; scale?: number } }> = {
  up: {
    initial: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  },
  left: {
    initial: { opacity: 0, x: -28 },
    show: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 28 },
    show: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, y: 12, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1 },
  },
  soft: {
    initial: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  },
};

// Scroll-reveal for individual items within a section (stat cards, photo
// pairs, sticky notes, table rows...) — CaseStudySection already fades in
// the section as a whole, this adds a per-item stagger on top so repeated
// groups animate in one after another instead of all at once. once:false
// so it replays on every scroll pass, not just the first.
export default function Reveal({
  children,
  delay = 0,
  className,
  style,
  variant = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  variant?: RevealVariant;
}) {
  const motionState = revealMotion[variant];

  return (
    <motion.div
      initial={motionState.initial}
      whileInView={motionState.show}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
