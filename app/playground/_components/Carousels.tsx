"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DemoCard from "./DemoCard";

const CARD_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-fg)",
  "var(--color-primary)",
  "var(--color-accent)",
];

function DraggableCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setConstraint(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: -constraint, right: 0 }}
        dragElastic={0.1}
        className="flex w-max cursor-grab gap-4 active:cursor-grabbing"
      >
        {CARD_COLORS.map((color, i) => (
          <div
            key={i}
            style={{ background: color }}
            className="flex h-32 w-40 shrink-0 items-center justify-center rounded-lg font-medium text-[var(--color-bg)]"
          >
            Card {i + 1}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function AutoCoverflow() {
  const [active, setActive] = useState(0);
  const count = 5;

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % count), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-40 w-full">
      {Array.from({ length: count }).map((_, i) => {
        const offset = i - active;
        return (
          <motion.div
            key={i}
            animate={{
              x: offset * 70,
              scale: offset === 0 ? 1 : 0.8,
              opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.5,
              zIndex: count - Math.abs(offset),
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute top-1/2 left-1/2 h-28 w-20 -translate-x-1/2 -translate-y-1/2 rounded-lg"
            style={{ background: CARD_COLORS[i % CARD_COLORS.length] }}
          />
        );
      })}
    </div>
  );
}

export default function Carousels() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Carousels</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DemoCard name="Draggable Carousel" description="Drag left/right">
          <DraggableCarousel />
        </DemoCard>
        <DemoCard name="Auto Coverflow">
          <AutoCoverflow />
        </DemoCard>
      </div>
    </section>
  );
}
