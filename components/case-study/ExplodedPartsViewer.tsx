"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ExplodedCanvasSize, ExplodedPart } from "@/data/caseStudies";
import { canvasStyle, partStyle } from "./ExplodedCanvas";
import { partAt, useAlphaMaps } from "./explodedGeometry";

// The exploded view as the visitor sees it: hovering a part nudges it up;
// clicking lifts it out of the stack (the rest dim) with a card naming it.
// Clicking it again, empty space, or Escape puts it back. Each part is
// also a button, so Tab and Enter work too.
export default function ExplodedPartsViewer({ canvas, items }: { canvas: ExplodedCanvasSize; items: ExplodedPart[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const maps = useAlphaMaps(items);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const hit = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    const scale = canvas.w / rect.width;
    return partAt(items, maps.current, (e.clientX - rect.left) * scale, (e.clientY - rect.top) * scale);
  };

  return (
    <div
      ref={ref}
      className={`relative mx-auto w-full ${hovered !== null ? "cursor-pointer" : ""}`}
      style={canvasStyle(canvas)}
      onMouseMove={(e) => setHovered(hit(e))}
      onMouseLeave={() => setHovered(null)}
      // A real click (detail > 0) is hit-tested; a keyboard press on a
      // part's button arrives here with detail 0 and is handled by it
      onClick={(e) => {
        if (e.detail === 0) return;
        const i = hit(e);
        setSelected(i === selected ? null : i);
      }}
    >
      {items.map((part, i) => {
        const isSelected = i === selected;
        // Card above the part, or below it when the part is near the top;
        // pinned to the part's edge instead of centered near the sides
        const below = part.y < 110;
        const align = part.x + part.w / 2 < 100 ? "left" : part.x + part.w / 2 > canvas.w - 100 ? "right" : "center";
        return (
          <motion.button
            key={i}
            type="button"
            aria-label={part.detail ? `${part.name}: ${part.detail}` : part.name}
            aria-pressed={isSelected}
            onClick={(e) => {
              if (e.detail !== 0) return;
              e.stopPropagation();
              setSelected(isSelected ? null : i);
            }}
            // Clicks go to the canvas (it knows which pixels are solid)
            className="pointer-events-none absolute block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"
            style={{ ...partStyle(part, canvas, false), zIndex: isSelected ? 50 : undefined }}
            animate={{
              y: isSelected ? -14 : i === hovered && selected === null ? -4 : 0,
              opacity: selected === null || isSelected ? 1 : 0.4,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            <motion.img
              src={part.src}
              alt=""
              draggable={false}
              className="block h-auto w-full"
              style={{ transform: `rotate(${part.rotate ?? 0}deg) scaleX(${part.flip ? -1 : 1})` }}
              animate={{
                filter: isSelected
                  ? "drop-shadow(0px 16px 12px rgba(0,0,0,0.28))"
                  : "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
              }}
              transition={{ duration: 0.25 }}
            />
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  role="status"
                  className={`absolute w-max max-w-[15rem] rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2.5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${
                    below ? "top-full mt-3" : "bottom-full mb-3"
                  } ${align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                  style={{ transformOrigin: below ? "50% 0%" : "50% 100%" }}
                  initial={{ opacity: 0, scale: 0.9, y: below ? -6 : 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: below ? -6 : 6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <span className="block text-[14px] leading-snug font-semibold text-[var(--color-fg)]">{part.name}</span>
                  {part.detail && (
                    <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--color-muted)]">{part.detail}</span>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
