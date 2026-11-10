"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

type Props = { low: number; high: number; lowLabel: string; highLabel: string; title?: string; caption?: string };

// An illustrated (not recorded) score over time, as [time 0–100, score 0–1]:
// first a dip that stays between the two thresholds — no switch — then a
// real drop below the low line and a recovery past the high one.
const KEYPOINTS: [number, number][] = [
  [0, 0.82], [8, 0.8], [14, 0.62], [19, 0.46], [24, 0.52], [30, 0.8], [37, 0.84],
  [43, 0.68], [49, 0.3], [55, 0.17], [61, 0.24], [66, 0.44], [70, 0.52], [75, 0.7],
  [82, 0.84], [91, 0.86], [100, 0.82],
];

// Smooth curve through the keypoints (Catmull-Rom), sampled densely so the
// drawn line and the state switches below are computed from the same points.
function sampleCurve(points: [number, number][], perSegment = 16): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const at = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([at(p0[0], p1[0], p2[0], p3[0]), at(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

const SAMPLES = sampleCurve(KEYPOINTS);
// Score → SVG y (0 at top), leaving a little room above 1 and below 0.
const toY = (score: number) => 95 - score * 90;

// Schmitt trigger over the samples: starts in the high state, drops to low
// only below `low`, returns only above `high`. Returns the state segments as
// [from, to, isHigh] in time units (0–100).
function stateSegments(low: number, high: number): [number, number, boolean][] {
  const segments: [number, number, boolean][] = [];
  let isHigh = true;
  let start = 0;
  for (const [x, score] of SAMPLES) {
    const flip = isHigh ? score < low : score > high;
    if (flip) {
      segments.push([start, x, isHigh]);
      isHigh = !isHigh;
      start = x;
    }
  }
  segments.push([start, 100, isHigh]);
  return segments;
}

export default function ThresholdChart({ low, high, lowLabel, highLabel, title, caption }: Props) {
  const path = SAMPLES.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${toY(y).toFixed(2)}`).join(" ");
  const segments = stateSegments(low, high);
  // The section's one animated moment: once the chart is mostly on screen,
  // the score line draws left to right and the state bar fills in lockstep
  // (same clip, same timing). Reduced motion shows both at once.
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { once: true, amount: 0.6 });
  const drawClass = `transition-[clip-path] duration-[2400ms] ease-in-out motion-reduce:transition-none ${
    inView ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"
  }`;

  return (
    <figure ref={figureRef} className="rounded-xl bg-[var(--color-card)] p-5 sm:p-7">
      {title && <h3 className="mb-1.5 font-serif text-[19px] font-bold text-[var(--color-fg)]">{title}</h3>}
      {caption && (
        <figcaption className="mb-5 max-w-[65ch] text-[15px] leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}

      <div className="relative h-36">
        {/* Stretched to fill the box (non-scaling strokes keep lines crisp);
            text sits in HTML on top so it stays a readable size. */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <rect x={0} y={toY(high)} width={100} height={toY(low) - toY(high)} style={{ fill: "var(--color-surface)" }} />
          {[high, low].map((v) => (
            <line
              key={v}
              x1={0}
              x2={100}
              y1={toY(v)}
              y2={toY(v)}
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
              style={{ stroke: "var(--color-muted)", strokeWidth: 1.25 }}
            />
          ))}
        </svg>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`absolute inset-0 h-full w-full overflow-visible ${drawClass}`}
          aria-hidden
        >
          <path
            d={path}
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ stroke: "var(--color-fg)", strokeWidth: 2.5 }}
          />
        </svg>
        <span className="absolute top-0 left-0 text-[13px] text-[var(--color-muted)]">Focus score</span>
        <span
          className="absolute right-0 mb-1 -translate-y-full rounded bg-[var(--color-card)] px-1 text-[13px] text-[var(--color-fg)]"
          style={{ top: `${toY(high)}%` }}
        >
          <b className="tabular-nums">{high}</b>
          {/* Phones: just the number — the lead-in above spells it out */}
          <span className="hidden sm:inline"> back to {highLabel.toLowerCase()}</span>
        </span>
        <span
          className="absolute right-0 mt-1 rounded bg-[var(--color-card)] px-1 text-[13px] text-[var(--color-fg)]"
          style={{ top: `${toY(low)}%` }}
        >
          <b className="tabular-nums">{low}</b>
          <span className="hidden sm:inline"> switch to {lowLabel.toLowerCase()}</span>
        </span>
      </div>

      {/* The resulting state, lined up under the curve */}
      <div className={`mt-4 flex h-8 overflow-hidden rounded-full text-[11px] font-semibold sm:text-[13px] ${drawClass}`}>
        {segments.map(([from, to, isHigh]) => (
          <div
            key={from}
            className={`flex items-center justify-center ${
              isHigh
                ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                : "bg-[var(--color-accent)] text-[var(--color-on-accent)]"
            }`}
            style={{ width: `${to - from}%` }}
          >
            {isHigh ? highLabel : lowLabel}
          </div>
        ))}
      </div>
    </figure>
  );
}
