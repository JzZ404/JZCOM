"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Theme = "light" | "dark";

// Floating light-switch control, fixed bottom-right on every page. The
// rocker paddle slides up/down within its cutout, like a real toggle
// switch's hinge motion, rather than tilting side to side.
export default function ThemeToggle() {
  // null until mounted — avoids rendering a guess that mismatches the
  // theme-init script's choice and causes a hydration flash.
  const [theme, setTheme] = useState<Theme | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    );
  }, []);

  const toggle = () => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  };

  if (theme === null) {
    return <div className="fixed right-6 bottom-6 z-50 h-[84px] w-14" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggle}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-6 bottom-6 z-50 drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-md ${isDark ? "text-black" : "text-white"}`}
          >
            {isDark ? "Lights off" : "Lights on"}
          </motion.span>
        )}
      </AnimatePresence>
      <svg width="56" height="84" viewBox="0 0 56 84" fill="none">
        <defs>
          <pattern id="switch-grip" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="var(--color-primary)" />
          </pattern>
        </defs>

        {/* wall plate */}
        <rect
          x="4"
          y="4"
          width="48"
          height="76"
          rx="8"
          fill="var(--color-bg)"
          stroke="var(--color-fg)"
          strokeWidth="4"
        />

        {/* mounting screws */}
        <circle cx="28" cy="15" r="3.5" fill="var(--color-fg)" />
        <line x1="26" y1="13.5" x2="30" y2="16.5" stroke="var(--color-bg)" strokeWidth="1.2" />
        <circle cx="28" cy="69" r="3.5" fill="var(--color-fg)" />
        <line x1="26" y1="67.5" x2="30" y2="70.5" stroke="var(--color-bg)" strokeWidth="1.2" />

        {/* recessed cutout the rocker sits in */}
        <rect
          x="15"
          y="24"
          width="26"
          height="36"
          rx="4"
          fill="none"
          stroke="var(--color-fg)"
          strokeWidth="2.5"
        />

        {/* rocker paddle — slides up (lights on) / down (lights off) within the cutout */}
        <motion.g
          animate={{ y: isDark ? 7 : -7 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          <rect x="18" y="31" width="20" height="22" rx="3" fill="var(--color-bg)" />
          <rect x="18" y="31" width="20" height="10" fill="url(#switch-grip)" />
          <rect
            x="18"
            y="31"
            width="20"
            height="22"
            rx="3"
            fill="none"
            stroke="var(--color-fg)"
            strokeWidth="2.5"
          />
        </motion.g>
      </svg>
    </motion.button>
  );
}
