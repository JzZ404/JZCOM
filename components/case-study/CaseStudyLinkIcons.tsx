"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

export type CaseStudyLinkIcon = "github" | "kaggle" | "huggingface";
// `label` is the accessible name (aria-label/title, read by screen readers);
// `tooltip` is the friendlier action-phrase shown in the cursor-following bubble.
export type CaseStudyLink = { label: string; tooltip: string; href: string; icon: CaseStudyLinkIcon };

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function KaggleMark() {
  return (
    <img src="/icons/kaggle.png" alt="" aria-hidden className="h-4 w-4 object-contain" />
  );
}

// Hugging Face's own mark IS this emoji — using it directly is accurate,
// not a stand-in.
function HuggingFaceMark() {
  return (
    <span className="text-[17px] leading-none" aria-hidden>
      🤗
    </span>
  );
}

const ICONS: Record<CaseStudyLinkIcon, React.ReactNode> = {
  github: <GithubMark />,
  kaggle: <KaggleMark />,
  huggingface: <HuggingFaceMark />,
};

function LinkButton({ link }: { link: CaseStudyLink }) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 28 });
  const springY = useSpring(y, { stiffness: 350, damping: 28 });

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      title={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-fg)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      {ICONS[link.icon]}
      <AnimatePresence>
        {hovered && (
          <motion.span
            style={{ left: springX, top: springY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[140%] rounded-full bg-[var(--color-fg)] px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-[var(--color-bg)] shadow-md"
          >
            {link.tooltip}
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

export default function CaseStudyLinkIcons({ links }: { links: CaseStudyLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex shrink-0 gap-3">
      {links.map((link) => (
        <LinkButton key={link.href} link={link} />
      ))}
    </div>
  );
}
