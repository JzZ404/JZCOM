"use client";

import { ArrowDown, ArrowRight, TriangleAlert } from "lucide-react";
import type { IconName } from "@/components/icons";
import { IconGlyph } from "./IconBadge";
import Reveal from "./Reveal";

// Alio's indigo pair (the same values the page's "Alio's Position" callout
// uses). The safeguard cards stay light in both site themes, so their text
// colors are set explicitly.
const SAFE_BG = "#EAEBF7";
const SAFE_ACCENT = "#3730A3";
const SAFE_TEXT = "#1E1B4B";

export type ResponsibleAiRow = {
  risk: string;
  impact: string;
  safeguard: { title: string; body: string; icon: IconName };
};

// Each risk paired with the safeguard that answers it: the risk (with what
// could go wrong) on the left, an arrow, and the safeguard on the right in
// Alio's indigo. On scroll-in the risk slides in first and the safeguard
// answers it from the other side. Stacks top to bottom on phones.
export default function ResponsibleAiSafeguards({ rows }: { rows: ResponsibleAiRow[] }) {
  return (
    <div className="mb-11">
      {/* Column names, once, for wide screens (on phones each card's own
          icon and color carry the distinction) */}
      <div className="mb-3 hidden grid-cols-[1fr_2.5rem_1.1fr] gap-4 text-[14px] font-semibold text-[var(--color-muted)] sm:grid">
        <span>The risk</span>
        <span />
        <span>How Alio prevents it</span>
      </div>

      <ol className="flex flex-col gap-6 sm:gap-4">
        {rows.map((row) => (
          <li key={row.risk} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_2.5rem_1.1fr] sm:gap-4">
            <Reveal variant="left" className="rounded-xl bg-[var(--color-card)] p-5">
              <h3 className="mb-1.5 flex items-start gap-2.5 font-serif text-[17px] leading-snug font-bold text-[var(--color-fg)]">
                <TriangleAlert
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "color-mix(in srgb, var(--color-accent) 75%, black)" }}
                  strokeWidth={2}
                />
                {row.risk}
              </h3>
              <p className="pl-7.5 text-[15px] leading-relaxed text-[var(--color-muted)]">{row.impact}</p>
            </Reveal>

            <Reveal variant="soft" delay={0.1} className="flex items-center justify-center text-[var(--color-muted)]">
              <ArrowRight aria-hidden className="hidden h-5 w-5 sm:block" strokeWidth={2} />
              <ArrowDown aria-hidden className="h-5 w-5 sm:hidden" strokeWidth={2} />
            </Reveal>

            <Reveal variant="right" delay={0.15} className="rounded-xl p-5" style={{ background: SAFE_BG }}>
              <h3
                className="mb-1.5 flex items-start gap-2.5 font-serif text-[17px] leading-snug font-bold"
                style={{ color: SAFE_TEXT }}
              >
                <IconGlyph name={row.safeguard.icon} className="mt-0.5 h-5 w-5 shrink-0" style={{ color: SAFE_ACCENT }} />
                {row.safeguard.title}
              </h3>
              <p className="pl-7.5 text-[15px] leading-relaxed" style={{ color: SAFE_TEXT, opacity: 0.8 }}>
                {row.safeguard.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
