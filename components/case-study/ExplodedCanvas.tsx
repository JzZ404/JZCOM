"use client";

import type { CSSProperties, PointerEvent } from "react";
import type { ExplodedCanvasSize, ExplodedPart } from "@/data/caseStudies";

// Where a part sits on the canvas, in percentages so the whole view scales
// with the column; `turned` adds its rotation and flip
export function partStyle(part: ExplodedPart, canvas: ExplodedCanvasSize, turned = true): CSSProperties {
  return {
    left: `${(part.x / canvas.w) * 100}%`,
    top: `${(part.y / canvas.h) * 100}%`,
    width: `${(part.w / canvas.w) * 100}%`,
    ...(turned && { transform: `rotate(${part.rotate ?? 0}deg) scaleX(${part.flip ? -1 : 1})` }),
  };
}

// The canvas box: the drawing's aspect ratio, never wider than its own
// units (the part images would start to blur)
export function canvasStyle(canvas: ExplodedCanvasSize): CSSProperties {
  return { aspectRatio: `${canvas.w} / ${canvas.h}`, maxWidth: canvas.w };
}

// The layout editor's canvas: every part draggable, the selected one
// outlined
export default function ExplodedCanvas({
  canvas,
  items,
  selected,
  onPartPointerDown,
}: {
  canvas: ExplodedCanvasSize;
  items: ExplodedPart[];
  selected: number;
  onPartPointerDown: (index: number, event: PointerEvent<HTMLImageElement>) => void;
}) {
  return (
    <div className="relative mx-auto w-full touch-none select-none outline-1 outline-[var(--color-border)] outline-dashed" style={canvasStyle(canvas)}>
      {items.map((part, i) => (
        <img
          key={i}
          src={part.src}
          alt={part.name}
          draggable={false}
          onPointerDown={(e) => onPartPointerDown(i, e)}
          className={`absolute h-auto cursor-grab active:cursor-grabbing ${
            i === selected ? "outline-2 outline-offset-2 outline-[var(--color-primary)] outline-dashed" : ""
          }`}
          style={partStyle(part, canvas)}
        />
      ))}
    </div>
  );
}
