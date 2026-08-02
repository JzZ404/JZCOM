"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export type CaseStudyMode = "detailed" | "tldr";
export type CaseStudyTocItem = { id: string; label: string };

const MODES: { key: CaseStudyMode; label: string }[] = [
  { key: "detailed", label: "Detailed" },
  { key: "tldr", label: "TL;DR" },
];

// Same 112px clearance as scroll-mt-28, so "current section" tracks what's
// actually visible below the fixed nav, not what's hidden behind it.
const NAV_CLEARANCE = 112;
// Fixed short duration (not distance-scaled) so a jump to the bottom of the
// page still lands quickly — deliberately faster than scrolling there by hand.
const SCROLL_DURATION_MS = 400;

function animateScrollTo(id: string, onComplete: () => void) {
  const el = document.getElementById(id);
  if (!el) {
    onComplete();
    return;
  }
  const startY = window.scrollY;
  const targetY = startY + el.getBoundingClientRect().top - NAV_CLEARANCE;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const t = Math.min((now - startTime) / SCROLL_DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      onComplete();
    }
  }
  requestAnimationFrame(step);
}

export default function CaseStudySidebar({
  mode,
  onModeChange,
  tocItems,
}: {
  mode: CaseStudyMode;
  onModeChange: (mode: CaseStudyMode) => void;
  tocItems: CaseStudyTocItem[];
}) {
  const detailed = mode === "detailed";
  const [activeId, setActiveId] = useState<string>(tocItems[0]?.id ?? "");
  // While a TOC-click animation is running, the live scroll-spy below is
  // suppressed — otherwise the highlight visibly walks through every
  // section it physically scrolls past on the way to the target, instead
  // of jumping straight to it.
  const suppressSpyRef = useRef(false);

  // Scroll-spy: walk the TOC top-to-bottom and keep the last section whose
  // top has scrolled past the nav clearance — that's the one actually
  // visible just below the fixed nav right now. Special-cased at the very
  // bottom of the page: the last section may be shorter than the viewport,
  // so its own top can never cross the clearance line — without this,
  // scroll-spy would get stuck on the second-to-last item forever.
  useEffect(() => {
    if (!detailed || tocItems.length === 0) return;

    let ticking = false;
    function updateActive() {
      ticking = false;
      if (suppressSpyRef.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(tocItems[tocItems.length - 1].id);
        return;
      }

      let current: string = tocItems[0].id;
      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top - NAV_CLEARANCE <= 0) {
          current = item.id;
        }
      }
      setActiveId(current);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [detailed, tocItems]);

  return (
    // top-28 matches the pt-28 clearance the root layout already reserves for
    // the fixed nav, so the sticky sidebar settles just below the floating
    // glass nav instead of scrolling underneath/behind it.
    // max-h + overflow-y-auto (instead of min-h-screen) caps the sidebar at
    // the actual space below the fixed nav — a forced min-height taller than
    // the content made position:sticky release early near the very bottom
    // of the page, sliding the sidebar up over the floating nav.
    <div className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-59 shrink-0 self-start overflow-y-auto border-r border-[var(--color-border)] px-6.5 py-9 lg:block">
      <Link
        href="/#work"
        className="mb-4 block text-[16px] font-medium text-[var(--color-muted)] no-underline"
      >
        ← Back to work
      </Link>

      {/* Detailed/TL;DR toggle — temporarily hidden, bring back later.
      <div className="mb-8 flex w-full gap-1 rounded-full bg-[var(--color-surface)] p-1">
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onModeChange(key)}
            className={`relative flex-1 rounded-full px-2 py-2 text-[16px] font-semibold transition-colors ${
              mode === key ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"
            }`}
          >
            {mode === key && (
              <motion.span
                layoutId="case-study-mode-pill"
                className="absolute inset-0 rounded-full bg-[var(--color-bg)] shadow-sm"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
      */}

      {detailed && (
        <div className="flex flex-col gap-0.5">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveId(item.id);
                suppressSpyRef.current = true;
                animateScrollTo(item.id, () => {
                  suppressSpyRef.current = false;
                });
              }}
              className={`border-l-2 py-1.5 pl-3 text-[16px] no-underline transition-colors ${
                activeId === item.id
                  ? "border-[var(--color-primary)] font-semibold text-[var(--color-primary)]"
                  : "border-transparent font-normal text-[var(--color-muted)] hover:text-[var(--color-primary)]"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
