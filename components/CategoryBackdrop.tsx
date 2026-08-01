"use client";

import { motion } from "framer-motion";
import type { ProjectCategory } from "@/data/projects";

// Each Work category gets a visually distinct decorative backdrop — organic
// blur for UX, a dot-grid for AI, a blueprint grid for Robotics — so
// scrolling between sections reads as moving between distinct "spaces".
// Built entirely from the site's existing primary/accent/fg tokens via
// color-mix; no new colors introduced ahead of the final palette.
const BACKDROP_STYLE: Record<ProjectCategory, React.CSSProperties> = {
  ux: {
    backgroundImage:
      "radial-gradient(circle at 18% 25%, color-mix(in srgb, var(--color-accent) 30%, transparent) 0%, transparent 55%), radial-gradient(circle at 82% 75%, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 55%)",
    filter: "blur(50px)",
  },
  ai: {
    backgroundImage:
      "radial-gradient(color-mix(in srgb, var(--color-primary) 45%, transparent) 1.5px, transparent 1.5px), radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 60%)",
    backgroundSize: "28px 28px, 100% 100%",
  },
  robotics: {
    backgroundImage:
      "repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-fg) 10%, transparent) 0px, transparent 1px, transparent 42px), repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-fg) 10%, transparent) 0px, transparent 1px, transparent 42px), radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 60%)",
  },
};

export default function CategoryBackdrop({ category }: { category: ProjectCategory }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10"
      style={BACKDROP_STYLE[category]}
    />
  );
}
