"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AlioWordmark from "./AlioWordmark";

// Alio's indigo family. The chart panel stays light in both site themes, so
// every color inside it is set explicitly.
const PANEL_BG = "#FAFAFE";
const PANEL_BORDER = "#E4E5F7";
const AXIS = "#8A8DA6";
const INK = "#1E1B4B";
const MUTED = "#5B5E80";
const INDIGO = "#4F46E5";

type Point = { name: string; x: number; y: number; highlight?: boolean };
type Props = {
  xAxis: [string, string];
  yAxis: [string, string];
  opportunity: { label: string; x: [number, number]; y: [number, number] };
  points: Point[];
  // Shown in a tooltip when a point is hovered, focused, or tapped
  descriptions: Record<string, string>;
};

// Data space (-1…1 on both axes) → % of the plot box. The plot keeps a margin
// inside the panel so labels near the edges still fit.
const toLeft = (x: number) => 50 + x * 44;
const toTop = (y: number) => 50 - y * 42;

// A two-axis positioning map: competitors as neutral dots, Alio as the
// highlighted one inside the opportunity area. On scroll-in the opportunity
// area fades in, then the dots pop in one by one, Alio last.
export default function AlioPositioningMap({ xAxis, yAxis, opportunity, points, descriptions }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const others = points.filter((p) => !p.highlight);
  const ordered = [...others, ...points.filter((p) => p.highlight)];

  const opp = {
    left: toLeft(opportunity.x[0]),
    right: 100 - toLeft(opportunity.x[1]),
    top: toTop(opportunity.y[1]),
    bottom: 100 - toTop(opportunity.y[0]),
  };

  return (
    <motion.div
      // From laptop width up it takes the height of the table beside it
      // (lg:h-full); narrower, it keeps its own proportions.
      className="relative mx-auto aspect-[4/5] w-full max-w-[860px] rounded-2xl border sm:aspect-[4/3] lg:aspect-auto lg:h-full"
      style={{ background: PANEL_BG, borderColor: PANEL_BORDER }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
      onMouseLeave={() => setActive(null)}
    >
      {/* Opportunity area */}
      <motion.div
        className="absolute flex items-end justify-center rounded-xl border border-dashed pb-3"
        style={{ ...pct(opp), borderColor: "#B9BCF2", background: "rgba(99, 102, 241, 0.07)" }}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.6 } } }}
      >
        <span className="text-[12px] font-medium" style={{ color: "#6A6DC9" }}>
          {opportunity.label}
        </span>
      </motion.div>

      {/* Axes, arrowheads at both ends */}
      <Axis orientation="x" />
      <Axis orientation="y" />
      <span className="absolute top-[calc(50%+10px)] left-3 text-[11px] font-medium sm:left-4 sm:text-[12px]" style={{ color: MUTED }}>
        {xAxis[0]}
      </span>
      <span className="absolute top-[calc(50%+10px)] right-3 text-right text-[11px] font-medium sm:right-4 sm:text-[12px]" style={{ color: MUTED }}>
        {xAxis[1]}
      </span>
      <span className="absolute top-2.5 left-[calc(50%+10px)] text-[11px] font-medium sm:text-[12px]" style={{ color: MUTED }}>
        {yAxis[1]}
      </span>
      <span className="absolute bottom-2.5 left-[calc(50%+10px)] text-[11px] font-medium sm:text-[12px]" style={{ color: MUTED }}>
        {yAxis[0]}
      </span>

      {ordered.map((point, i) => {
        const left = toLeft(point.x);
        const top = toTop(point.y);
        const description = descriptions[point.name];
        const isActive = active === point.name;
        return (
          <motion.div
            key={point.name}
            // Centered on the point: the dot sits right above the middle of its name
            className="absolute -translate-x-1/2 -translate-y-[9px]"
            style={{ left: `${left}%`, top: `${top}%`, zIndex: isActive ? 20 : point.highlight ? 10 : 1 }}
            variants={{
              hidden: { opacity: 0, scale: 0.4 },
              shown: {
                opacity: 1,
                scale: 1,
                transition: { delay: 0.35 + i * 0.09 + (point.highlight ? 0.25 : 0), type: "spring", stiffness: 320, damping: 18 },
              },
            }}
          >
            <button
              type="button"
              className="group flex flex-col items-center gap-1 rounded-lg outline-offset-4"
              onMouseEnter={() => setActive(point.name)}
              onFocus={() => setActive(point.name)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(isActive ? null : point.name)}
              aria-label={description ? `${point.name}: ${description}` : point.name}
            >
              {/* The dot, with its description card centered above it */}
              <span className="relative flex">
                {point.highlight ? (
                  <span className="relative flex h-[22px] w-[22px] items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full motion-safe:animate-ping"
                      style={{ background: INDIGO, opacity: 0.25 }}
                    />
                    <span
                      className="relative h-[22px] w-[22px] rounded-full border-2"
                      style={{ background: "#E0E1FF", borderColor: INDIGO }}
                    />
                  </span>
                ) : (
                  <span
                    className="h-[18px] w-[18px] rounded-full border-[1.5px] transition-transform group-hover:scale-110"
                    style={{ background: "#EFEDE6", borderColor: "#9A9AA0" }}
                  />
                )}
                <AnimatePresence>
                  {description && isActive && (
                    <motion.span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 w-56 -translate-x-1/2 rounded-xl px-3.5 py-2.5 text-left text-[12.5px] leading-snug text-white shadow-[0_10px_30px_rgba(30,27,75,0.3)]"
                      style={{ background: INK, transformOrigin: "50% 100%" }}
                      initial={{ opacity: 0, y: 6, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <span className="mb-0.5 block text-[13px] font-semibold">{point.name}</span>
                      {description}
                      {/* Pointer down to the dot */}
                      <span
                        aria-hidden
                        className="absolute top-full left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
                        style={{ background: INK }}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {point.highlight ? (
                // Alio's own point carries its logo instead of a plain name. The
                // left padding matches the coral dot's width on the right, so the
                // letters themselves sit centered under the circle.
                <AlioWordmark className="mt-0.5 pl-[0.24em] text-[19px] sm:text-[21px]" />
              ) : (
                <span
                  // The panel color behind the name, so where a name reaches an
                  // axis the line passes behind the text instead of through it
                  className="rounded px-1 text-[12px] leading-tight font-medium whitespace-nowrap sm:text-[13.5px]"
                  style={{ color: INK, background: PANEL_BG }}
                >
                  {point.name}
                </span>
              )}
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// One axis through the center of the plot, with an arrowhead at each end
function Axis({ orientation }: { orientation: "x" | "y" }) {
  const horizontal = orientation === "x";
  const heads = horizontal
    ? [
        { className: "right-0 top-0 -translate-y-1/2", rotate: 0 },
        { className: "left-0 top-0 -translate-y-1/2", rotate: 180 },
      ]
    : [
        { className: "top-0 left-0 -translate-x-1/2", rotate: -90 },
        { className: "bottom-0 left-0 -translate-x-1/2", rotate: 90 },
      ];
  return (
    <div aria-hidden className={horizontal ? "absolute top-1/2 right-2 left-2 h-0" : "absolute top-2 bottom-2 left-1/2 w-0"}>
      <span
        className={horizontal ? "absolute inset-x-0 top-0 -translate-y-1/2" : "absolute inset-y-0 left-0 -translate-x-1/2"}
        style={horizontal ? { height: 1.5, background: AXIS } : { width: 1.5, background: AXIS }}
      />
      {heads.map((head) => (
        <svg
          key={head.rotate}
          viewBox="0 0 10 10"
          className={`absolute h-2.5 w-2.5 ${head.className}`}
          fill="none"
          stroke={AXIS}
          strokeWidth={1.5}
        >
          <path d="M3 1l5 4-5 4" strokeLinecap="round" strokeLinejoin="round" transform={`rotate(${head.rotate} 5 5)`} />
        </svg>
      ))}
    </div>
  );
}

const pct = ({ left, right, top, bottom }: { left: number; right: number; top: number; bottom: number }) => ({
  left: `${left}%`,
  right: `${right}%`,
  top: `${top}%`,
  bottom: `${bottom}%`,
});
