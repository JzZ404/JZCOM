"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { framesOn, LAYERS, WALK_FRAME_MS, WALK_FRAMES, WALK_H, WALK_W, bottomFor, type Layer, type Step } from "./clips";

const SHADOW = "drop-shadow-[0px_6px_14px_rgba(0,0,0,0.18)]";
const LAYER_FRAMES = Object.fromEntries((Object.keys(LAYERS) as Layer[]).map((l) => [l, framesOn(l)])) as Record<Layer, string[]>;

// A stack of poses at one position; all stay mounted (already decoded) and
// only which one is visible changes, so a cut never shows a blank frame.
function FrameStack({ layer, active, breathe }: { layer: Layer; active: string | null; breathe: boolean }) {
  const { right, bottom, width, height } = LAYERS[layer];
  return (
    <motion.div
      className="absolute origin-bottom"
      style={{ right, bottom, width, height, opacity: active ? 1 : 0 }}
      // Sleeping: a slow ~2% rise and fall so she doesn't look frozen.
      animate={breathe ? { scaleY: [1, 1.025, 1], scaleX: [1, 1.01, 1] } : { scaleY: 1, scaleX: 1 }}
      transition={breathe ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
    >
      {LAYER_FRAMES[layer].map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full ${SHADOW} ${src === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </motion.div>
  );
}

export type WalkProps = { from: number; to: number; seconds: number; facingLeft?: boolean; onDone?: () => void };

// Walking: frames cycle on a timer while a CSS transform animation moves her
// (compositor-driven, so it keeps pace even when the page is busy). `from` /
// `to` are the walk frame's left edge in px. Facing left mirrors the image
// only — the moving box isn't flipped, so the direction of travel isn't either.
function Walker({ from, to, seconds, facingLeft, onDone }: WalkProps) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    WALK_FRAMES.forEach((src) => {
      new Image().src = src;
    });
    const timer = setInterval(() => setFrame((i) => (i + 1) % WALK_FRAMES.length), WALK_FRAME_MS);
    return () => clearInterval(timer);
  }, []);
  return (
    <div
      className="absolute left-0"
      onAnimationEnd={onDone}
      style={
        {
          width: WALK_W,
          height: WALK_H,
          bottom: bottomFor(WALK_H, 0.94),
          "--walk-from": `${from}px`,
          "--walk-to": `${to}px`,
          animation: `cat-walk-in ${seconds}s linear forwards`,
        } as React.CSSProperties
      }
    >
      <img
        src={WALK_FRAMES[frame]}
        alt=""
        className={`h-full w-full ${SHADOW}`}
        style={facingLeft ? { transform: "scaleX(-1)" } : undefined}
      />
    </div>
  );
}

export default function NomiSprite({
  step,
  walk,
}: {
  step: Step | null; // null while walking in (or before anything's decided)
  walk: (WalkProps & { id: string }) | null;
}) {
  return (
    <>
      {/* keyed so each walk restarts its movement animation */}
      {walk && <Walker key={walk.id} {...walk} />}
      {(Object.keys(LAYERS) as Layer[]).map((layer) => (
        <FrameStack
          key={layer}
          layer={layer}
          active={step?.layer === layer ? step.src : null}
          breathe={step?.layer === layer && !!step.breathe}
        />
      ))}
    </>
  );
}
