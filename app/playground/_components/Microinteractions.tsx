"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DemoCard from "./DemoCard";

function RippleButton() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((ripple) => ripple.id !== id)), 600);
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden rounded-full bg-[var(--color-primary)] px-8 py-3 font-medium text-[var(--color-on-primary)]"
    >
      Click me
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ left: ripple.x, top: ripple.y }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50"
        />
      ))}
    </button>
  );
}

function MorphIconButton() {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      aria-label="Toggle menu icon"
      className="flex h-14 w-14 flex-col items-center justify-center gap-1.5 rounded-full border border-[var(--color-border)]"
    >
      <motion.span
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        className="block h-0.5 w-6 rounded-full bg-[var(--color-fg)]"
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1 }}
        className="block h-0.5 w-6 rounded-full bg-[var(--color-fg)]"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        className="block h-0.5 w-6 rounded-full bg-[var(--color-fg)]"
      />
    </button>
  );
}

function AccordionExpand() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full max-w-xs rounded-lg border border-[var(--color-border)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
      >
        What is this?
        <motion.span animate={{ rotate: open ? 180 : 0 }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden px-4 text-sm text-[var(--color-muted)]"
          >
            <p className="pb-4">An expand/collapse panel with a height-auto animation.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LikeHeartPop() {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked((l) => !l)} aria-label="Like" className="text-4xl">
      <motion.span
        key={liked ? "liked" : "unliked"}
        initial={{ scale: 0.6 }}
        animate={{ scale: [0.6, 1.3, 1] }}
        transition={{ duration: 0.35 }}
        className="inline-block"
      >
        {liked ? "❤️" : "🤍"}
      </motion.span>
    </button>
  );
}

export default function Microinteractions() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Micro-interactions</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DemoCard name="Ripple Click">
          <RippleButton />
        </DemoCard>
        <DemoCard name="Morph Icon">
          <MorphIconButton />
        </DemoCard>
        <DemoCard name="Accordion">
          <AccordionExpand />
        </DemoCard>
        <DemoCard name="Like Pop">
          <LikeHeartPop />
        </DemoCard>
      </div>
    </section>
  );
}
