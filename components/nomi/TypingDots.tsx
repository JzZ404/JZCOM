"use client";

import { motion } from "framer-motion";

// Three bouncing dots — "Nomi is typing".
export default function TypingDots({ dotClassName = "bg-[var(--color-muted)]" }: { dotClassName?: string }) {
  return (
    <span className="flex h-[21px] items-center gap-1 px-1" role="status" aria-label="Nomi is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${dotClassName}`}
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
