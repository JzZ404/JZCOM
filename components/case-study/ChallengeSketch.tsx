"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView } from "framer-motion";
import type { ChallengeSketchName } from "@/data/caseStudies";
import { inView, useHoverReplay } from "./researchMotion";

// Little technical drawings for PELICAN's challenges, one per problem. They
// only picture what each challenge's text says. Lines in the text color
// set the scene, and the robot's lid orange (as in the bottle detection)
// marks what went wrong. Each draws itself in the first time it scrolls
// into view, and again when hovered.

const LID = "#E35F07";

// One stroke that draws itself in after `delay` seconds. A dashed one fades
// in instead: drawing in works through the dash pattern, so it would come
// out solid.
function Line({ d, delay = 0, color = "currentColor", dashed = false, width = 1.6 }: {
  d: string;
  delay?: number;
  color?: string;
  dashed?: boolean;
  width?: number;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? "4 4" : undefined}
      initial={dashed ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
      whileInView={dashed ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
      viewport={inView}
      transition={
        dashed
          ? { delay, duration: 0.6 }
          : { pathLength: { delay, duration: 0.7, ease: "easeInOut" }, opacity: { delay, duration: 0.01 } }
      }
    />
  );
}

// Anything that simply fades in (fills, labels)
function Appear({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={inView} transition={{ delay, duration: 0.4 }}>
      {children}
    </motion.g>
  );
}

function Label({ x, y, children, color = "currentColor", anchor = "middle" }: {
  x: number;
  y: number;
  children: ReactNode;
  color?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fill={color} fontSize={12} fontWeight={600} textAnchor={anchor} style={{ fontFamily: "inherit" }}>
      {children}
    </text>
  );
}

// An arrow from (x1, y1) to (x2, y2): the shaft, then its head
function arrow(x1: number, y1: number, x2: number, y2: number) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (t: number) => `${x2 - 7 * Math.cos(a + t)} ${y2 - 7 * Math.sin(a + t)}`;
  return { shaft: `M${x1} ${y1} L${x2} ${y2}`, head: `M${head(0.45)} L${x2} ${y2} L${head(-0.45)}` };
}

function Arrow({ from, to, delay, color }: { from: [number, number]; to: [number, number]; delay: number; color?: string }) {
  const { shaft, head } = arrow(...from, ...to);
  return (
    <>
      <Line d={shaft} delay={delay} color={color} />
      <Line d={head} delay={delay + 0.55} color={color} />
    </>
  );
}

// Where the camera sits: its pivot on the robot's front corner. Angles are
// degrees above straight ahead.
const PIVOT = { x: 80, y: 82 };
const TILT = 45;
const HALF_FOV = 17;

// A point `dist` along `deg` (above horizontal) from (x, y)
const along = (x: number, y: number, deg: number, dist: number) => {
  const r = (deg * Math.PI) / 180;
  return [x + dist * Math.cos(r), y - dist * Math.sin(r)] as const;
};
const pt = ([x, y]: readonly [number, number]) => `${x.toFixed(1)} ${y.toFixed(1)}`;

// The camera body and its view cone at a tilt: a rigid turn about the pivot.
// The cone shortens as it tilts so it stays inside the drawing.
function cameraAt(deg: number) {
  const corner = (fx: number, fy: number) => {
    const r = (deg * Math.PI) / 180;
    return [PIVOT.x + fx * Math.cos(r) + fy * Math.sin(r), PIVOT.y - fx * Math.sin(r) + fy * Math.cos(r)] as const;
  };
  const lens = corner(10, 0);
  const reach = 140 - (deg / TILT) * 52;
  const top = along(...lens, deg + HALF_FOV, reach);
  const bottom = along(...lens, deg - HALF_FOV, reach);
  return {
    body: `M${pt(corner(-4, -5))} L${pt(corner(10, -5))} L${pt(corner(10, 5))} L${pt(corner(-4, 5))} Z`,
    edges: `M${pt(top)} L${pt(lens)} L${pt(bottom)}`,
    center: `M${pt(lens)} L${pt(along(...lens, deg, reach * 0.95))}`,
    cone: `M${pt(lens)} L${pt(top)} L${pt(bottom)} Z`,
    lens,
  };
}

// A water bottle standing at (x, y), its center
const bottle = (x: number, y: number) =>
  `M${x - 4.5} ${y + 10} L${x - 4.5} ${y - 3} Q${x - 4.5} ${y - 6.5} ${x - 2} ${y - 7.5} L${x - 2} ${y - 11} L${x + 2} ${y - 11} L${x + 2} ${y - 7.5} Q${x + 4.5} ${y - 6.5} ${x + 4.5} ${y - 3} L${x + 4.5} ${y + 10} Z`;

// A camera usually looks straight ahead (the grey dashed view). PELICAN's
// swings up 45°, its view sweeping up in orange, and that's where the
// bottle is, boxed like a detection.
function CameraTilt() {
  const ref = useRef<SVGGElement>(null);
  const seen = useInView(ref, inView);
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setDeg(TILT);
    const controls = animate(0, TILT, { delay: 1.3, duration: 1.1, ease: [0.65, 0, 0.35, 1], onUpdate: setDeg });
    return () => controls.stop();
  }, [seen]);

  const flat = cameraAt(0);
  const live = cameraAt(deg);
  const tilted = cameraAt(TILT);
  const [bx, by] = along(...tilted.lens, TILT, 60);
  // The orange view shows up as the camera starts to turn
  const sweep = Math.min(1, deg / 8);
  const arcStart = along(...flat.lens, 0, 26);
  const arcEnd = along(...flat.lens, TILT, 26);

  return (
    <g ref={ref}>
      <Line d="M10 128 L230 128" color="var(--color-border)" />
      <Line d="M20 120 L20 94 Q20 88 26 88 L72 88 Q78 88 78 94 L78 120" />
      <Line d="M34 124 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" delay={0.2} />
      <Line d="M66 124 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0" delay={0.2} />

      {/* The typical, straight-ahead view stays behind as a ghost */}
      <Line d={flat.edges} delay={0.55} dashed color="var(--color-muted)" />
      <Line d={flat.center} delay={0.55} dashed color="var(--color-muted)" width={1} />
      <Appear delay={0.9}>
        <Label x={230} y={101} color="var(--color-muted)" anchor="end">typical</Label>
      </Appear>

      <g opacity={sweep}>
        <path d={live.cone} fill={LID} opacity={0.13} />
        <path d={live.edges} fill="none" stroke={LID} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={live.center} fill="none" stroke={LID} strokeWidth={1} strokeDasharray="4 4" />
      </g>
      <Appear delay={0.35}>
        <path d={live.body} fill="var(--color-surface)" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      </Appear>

      {deg === TILT && (
        <>
          {/* The angle between the two center lines, its label in the
              clear space inside the typical view */}
          <Line d={`M${pt(arcStart)} A26 26 0 0 0 ${pt(arcEnd)}`} color={LID} width={1.3} />
          <Appear delay={0.2}>
            <Label x={flat.lens[0] + 31} y={flat.lens[1] + 12} color={LID} anchor="start">45°</Label>
          </Appear>
          <Line d={bottle(bx, by)} delay={0.3} />
          <motion.rect
            x={bx - 9}
            y={by - 15}
            width={18}
            height={29}
            rx={1.5}
            fill="none"
            stroke={LID}
            strokeWidth={1.5}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      )}
    </g>
  );
}

// Two step responses around the target: gains too high overshoot and
// oscillate; too low creep and never reach it
function Pid() {
  return (
    <>
      <Line d="M24 12 L24 132 L228 132" color="var(--color-border)" />
      <Line d="M24 52 L228 52" dashed color="var(--color-muted)" delay={0.2} />
      <Appear delay={0.5}>
        <Label x={228} y={44} color="var(--color-muted)" anchor="end">target</Label>
      </Appear>
      <Line
        d="M24 132 C40 60 46 22 58 22 C70 22 80 78 92 78 C104 78 112 38 124 38 C136 38 146 64 156 64 C166 64 176 46 188 46 C198 46 206 56 214 56 C220 56 224 53 228 52"
        color={LID}
        delay={0.5}
      />
      <Line d="M24 132 C80 130 140 100 228 80" delay={0.9} />
      <Appear delay={1.3}>
        <Label x={64} y={14} color={LID} anchor="start">oscillates</Label>
        <Label x={178} y={120}>too slow</Label>
      </Appear>
    </>
  );
}

// Wander → Track on a detection, with Avoid able to cut into either
function Priority() {
  const node = (x: number, y: number) => `M${x + 6} ${y} L${x + 64} ${y} Q${x + 70} ${y} ${x + 70} ${y + 6} L${x + 70} ${y + 22} Q${x + 70} ${y + 28} ${x + 64} ${y + 28} L${x + 6} ${y + 28} Q${x} ${y + 28} ${x} ${y + 22} L${x} ${y + 6} Q${x} ${y} ${x + 6} ${y}`;
  return (
    <>
      <Line d={node(16, 98)} />
      <Line d={node(154, 98)} delay={0.15} />
      <Line d={node(85, 16)} color={LID} delay={0.3} />
      <Appear delay={0.5}>
        <Label x={51} y={116}>Wander</Label>
        <Label x={189} y={116}>Track</Label>
        <Label x={120} y={34} color={LID}>Avoid</Label>
      </Appear>
      <Arrow from={[88, 112]} to={[150, 112]} delay={0.7} />
      <Appear delay={1}>
        <Label x={119} y={103} color="var(--color-muted)">detects</Label>
      </Appear>
      <Arrow from={[104, 46]} to={[66, 94]} delay={1.1} color={LID} />
      <Arrow from={[136, 46]} to={[174, 94]} delay={1.1} color={LID} />
      <Appear delay={1.6}>
        <Label x={120} y={74} color={LID}>interrupts</Label>
      </Appear>
    </>
  );
}

const SKETCHES: Record<ChallengeSketchName, () => ReactNode> = {
  "camera-tilt": CameraTilt,
  pid: Pid,
  priority: Priority,
};

export default function ChallengeSketch({ name }: { name: ChallengeSketchName }) {
  const Sketch = SKETCHES[name];
  const { replays, handlers } = useHoverReplay();
  return (
    <svg viewBox="0 0 240 140" aria-hidden className="block h-auto w-full overflow-visible text-[var(--color-fg)]" {...handlers}>
      <Sketch key={replays} />
    </svg>
  );
}
