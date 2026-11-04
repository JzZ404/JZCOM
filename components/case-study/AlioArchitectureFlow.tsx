"use client";

import { Fragment, useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AlioFlowNode, AlioFlowStep } from "@/data/caseStudies";
import type { IconName } from "@/components/icons";
import { IconGlyph } from "./IconBadge";

// The architecture flowchart, rebuilt from Alio's original diagram: one lane
// per portal, read top to bottom, with indigo arrows across the gap wherever
// the two portals touch. Lanes and boxes are light in both site themes (like
// the original), so their colors are set explicitly.
const LINE = "#8A909A";
const NODE_TEXT = "#2B2F36";
const CROSS = "#5B5BD6";
const AI = { bg: "#EEE8FF", border: "#8B5CF6", text: "#3B1D8F", icon: "#7C3AED" };
const TONES = {
  caregiver: { bg: "#EAF4FD", border: "#B6DBF7", title: "#1E4E79", accent: "#2F7FC1" },
  family: { bg: "#EAF7EC", border: "#B9E2BF", title: "#24613A", accent: "#3A9A55" },
};

type Lane = { title: string; icon: IconName; tone: keyof typeof TONES; steps: AlioFlowStep[] };
type Register = (id: string | undefined, el: HTMLElement | null) => void;

export default function AlioArchitectureFlow({
  lanes,
  crossLinks,
}: {
  lanes: Lane[];
  crossLinks: { from: string; to: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const laneRefs = useRef<(HTMLElement | null)[]>([]);
  const nodeEls = useRef(new Map<string, HTMLElement>());
  const register = useCallback<Register>((id, el) => {
    if (!id) return;
    if (el) nodeEls.current.set(id, el);
    else nodeEls.current.delete(id);
  }, []);
  const [links, setLinks] = useState<{ d: string; head: string }[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // The cross-portal arrows are drawn from the boxes' measured positions, so
  // they stay attached however the lanes reflow. Each leaves its box toward
  // the other lane, runs along the gap between the lanes, and turns into the
  // target box (rounded corners, like the original diagram's connectors).
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const c = container.getBoundingClientRect();
      const [left, right] = laneRefs.current.map((l) => l?.getBoundingClientRect());
      if (!left || !right) return;
      const gap = (left.right + right.left) / 2 - c.left;
      setBox({ w: c.width, h: c.height });
      setLinks(
        crossLinks.map((link, i) => {
          const a = nodeEls.current.get(link.from)?.getBoundingClientRect();
          const b = nodeEls.current.get(link.to)?.getBoundingClientRect();
          if (!a || !b) return { d: "", head: "" };
          const rightward = a.left < b.left;
          const dir = rightward ? 1 : -1;
          const sx = (rightward ? a.right : a.left) - c.left + dir * 3;
          const sy = a.top + a.height / 2 - c.top;
          const tx = (rightward ? b.left : b.right) - c.left - dir * 4;
          const ty = b.top + b.height / 2 - c.top;
          // Spread the vertical runs a little so arrows sharing the gap don't overlap
          const gx = gap + (i - (crossLinks.length - 1) / 2) * 7;
          return {
            d: orthogonalPath(sx, sy, gx, tx, ty),
            head: `M${tx - dir * 6},${ty - 4.5} L${tx},${ty} L${tx - dir * 6},${ty + 4.5}`,
          };
        }),
      );
    };
    const frame = requestAnimationFrame(measure);
    const resize = new ResizeObserver(() => measure());
    resize.observe(container);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, [crossLinks]);

  return (
    <div className="overflow-x-auto pb-1">
      <motion.div
        ref={containerRef}
        className="relative grid min-w-[460px] grid-cols-[1fr_2rem_1fr]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {lanes.map((lane, i) => (
          <LaneColumn
            key={lane.title}
            lane={lane}
            register={register}
            laneRef={(el) => {
              laneRefs.current[i] = el;
            }}
            column={i === 0 ? "col-start-1" : "col-start-3"}
          />
        ))}

        {/* Cross-portal arrows, drawn in once the chart is on screen */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-10" width={box.w} height={box.h}>
          {links.map((link, i) =>
            link.d ? (
              <g key={i}>
                <motion.path
                  d={link.d}
                  fill="none"
                  stroke={CROSS}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.3, ease: "easeInOut" }}
                />
                <motion.path
                  d={link.head}
                  fill="none"
                  stroke={CROSS}
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 1.25 + i * 0.3 }}
                />
              </g>
            ) : null,
          )}
        </svg>
      </motion.div>
    </div>
  );
}

// Out from the source, along the gap (x = gx), into the target — with
// rounded corners where it turns.
function orthogonalPath(sx: number, sy: number, gx: number, tx: number, ty: number) {
  const dy = ty - sy;
  if (Math.abs(dy) < 1) return `M${sx},${sy} H${tx}`;
  const r = Math.min(10, Math.abs(dy) / 2, Math.abs(gx - sx), Math.abs(tx - gx));
  const yDir = Math.sign(dy);
  const in1 = Math.sign(gx - sx);
  const out1 = Math.sign(tx - gx);
  return [
    `M${sx},${sy}`,
    `H${gx - in1 * r}`,
    `Q${gx},${sy} ${gx},${sy + yDir * r}`,
    `V${ty - yDir * r}`,
    `Q${gx},${ty} ${gx + out1 * r},${ty}`,
    `H${tx}`,
  ].join(" ");
}

function LaneColumn({
  lane,
  register,
  laneRef,
  column,
}: {
  lane: Lane;
  register: Register;
  laneRef: (el: HTMLElement | null) => void;
  column: string;
}) {
  const tone = TONES[lane.tone];
  return (
    <section
      ref={laneRef}
      className={`row-start-1 flex flex-col rounded-2xl border-[1.5px] px-2.5 pt-3 pb-5 ${column}`}
      style={{ background: tone.bg, borderColor: tone.border }}
      aria-label={lane.title}
    >
      <h3
        className="mb-3.5 flex items-center justify-center gap-1.5 border-b pb-2.5 font-serif text-[16px] font-bold"
        style={{ color: tone.title, borderColor: tone.border }}
      >
        <IconGlyph name={lane.icon} className="h-4 w-4" style={{ color: tone.accent }} />
        {lane.title}
      </h3>

      <div className="flex flex-col items-center">
        {lane.steps.map((step, i) => {
          const previous = lane.steps[i - 1];
          // A new, separate flow in the lane: a gap instead of an arrow
          const startsFlow = i > 0 && step.start;
          return (
            <Fragment key={i}>
              {startsFlow && <span className="h-7" />}
              {"node" in step ? (
                <>
                  {i > 0 && !startsFlow && <Arrow label={step.note} />}
                  <FlowBox node={step.node} register={register} />
                </>
              ) : (
                <Fork
                  step={step}
                  register={register}
                  connectFromAbove={i > 0 && !startsFlow && !(previous && "paths" in previous)}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

// Parallel paths: a stub down from the step above, a bar across the paths'
// centers, an arrow into each path — and with `merge`, each path's line runs
// to the bottom (so shorter paths still reach it) and a second bar joins them.
function Fork({
  step,
  register,
  connectFromAbove,
}: {
  step: Extract<AlioFlowStep, { paths: unknown }>;
  register: Register;
  connectFromAbove: boolean;
}) {
  const n = step.paths.length;
  const inset = `${50 / n}%`;
  return (
    <>
      {connectFromAbove && <span className="h-3.5" style={{ width: 1.5, background: LINE }} />}
      <div className="relative grid w-full" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        <span className="absolute top-0" style={{ left: inset, right: inset, height: 1.5, background: LINE }} />
        {step.paths.map((path, p) => (
          <div key={p} className="flex flex-col items-center px-0.5">
            <Arrow label={path.label} />
            {path.nodes.map((node, j) => (
              <Fragment key={j}>
                {j > 0 && <Arrow />}
                {/* The paths' columns are equal widths, so filling them makes
                    side-by-side choices (e.g. No / Yes) the same size */}
                <FlowBox node={node} register={register} fill />
              </Fragment>
            ))}
            {step.merge && <span className="min-h-3.5 flex-1" style={{ width: 1.5, background: LINE }} />}
          </div>
        ))}
        {step.merge && (
          <span className="absolute bottom-0" style={{ left: inset, right: inset, height: 1.5, background: LINE }} />
        )}
      </div>
    </>
  );
}

function FlowBox({ node, register, fill }: { node: AlioFlowNode; register: Register; fill?: boolean }) {
  const ref = (el: HTMLDivElement | null) => register(node.id, el);
  if (node.kind === "ai") {
    return (
      <div
        ref={ref}
        className="w-full max-w-[13rem] rounded-xl border-[1.5px] px-2.5 py-1.5 text-center text-[11.5px] leading-snug shadow-[0_4px_14px_rgba(124,58,237,0.15)]"
        style={{ background: AI.bg, borderColor: AI.border, color: AI.text }}
      >
        {/* Icon inline with the text, so in a narrow box it wraps along
            with the first word instead of floating beside the label */}
        <div className="font-bold">
          <Sparkles
            aria-hidden
            className="mr-1 inline h-3 w-3 -translate-y-px align-middle"
            style={{ color: AI.icon }}
            strokeWidth={2.25}
          />
          {node.label}
        </div>
        {node.detail && <div className="mt-0.5">{node.detail}</div>}
      </div>
    );
  }
  const shape =
    node.kind === "action" ? "rounded-full px-3" : node.kind === "decision" ? "rounded-xl border-dashed px-2.5" : "rounded-md px-3";
  // Boxes that send or receive across portals get the cross-arrow indigo
  const touchPoint = Boolean(node.id);
  return (
    <div
      ref={ref}
      className={`border-[1.5px] bg-white py-1 text-center text-[11.5px] leading-snug ${fill ? "w-full" : "max-w-[12rem]"} ${shape} ${
        touchPoint ? "shadow-[0_0_0_3px_rgba(91,91,214,0.12)]" : ""
      }`}
      style={{ borderColor: touchPoint ? CROSS : LINE, color: NODE_TEXT }}
    >
      {node.label}
    </div>
  );
}

// A short down arrow between boxes, with an optional label on it
function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center" aria-hidden={!label}>
      <span className="h-2" style={{ width: 1.5, background: LINE }} />
      {label && (
        <>
          <span className="py-0.5 text-[10.5px] font-medium" style={{ color: "#5E6470" }}>
            {label}
          </span>
          <span className="h-1.5" style={{ width: 1.5, background: LINE }} />
        </>
      )}
      <svg viewBox="0 0 10 7" className="h-[7px] w-2.5" fill="none" stroke={LINE} strokeWidth={1.5}>
        <path d="M1 1l4 4.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
