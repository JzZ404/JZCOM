"use client";

import { motion, useMotionTemplate, useSpring } from "framer-motion";

// A sticky note with its bottom-right corner peeled up. The note is cut along
// the fold (clip-path), and the flap — the paper's underside, a darker shade
// lit toward its tip — lies folded back over it. Hovering peels the corner
// further, lifts the note, and straightens it a little; the drop-shadow sits
// on an unclipped wrapper so it follows the cut corner like real paper.
const FOLD_REST = 40;
const FOLD_HOVER = 76;

export default function StickyNote({
  text,
  bg,
  fold,
  rotate,
}: {
  text: string;
  bg: string;
  fold: string;
  rotate: number;
}) {
  const size = useSpring(FOLD_REST, { stiffness: 260, damping: 20 });
  const noteClip = useMotionTemplate`polygon(0 0, 100% 0, 100% calc(100% - ${size}px), calc(100% - ${size}px) 100%, 0 100%)`;

  return (
    <motion.div
      className="relative h-56 w-64 shrink-0"
      style={{ rotate, filter: "drop-shadow(6px 12px 12px rgba(0,0,0,0.28))" }}
      whileHover={{ y: -8, rotate: rotate * 0.35 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onHoverStart={() => size.set(FOLD_HOVER)}
      onHoverEnd={() => size.set(FOLD_REST)}
    >
      <motion.div
        className="relative flex h-full w-full items-center justify-center rounded-sm p-7"
        style={{ backgroundColor: bg, clipPath: noteClip }}
      >
        <p className="text-center text-[16px] leading-snug font-semibold text-[#1a1f16]">{text}</p>

        {/* The folded-back flap: a shadow wrapper around a triangle (the
            shadow has to sit outside the triangle's own clip-path) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0"
          style={{ width: size, height: size, filter: "drop-shadow(-2px -3px 3px rgba(0,0,0,0.3))" }}
        >
          <div
            className="h-full w-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              // Darker at the crease, catching light toward the tip
              background: `linear-gradient(to top left, ${fold} 30%, color-mix(in srgb, ${fold} 70%, white) 100%)`,
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
