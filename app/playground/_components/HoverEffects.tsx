"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import DemoCard from "./DemoCard";

const NAV_ITEMS = ["Work", "Archive", "About", "Contact"];

function LiftCard() {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.25)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-8 text-center font-medium"
    >
      Hover to lift
    </motion.div>
  );
}

function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 25,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="flex h-32 w-48 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-primary)] font-medium text-[var(--color-on-primary)]"
      >
        Tilt me
      </motion.div>
    </div>
  );
}

function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <button ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.span
        style={{ x, y }}
        className="inline-block rounded-full bg-[var(--color-primary)] px-8 py-3 font-medium text-[var(--color-on-primary)]"
      >
        Magnetic
      </motion.span>
    </button>
  );
}

function ImageZoomReveal() {
  return (
    <div className="h-40 w-56 overflow-hidden rounded-lg border border-[var(--color-border)]">
      <motion.div
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full w-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-accent))]"
      />
    </div>
  );
}

function GlowBorder() {
  return (
    <div className="group relative rounded-lg p-[2px]">
      <div className="absolute inset-0 rounded-lg bg-[conic-gradient(from_0deg,var(--color-primary),var(--color-accent),var(--color-primary))] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-8 py-6 font-medium">
        Hover for glow
      </div>
    </div>
  );
}

function UnderlineDraw() {
  return (
    <span className="group relative cursor-pointer font-medium">
      Hover this link
      <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--color-primary)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </span>
  );
}

function ShineSweep() {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-primary)] px-8 py-6 font-medium text-[var(--color-on-primary)]">
      <span className="relative z-10">Hover for shine</span>
      <div className="absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_40%,rgba(255,255,255,0.55)_50%,transparent_60%)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
    </div>
  );
}

function BorderDraw() {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="relative flex h-24 w-40 items-center justify-center rounded-lg font-medium"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 96" fill="none">
        <motion.rect
          x="1"
          y="1"
          width="158"
          height="94"
          rx="10"
          stroke="var(--color-primary)"
          strokeWidth="2"
          variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
      <span className="relative z-10">Trace border</span>
    </motion.div>
  );
}

function ArrowSlide() {
  return (
    <span className="group inline-flex cursor-pointer items-center gap-1 font-medium">
      Learn more
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">
        →
      </span>
    </span>
  );
}

function BackgroundSwipe() {
  return (
    <button className="group relative overflow-hidden rounded-lg border border-[var(--color-primary)] px-8 py-3 font-medium text-[var(--color-primary)]">
      <span className="absolute inset-0 -translate-x-full bg-[var(--color-primary)] transition-transform duration-300 ease-out group-hover:translate-x-0" />
      <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-on-primary)]">
        Swipe fill
      </span>
    </button>
  );
}

function CardFlip3D() {
  return (
    <div className="h-32 w-48" style={{ perspective: 1000 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial="rest"
        whileHover="flipped"
        variants={{ rest: { rotateY: 0 }, flipped: { rotateY: 180 } }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] font-medium"
          style={{ backfaceVisibility: "hidden" }}
        >
          Front
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[var(--color-primary)] font-medium text-[var(--color-on-primary)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          Back
        </div>
      </motion.div>
    </div>
  );
}

function CursorHighlightNav() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul className="relative flex gap-2" onMouseLeave={() => setHovered(null)}>
      {NAV_ITEMS.map((item) => (
        <li
          key={item}
          onMouseEnter={() => setHovered(item)}
          className="relative cursor-pointer px-4 py-2 text-sm font-medium"
        >
          {hovered === item && (
            <motion.div
              layoutId="nav-highlight"
              className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span
            className={`relative z-10 ${hovered === item ? "text-[var(--color-on-primary)]" : ""}`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function HoverEffects() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Hover effects</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard name="Lift & Shadow">
          <LiftCard />
        </DemoCard>
        <DemoCard name="Tilt Card (3D)">
          <TiltCard />
        </DemoCard>
        <DemoCard name="Magnetic Button">
          <MagneticButton />
        </DemoCard>
        <DemoCard name="Image Zoom Reveal">
          <ImageZoomReveal />
        </DemoCard>
        <DemoCard name="Glow Border">
          <GlowBorder />
        </DemoCard>
        <DemoCard name="Underline Draw">
          <UnderlineDraw />
        </DemoCard>
        <DemoCard name="Shine Sweep">
          <ShineSweep />
        </DemoCard>
        <DemoCard name="Border Draw">
          <BorderDraw />
        </DemoCard>
        <DemoCard name="Arrow Slide">
          <ArrowSlide />
        </DemoCard>
        <DemoCard name="Background Swipe">
          <BackgroundSwipe />
        </DemoCard>
        <DemoCard name="Card Flip (3D)">
          <CardFlip3D />
        </DemoCard>
        <DemoCard name="Cursor Highlight Nav" description="Hover between items">
          <CursorHighlightNav />
        </DemoCard>
      </div>
    </section>
  );
}
