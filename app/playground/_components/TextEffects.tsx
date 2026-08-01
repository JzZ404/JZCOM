"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import DemoCard from "./DemoCard";

const TYPEWRITER_PHRASES = ["Design Technologist", "UX + AI + Robotics", "Building things"];
const ROTATING_WORDS = ["Design", "Robotics", "AI"];

function LetterStagger() {
  const text = "Hello there";
  return (
    <motion.h3
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
      className="font-serif text-2xl font-bold"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.h3>
  );
}

function GradientTextShift() {
  return (
    <h3 className="animate-gradient-shift bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent),var(--color-primary))] bg-[length:200%_auto] bg-clip-text text-2xl font-bold text-transparent">
      Gradient motion
    </h3>
  );
}

function CountUpNumber() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const [value, setValue] = useState(0);
  const target = 247;

  useEffect(() => {
    if (!inView) {
      setValue(0);
      return;
    }
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <div ref={ref} className="text-4xl font-bold text-[var(--color-primary)]">
      {value}
    </div>
  );
}

function ScrambleText() {
  const target = "SCRAMBLE";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [display, setDisplay] = useState(target);
  const [scrambling, setScrambling] = useState(false);

  function run() {
    if (scrambling) return;
    setScrambling(true);
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((letter, i) => (i < iteration ? letter : chars[Math.floor(Math.random() * chars.length)]))
          .join(""),
      );
      iteration += 0.5;
      if (iteration >= target.length) {
        clearInterval(interval);
        setDisplay(target);
        setScrambling(false);
      }
    }, 40);
  }

  return (
    <button
      onMouseEnter={run}
      className="font-mono text-2xl font-bold tracking-wider text-[var(--color-fg)]"
    >
      {display}
    </button>
  );
}

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPEWRITER_PHRASES[phraseIndex];
    if (!deleting && subIndex === current.length) {
      const pause = setTimeout(() => setDeleting(true), 1000);
      return () => clearTimeout(pause);
    }
    if (deleting && subIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % TYPEWRITER_PHRASES.length);
      return;
    }
    const timeout = setTimeout(
      () => setSubIndex((i) => i + (deleting ? -1 : 1)),
      deleting ? 35 : 70,
    );
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, phraseIndex]);

  return (
    <div className="font-mono text-lg font-semibold">
      {TYPEWRITER_PHRASES[phraseIndex].slice(0, subIndex)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
        className="ml-0.5 inline-block w-[2px] bg-[var(--color-fg)] align-middle"
        style={{ height: "1em" }}
      />
    </div>
  );
}

function WordRevealMask() {
  const words = ["Motion", "with", "intention"];
  return (
    <motion.h3
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="flex flex-wrap gap-x-2 font-serif text-2xl font-bold"
    >
      {words.map((word) => (
        <span key={word} className="overflow-hidden">
          <motion.span
            variants={{ hidden: { y: "100%" }, show: { y: "0%" } }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h3>
  );
}

function GlitchText() {
  return (
    <div className="group relative inline-block font-mono text-2xl font-bold">
      <span className="relative z-10">GLITCH</span>
      <span
        aria-hidden
        className="absolute top-0 left-0 opacity-0 mix-blend-multiply transition-opacity duration-150 group-hover:animate-glitch-1 group-hover:opacity-70 group-hover:text-[var(--color-primary)]"
      >
        GLITCH
      </span>
      <span
        aria-hidden
        className="absolute top-0 left-0 opacity-0 mix-blend-multiply transition-opacity duration-150 group-hover:animate-glitch-2 group-hover:opacity-70 group-hover:text-[var(--color-accent)]"
      >
        GLITCH
      </span>
    </div>
  );
}

function WavyText() {
  const text = "WAVE";
  return (
    <div className="flex text-2xl font-bold">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

function RotatingWords() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-2xl font-semibold">
      I love
      <span className="relative inline-block h-[1.3em] w-28 overflow-hidden text-left">
        <AnimatePresence mode="wait">
          <motion.span
            key={ROTATING_WORDS[index]}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute left-0 text-[var(--color-primary)]"
          >
            {ROTATING_WORDS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

function HighlightSweep() {
  return (
    <p className="text-xl font-medium">
      This is{" "}
      <span className="relative inline-block">
        <span className="relative z-10">highlighted</span>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-0 h-[45%] origin-left bg-[var(--color-accent)] opacity-50"
        />
      </span>{" "}
      text.
    </p>
  );
}

export default function TextEffects() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Text effects</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DemoCard name="Letter Stagger">
          <LetterStagger />
        </DemoCard>
        <DemoCard name="Gradient Shift">
          <GradientTextShift />
        </DemoCard>
        <DemoCard name="Count Up" description="Scroll away and back">
          <CountUpNumber />
        </DemoCard>
        <DemoCard name="Scramble" description="Hover the text">
          <ScrambleText />
        </DemoCard>
        <DemoCard name="Typewriter">
          <TypewriterText />
        </DemoCard>
        <DemoCard name="Word Reveal Mask" description="Scroll away and back">
          <WordRevealMask />
        </DemoCard>
        <DemoCard name="Glitch" description="Hover the text">
          <GlitchText />
        </DemoCard>
        <DemoCard name="Wavy Text">
          <WavyText />
        </DemoCard>
        <DemoCard name="Rotating Words">
          <RotatingWords />
        </DemoCard>
        <DemoCard name="Highlight Sweep" description="Scroll away and back">
          <HighlightSweep />
        </DemoCard>
      </div>
    </section>
  );
}
