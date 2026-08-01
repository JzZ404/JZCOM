"use client";

import { motion } from "framer-motion";
import DemoCard from "./DemoCard";

const REPLAYABLE_VIEWPORT = { once: false, margin: "-80px" };

function FadeUpReveal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REPLAYABLE_VIEWPORT}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-8 py-6 font-medium"
    >
      Fades up on scroll
    </motion.div>
  );
}

function StaggeredListReveal() {
  const items = ["One", "Two", "Three", "Four"];
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={REPLAYABLE_VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="flex flex-col gap-2"
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm font-medium"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ClipReveal() {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={REPLAYABLE_VIEWPORT}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="h-32 w-48 rounded-lg bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))]"
    />
  );
}

function BlurFocusReveal() {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={REPLAYABLE_VIEWPORT}
      transition={{ duration: 0.7 }}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-8 py-6 font-medium"
    >
      Sharpens into focus
    </motion.div>
  );
}

export default function ScrollReveals() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Scroll reveals</h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Scroll away and back to replay.</p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DemoCard name="Fade Up">
          <FadeUpReveal />
        </DemoCard>
        <DemoCard name="Staggered List">
          <StaggeredListReveal />
        </DemoCard>
        <DemoCard name="Clip Wipe">
          <ClipReveal />
        </DemoCard>
        <DemoCard name="Blur Focus">
          <BlurFocusReveal />
        </DemoCard>
      </div>
    </section>
  );
}
