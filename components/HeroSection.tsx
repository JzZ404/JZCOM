"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type HeadlineSegment = {
  text: string;
  bold?: boolean;
};

type HeroSectionProps = {
  name: string;
  leadWord: string; // regular-weight lead-in, e.g. "A"
  headlineLine1: string; // bold, continues leadWord on the same visual line
  headlineLine2: HeadlineSegment[]; // mixed weight, forced onto its own line
};

type Run = { kind: "text"; text: string; className: string; highlight?: boolean } | { kind: "break" };

const TYPE_SPEED_MS = 45;
const GRADIENT_WORD_CLASS =
  "animate-gradient-shift bg-[length:200%_auto] bg-[linear-gradient(90deg,var(--color-primary-dark),var(--color-primary),var(--color-highlight),var(--color-primary))] bg-clip-text font-normal text-transparent";
const HIGHLIGHTED_WORDS = ["UX", "AI", "Robotics"];

function useTypewriterProgress(totalLength: number, speed: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= totalLength) return;
    const timeout = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(timeout);
  }, [count, totalLength, speed]);
  return count;
}

function buildHeadlineRuns(
  leadWord: string,
  headlineLine1: string,
  headlineLine2: HeadlineSegment[],
): Run[] {
  return [
    { kind: "text", text: `${leadWord} `, className: "font-normal" },
    { kind: "text", text: headlineLine1, className: GRADIENT_WORD_CLASS },
    { kind: "break" },
    ...headlineLine2.map(
      (segment): Run => ({
        kind: "text",
        text: segment.text,
        className: segment.bold ? "font-bold" : "font-normal",
        highlight: HIGHLIGHTED_WORDS.includes(segment.text),
      }),
    ),
  ];
}

function TypewriterHeadline({
  leadWord,
  headlineLine1,
  headlineLine2,
}: Pick<HeroSectionProps, "leadWord" | "headlineLine1" | "headlineLine2">) {
  const runs = buildHeadlineRuns(leadWord, headlineLine1, headlineLine2);
  const totalLength = runs.reduce((sum, r) => (r.kind === "text" ? sum + r.text.length : sum), 0);
  const revealed = useTypewriterProgress(totalLength, TYPE_SPEED_MS);

  const nodes: React.ReactNode[] = [];
  let runningTotal = 0;

  for (let i = 0; i < runs.length; i++) {
    const run = runs[i];

    if (run.kind === "break") {
      if (revealed >= runningTotal) {
        nodes.push(<br key={i} />);
        continue;
      }
      break;
    }

    if (revealed <= runningTotal) break;

    const charsToShow = Math.min(run.text.length, revealed - runningTotal);
    const fullyShown = charsToShow === run.text.length;
    const content = run.text.slice(0, charsToShow);

    nodes.push(
      run.highlight ? (
        <span key={i} className="relative inline-block">
          <span className={`relative z-10 ${run.className}`}>{content}</span>
          <motion.span
            initial={false}
            animate={{ scaleX: fullyShown ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 z-0 h-[30%] origin-left bg-[var(--color-accent)] opacity-50"
          />
        </span>
      ) : (
        <span key={i} className={run.className}>
          {content}
        </span>
      ),
    );

    runningTotal += run.text.length;
    if (!fullyShown) break;
  }

  return (
    <>
      {nodes}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
        className="ml-1 inline-block w-[3px] bg-[var(--color-fg)] align-middle"
        style={{ height: "0.85em" }}
      />
    </>
  );
}

function LetterStaggerGreeting({ name }: { name: string }) {
  const chars = Array.from(`Hi! I’m ${name}`);
  return (
    <motion.p
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
      className="font-serif text-[length:var(--text-greeting)] text-[var(--color-fg)]"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
      <span aria-hidden>👋</span>
    </motion.p>
  );
}

// Hidden once scrolled (or already landed) past the hero — it's positioned
// at the hero's bottom edge, so on a short viewport it could otherwise
// still sit there, fully visible, right at the top of the Work section.
// Deliberately a plain scroll-position check (same on-mount-then-listen
// pattern as Nav's own scrolled state) rather than a Framer Motion
// scroll-linked value: useScroll's scrollY only updates on 'scroll'
// events, so landing directly on /#work via anchor-jump (no scroll event
// fires for the initial jump) left it stuck showing at full opacity.
function ScrollHintArrow() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > 150);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/#work"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
      }}
      className={`group absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-base font-medium text-[var(--color-fg)] transition-opacity duration-300 hover:text-[var(--color-primary)] ${
        pastHero ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <span>See the work</span>
      <motion.span
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-2xl leading-none"
        aria-hidden
      >
        ↓
      </motion.span>
    </Link>
  );
}

export default function HeroSection({
  name,
  leadWord,
  headlineLine1,
  headlineLine2,
}: HeroSectionProps) {
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const textY = useTransform(scrollY, [0, 300], [-24, -50]);

  return (
    <section className="relative mx-auto flex h-full min-h-[600px] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <motion.div style={{ opacity: textOpacity, y: textY }}>
        <LetterStaggerGreeting name={name} />
        <h1 className="mt-4 min-h-[2.3em] font-serif text-[length:var(--text-display)] leading-[1.15] tracking-tight text-[var(--color-fg)]">
          <TypewriterHeadline
            leadWord={leadWord}
            headlineLine1={headlineLine1}
            headlineLine2={headlineLine2}
          />
        </h1>
      </motion.div>
      <ScrollHintArrow />
    </section>
  );
}
