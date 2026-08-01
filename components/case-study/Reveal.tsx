"use client";

import { motion } from "framer-motion";

// Scroll-reveal for individual items within a section (stat cards, photo
// pairs, sticky notes, table rows...) — CaseStudySection already fades in
// the section as a whole, this adds a per-item stagger on top so repeated
// groups animate in one after another instead of all at once. once:false
// so it replays on every scroll pass, not just the first.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
