"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import PlaceholderBlock from "./case-study/PlaceholderBlock";

export type Hobby = { label: string; image?: string; zoom?: number };

// Slight alternating tilt per card, same "pinned photo" playfulness as the
// case-study sticky notes, rather than a flat uniform grid.
const TILTS = [-3, 2, -2, 3];

// Fades the track's own edges to transparent instead of hard-cutting
// whatever card happens to sit at the scroll boundary.
const EDGE_FADE = {
  maskImage:
    "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0, black 48px, black calc(100% - 48px), transparent 100%)",
};

export default function HobbyCarousel({ hobbies }: { hobbies: Hobby[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 260;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* py (not just pb) so a card's hover scale has room to grow without
          getting clipped — overflow-x-auto forces overflow-y to clip too,
          per the CSS spec, so the box itself has to be tall enough instead. */}
      <div
        ref={trackRef}
        style={EDGE_FADE}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 py-12"
      >
        {hobbies.map((hobby, i) => (
          <div
            key={i}
            style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}
            className="cursor-sparkle w-56 shrink-0 snap-center rounded-xl bg-[var(--color-card)] p-3 shadow-[0px_4px_10px_rgba(0,0,0,0.12)] transition-[transform,box-shadow] duration-200 [transform:rotate(var(--tilt))] hover:z-10 hover:shadow-[0px_10px_24px_rgba(0,0,0,0.22)] hover:[transform:rotate(var(--tilt))_scale(1.06)]"
          >
            {hobby.image ? (
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={hobby.image}
                  alt={hobby.label}
                  width={224}
                  height={224}
                  style={hobby.zoom ? { transform: `scale(${hobby.zoom})` } : undefined}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <PlaceholderBlock label={hobby.label} height={224} />
            )}
            <p className="mt-2 text-center text-[14px] font-semibold text-[var(--color-fg)]">
              {hobby.label}
            </p>
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute top-1/2 -left-4 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] shadow-md hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] xl:flex"
      >
        ←
      </motion.button>
      <motion.button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="absolute top-1/2 -right-4 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] shadow-md hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] xl:flex"
      >
        →
      </motion.button>
    </div>
  );
}
