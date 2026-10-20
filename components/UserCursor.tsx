"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

// Trailing name-tag pill only — no custom arrow glyph. Joyce's call: keep
// the real macOS pointer, just have this pill follow it and show
// contextual text (hero headline terms, project cards) via data-cursor-pill
// opt-in, same hover-detection this had back when it also drew an arrow.
const LABEL_OFFSET = { x: 16, y: 20 }; // px, pill position relative to the real cursor
const LABEL_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

export default function UserCursor() {
  const [ready, setReady] = useState(false);
  const [pressed, setPressed] = useState(false);
  // Hidden by default — only shown while hovering an element that
  // explicitly opts in via data-cursor-pill (hero headline terms, project
  // cards), per Joyce. null means "not hovering one right now," which
  // unmounts the pill below rather than just fading its opacity.
  const [pillText, setPillText] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const labelX = useSpring(x, LABEL_SPRING);
  const labelY = useSpring(y, LABEL_SPRING);

  useEffect(() => {
    // Coarse-pointer devices (touch) have no hovering mouse for this pill
    // to follow at all.
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;

    setReady(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);

      // Walk up from the real hover target to the nearest opt-in element —
      // null when nothing along that chain has one, which hides the pill.
      const pillTarget = (e.target as Element | null)?.closest("[data-cursor-pill]");
      setPillText(pillTarget?.getAttribute("data-cursor-pill") ?? null);
    }
    function onLeaveWindow() {
      setPillText(null);
    }
    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
    // x/y are stable MotionValue refs from useMotionValue — safe to omit
    // without re-running this setup on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  return (
    <AnimatePresence>
      {pillText && (
        // key={pillText} — not just a stable key — so swapping from one
        // hover target straight to another (UX -> AI, say) replays the pop
        // instead of silently relabeling a pill that's already sitting
        // there at full opacity. A spring overshoot (not a plain fade) is
        // what makes this read as a little bounce in, not a flat cross-fade.
        <motion.div
          key={pillText}
          aria-hidden
          style={{ left: labelX, top: labelY }}
          initial={{ opacity: 0, scale: 0.4, y: 8 }}
          animate={{ opacity: 1, scale: pressed ? 0.92 : 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 8 }}
          transition={{ type: "spring", stiffness: 500, damping: 24 }}
          // first-letter:uppercase capitalizes just the leading character
          // of whatever copy lands here, regardless of how it was typed in
          // data/page content — not Tailwind's capitalize utility, which
          // would title-case every word instead of just the first one.
          className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full bg-[var(--color-primary)] px-3 py-1 text-[14px] font-semibold whitespace-nowrap text-[var(--color-bg)] shadow-[0px_2px_8px_rgba(0,0,0,0.18)] first-letter:uppercase"
          // LABEL_OFFSET shifts the pill down-right of the real cursor
          // rather than centering under it — translate keeps that offset
          // fixed regardless of the pill's own text-driven width.
          transformTemplate={(_, generated) =>
            `translate(${LABEL_OFFSET.x}px, ${LABEL_OFFSET.y}px) ${generated}`
          }
        >
          {pillText}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
