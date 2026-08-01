"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import DemoCard from "./DemoCard";

function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !ref.current) return;
    ref.current.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative h-40 w-full overflow-hidden rounded-lg"
      style={{
        background:
          "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--color-primary), var(--color-fg) 70%)",
      }}
    >
      <span className="absolute bottom-3 left-3 text-xs font-medium text-white/80">
        Move your cursor
      </span>
    </div>
  );
}

function FloatingBlobs() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-[var(--color-bg)]">
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-24 w-24 rounded-full bg-[var(--color-primary)] opacity-50 blur-2xl"
        style={{ top: "10%", left: "15%" }}
      />
      <motion.div
        animate={{ x: [0, -25, 20, 0], y: [0, 20, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-28 w-28 rounded-full bg-[var(--color-accent)] opacity-50 blur-2xl"
        style={{ bottom: "10%", right: "15%" }}
      />
    </div>
  );
}

function AuroraWave() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-black">
      <motion.div
        animate={{ x: ["-20%", "20%", "-20%"], rotate: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 left-1/4 h-40 w-56 rounded-full bg-[var(--color-primary)] opacity-40 blur-3xl"
      />
      <motion.div
        animate={{ x: ["20%", "-20%", "20%"], rotate: [0, -15, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 right-1/4 h-40 w-56 rounded-full bg-[var(--color-accent)] opacity-40 blur-3xl"
      />
    </div>
  );
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  delay: (i % 8) * 0.4,
  duration: 4 + (i % 5),
  size: 3 + (i % 3),
}));

function ParticleField() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-black">
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "-10%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          className="absolute rounded-full bg-[var(--color-primary)]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}

function PulsingGlow() {
  return (
    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-black">
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-24 w-24 rounded-full bg-[var(--color-primary)] blur-2xl"
      />
      <span className="relative z-10 text-sm font-medium text-white/80">Breathing glow</span>
    </div>
  );
}

function NoiseGrain() {
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-black">
      <div
        className="animate-noise-shift absolute -inset-full opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="absolute bottom-3 left-3 text-xs font-medium text-white/70">Film grain</span>
    </div>
  );
}

function MarqueeTicker() {
  const items = ["Design", "Robotics", "AI/ML", "UX", "Prototyping", "Motion"];
  return (
    <div className="w-full overflow-hidden">
      <div className="animate-marquee flex w-max gap-8">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="shrink-0 text-lg font-semibold whitespace-nowrap text-[var(--color-muted)]"
          >
            {item} ·
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AmbientBackgrounds() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Ambient backgrounds</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DemoCard name="Cursor Spotlight">
          <CursorSpotlight />
        </DemoCard>
        <DemoCard name="Floating Blobs">
          <FloatingBlobs />
        </DemoCard>
        <DemoCard name="Marquee Ticker" className="justify-start">
          <MarqueeTicker />
        </DemoCard>
        <DemoCard name="Aurora Wave">
          <AuroraWave />
        </DemoCard>
        <DemoCard name="Particle Field">
          <ParticleField />
        </DemoCard>
        <DemoCard name="Pulsing Glow">
          <PulsingGlow />
        </DemoCard>
        <DemoCard name="Noise Grain">
          <NoiseGrain />
        </DemoCard>
      </div>
    </section>
  );
}
