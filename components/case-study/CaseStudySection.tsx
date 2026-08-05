"use client";

import { motion } from "framer-motion";

// Shared numbered-section header ("01 — Research") used across every case
// study section, so the sequence/typography stays consistent without each
// section re-declaring it. Fades/rises in on scroll — once: false so it
// replays every time the section re-enters the viewport, scrolling up or
// down, not just the first time.
export default function CaseStudySection({
  id,
  number,
  title,
  icon,
  children,
  className = "mb-11",
}: {
  id: string;
  number: string;
  title: string;
  // Optional small illustration shown beside the "01 — Section" numeral —
  // opt-in per project (Drunky's cocktail set) rather than a global
  // treatment, so it doesn't force an icon requirement on every case study.
  icon?: { src: string; alt: string };
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    // scroll-mt-28 matches the sidebar's top-28 nav clearance, so jumping
    // here from a TOC link (or any #anchor) doesn't land the section flush
    // under the fixed floating nav.
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`scroll-mt-28 px-10 ${className}`}
    >
      <div className="mb-2 flex items-center gap-2">
        {icon && (
          <img src={icon.src} alt={icon.alt} className="h-6 w-6 shrink-0 object-contain" />
        )}
        <div className="font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase">
          {number}
        </div>
      </div>
      <h2 className="mb-3.5 font-serif text-[length:var(--text-h2)] font-bold text-[var(--color-fg)]">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}
