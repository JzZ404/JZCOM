"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, LockOpen } from "lucide-react";
import type { IconName } from "@/components/icons";
import { IconGlyph } from "./IconBadge";
import Reveal from "./Reveal";

type Unlock = { title: string; body: string; icon: IconName };

// FocusFarm's roadmap as the game's own locked upgrades: each tile sits
// greyed out behind a padlock, and hovering or focusing it unlocks it (the
// padlock springs open, its icon colors in, the tile lifts).
export default function FarmUnlocks({ items }: { items: Unlock[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title}>
          <Reveal delay={i * 0.06} variant="scale" className="h-full">
            <UnlockTile item={item} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

function UnlockTile({ item }: { item: Unlock }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      tabIndex={0}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      animate={{ y: open ? -4 : 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={`flex h-full items-start gap-4 rounded-xl border p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
        open
          ? "border-[var(--color-primary)] bg-[var(--color-card)] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.3)]"
          : "border-dashed border-[var(--color-border)] bg-[var(--color-surface)]"
      }`}
    >
      {/* The upgrade's icon, with its padlock in the corner */}
      <div className="relative shrink-0">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300 ${
            open ? "bg-[color-mix(in_srgb,var(--color-primary)_16%,transparent)] text-[var(--color-primary)]" : "bg-[var(--color-card)] text-[var(--color-muted)]"
          }`}
        >
          <IconGlyph name={item.icon} className="h-6 w-6" />
        </div>
        <span
          aria-hidden
          className={`absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--color-bg)] transition-colors duration-300 ${
            open ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)] text-[var(--color-bg)]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "open" : "locked"}
              initial={{ scale: 0.4, rotate: open ? -30 : 0, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="flex"
            >
              {open ? <LockOpen className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Lock className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div>
        <h3
          className={`font-serif text-[17px] leading-snug font-bold transition-colors duration-300 ${
            open ? "text-[var(--color-fg)]" : "text-[color-mix(in_srgb,var(--color-fg)_75%,var(--color-bg))]"
          }`}
        >
          {item.title}
        </h3>
        <p className="mt-1 text-[14.5px] leading-snug text-[var(--color-muted)]">{item.body}</p>
      </div>
    </motion.div>
  );
}
