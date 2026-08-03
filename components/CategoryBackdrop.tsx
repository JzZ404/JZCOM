"use client";

import { motion } from "framer-motion";
import type { ProjectCategory } from "@/data/projects";

// Each Work category gets a visually distinct decorative backdrop — organic
// blur for UX, a code texture for AI, a Jarvis-style HUD ring for Robotics —
// so scrolling between sections reads as moving between distinct "spaces".
// Built entirely from the site's existing primary/accent/fg tokens via
// color-mix; no new colors introduced ahead of the final palette.
const BACKDROP_STYLE: Partial<Record<ProjectCategory, React.CSSProperties>> = {
  ux: {
    backgroundImage:
      "radial-gradient(circle at 18% 25%, color-mix(in srgb, var(--color-accent) 30%, transparent) 0%, transparent 55%), radial-gradient(circle at 82% 75%, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 55%)",
    filter: "blur(50px)",
  },
};

// Cheap deterministic pseudo-random in [0, 1) — same seed always produces
// the same value, so server and client render identical output (a real
// Math.random() here would mismatch between SSR and hydration).
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Wrapped lines of binary/hash "code", like the reference photo — each
// row's WIDTH (not its text) varies to trace a cloud silhouette (narrow top,
// wide middle, tapering to a point at the bottom, like a speech bubble).
// Each row's text is a fixed sequence — it doesn't scramble character by
// character, it scrolls continuously left or right at its own speed, so the
// "randomizing" reads as motion instead of flicker. Dense characters
// (#, @, 0, 1) up top fading to lighter ones (-, +, =, %) toward the bottom
// mirrors the reference's solid-to-faded gradient.
const DENSE_CHARS = ["#", "@", "0", "1"];
const LIGHT_CHARS = ["%", "=", "+", "-", ":", ".", "*"];
const ROW_WIDTH_PROFILE = [
  110, 170, 220, 250, 260, 260, 240, 250, 190, 180, 150, 120, 80,
];
const ROW_TEXT_LENGTH = 60; // long enough to fill even the widest row twice over

function buildRowText(rowIndex: number, rowCount: number): string {
  const rowFrac = rowIndex / (rowCount - 1);
  let s = "";
  for (let i = 0; i < ROW_TEXT_LENGTH; i++) {
    const seed = rowIndex * 1000 + i;
    const pool = pseudoRandom(seed) < rowFrac * 0.85 + 0.05 ? LIGHT_CHARS : DENSE_CHARS;
    s += pool[Math.floor(pseudoRandom(seed + 0.5) * pool.length)];
  }
  return s;
}

// One cloud = one set of rows, offset/scaled from the shared width profile
// so multiple clouds don't look identical.
function CodeCloud({ seedOffset, scale }: { seedOffset: number; scale: number }) {
  const rowCount = ROW_WIDTH_PROFILE.length;
  return (
    <div className="font-mono text-[11px] leading-[1.6] text-[var(--color-primary)] opacity-25">
      {ROW_WIDTH_PROFILE.map((width, i) => {
        const seed = seedOffset + i;
        const text = buildRowText(i + seedOffset, rowCount);
        // Alternating direction per row ("rolling left or right"), each at
        // its own speed — reusing the site's existing marquee keyframes.
        const reverse = i % 2 === 0;
        const duration = round(9 + pseudoRandom(seed + 2.5) * 10, 2);
        return (
          <div
            key={i}
            className="overflow-hidden whitespace-nowrap"
            style={{ width: width * scale, marginLeft: pseudoRandom(seed + 3.5) * 10 * scale }}
          >
            <div
              className="inline-block"
              style={{
                animation: `${reverse ? "marquee-reverse" : "marquee"} ${duration}s linear infinite`,
              }}
            >
              {text}
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function round(n: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

// Two clouds, positioned in the row's actual side-margin gutters (not
// literally at 0%/100%, which risks a sliver getting clipped by the row's
// own overflow-hidden) — NOT centered on the row overall, since the middle
// is where the cards themselves sit and a cloud placed there would just
// render invisibly behind them.
function CodeBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute top-[6%] left-[5%]">
        <CodeCloud seedOffset={0} scale={1} />
      </div>
      <div className="absolute right-[6%] bottom-[10%]">
        <CodeCloud seedOffset={97} scale={0.8} />
      </div>
    </div>
  );
}

// Jarvis/arc-reactor style HUD — several small reference-inspired widgets
// (a rotating tick ring, a smaller secondary dial, a target-lock corner
// bracket, a tick-mark scale bar) scattered around the row like the
// reference dashboards, all quite faint since it's just a backdrop.
function HudRing({
  size,
  lineLength,
  angles,
}: {
  size: number;
  lineLength: number;
  angles: number[];
}) {
  return (
    <div className="relative" style={{ height: size, width: size }}>
      <div
        className="animate-hud-spin absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(color-mix(in srgb, var(--color-primary) 70%, transparent) 0deg 1.5deg, transparent 1.5deg 9deg)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 65%, black 66%, black 72%, transparent 73%)",
          maskImage:
            "radial-gradient(circle, transparent 65%, black 66%, black 72%, transparent 73%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: size * 0.1,
          border: "1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: size * 0.22,
          border: "1px solid color-mix(in srgb, var(--color-accent) 55%, transparent)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "var(--color-primary)",
          boxShadow: "0 0 18px 4px color-mix(in srgb, var(--color-primary) 55%, transparent)",
        }}
      />
      {angles.map((angle) => (
        <div
          key={angle}
          className="absolute top-1/2 left-1/2 h-px origin-left"
          style={{
            width: lineLength,
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--color-fg) 35%, transparent), transparent)",
            transform: `rotate(${angle}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Target-lock reticle — 4 L-shaped corner marks framing a box, common
// sci-fi HUD "tracking" motif.
function CornerBrackets({ size }: { size: number }) {
  const corner = size * 0.22;
  const positions = [
    { top: 0, left: 0, borderWidth: "2px 0 0 2px" },
    { top: 0, right: 0, borderWidth: "2px 2px 0 0" },
    { bottom: 0, left: 0, borderWidth: "0 0 2px 2px" },
    { bottom: 0, right: 0, borderWidth: "0 2px 2px 0" },
  ];
  return (
    <div className="relative" style={{ height: size, width: size }}>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...pos,
            height: corner,
            width: corner,
            borderStyle: "solid",
            borderColor: "color-mix(in srgb, var(--color-primary) 55%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

// Small horizontal tick-mark scale, like the reference's ruler/progress bars.
function TickBar({ width }: { width: number }) {
  const ticks = 14;
  return (
    <div className="flex items-end" style={{ width, gap: width / ticks / 2 }}>
      {Array.from({ length: ticks }).map((_, i) => (
        <div
          key={i}
          style={{
            height: i % 4 === 0 ? 10 : 5,
            width: 1,
            background: "color-mix(in srgb, var(--color-fg) 45%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

// All four widgets sit in the row's side-margin gutters (small buffer off
// the literal 0%/100% edge to avoid the row's own overflow-hidden clipping
// a sliver) — not the row's overall center, since that's where the cards
// themselves are and a widget placed there just renders behind them.
function HudBackdrop() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-1/2 right-[5%] -translate-y-1/2">
        <HudRing size={200} lineLength={100} angles={[-35, 25, 100, 200]} />
      </div>
      <div className="absolute top-[8%] left-[5%]">
        <HudRing size={90} lineLength={50} angles={[40, 160]} />
      </div>
      <div className="absolute bottom-[10%] right-[6%]">
        <CornerBrackets size={110} />
      </div>
      <div className="absolute bottom-[8%] left-[6%]">
        <TickBar width={130} />
      </div>
    </div>
  );
}

export default function CategoryBackdrop({ category }: { category: ProjectCategory }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10"
      style={category === "ux" ? BACKDROP_STYLE[category] : undefined}
    >
      {category === "ai" && <CodeBackdrop />}
      {category === "robotics" && <HudBackdrop />}
    </motion.div>
  );
}
