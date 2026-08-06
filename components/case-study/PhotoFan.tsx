"use client";

import { useState } from "react";

// Three photos fanned out and overlapping — like snapshots dropped on a
// desk, not a tidy grid or a scroll-through carousel. Each keeps a card-like
// white border and its own tilt/offset/shadow so every photo still reads as
// a whole image (nothing masked or cropped into a shape), even where they
// overlap. Source photos can be wildly different aspect ratios — object-cover
// inside a fixed-ratio card keeps the fan visually consistent regardless.
// Positions are % of the container (not Tailwind position utilities) so the
// overlap between cards can be tuned precisely — card 2 sits right enough to
// clear the illustration's "PLEASE DON'T POLLUTE" text instead of covering
// it, and card 3 is pulled up to overlap card 2 instead of sitting clear of it.
const CARDS = [
  { top: 0, left: 0, width: 56, rotate: -8, z: 10 },
  { top: 8, left: 48, width: 52, rotate: 7, z: 20 },
  { top: 34, left: 18, width: 66, rotate: -4, z: 30 },
];

// Above every card's own base z (10/20/30), but below the floating nav's
// z-50 (Nav.tsx) — otherwise a clicked-to-front card would render on top
// of the nav bar itself whenever the fan scrolls near the top of the
// viewport.
const FRONT_Z = 40;

// The container needs *some* fixed aspect ratio for the cards' % top/left
// to resolve against (they're all `absolute`) — but a round number like
// 4/5 doesn't actually match how far down the lowest card (card 3, each
// card itself 4:3) reaches. Left as 4/5 that card only fills ~74% of the
// box height, leaving dead space below it that read as the fan and the
// text column "not matching" even with items-center. 4/3.68 is that 74%
// solved for directly: card 3 bottom = top(34%) + width(66%)*0.75/1.25 ≈
// 73.6% of a 4/5 box, so shrinking the box to 92% height (4/3.68) makes
// its bottom edge land almost exactly on the last card's real bottom.
export default function PhotoFan({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  // null = natural stacking order (each card's own `z`). Clicking a card
  // pins it to the front until another one is clicked instead.
  const [frontIndex, setFrontIndex] = useState<number | null>(null);

  return (
    <div className="relative aspect-[4/3.68] w-full">
      {images.slice(0, 3).map((image, i) => {
        const card = CARDS[i];
        const isFront = frontIndex === i;
        return (
          <button
            key={image.src}
            type="button"
            onClick={() => setFrontIndex(i)}
            aria-label={`Bring "${image.alt}" to the front`}
            className="absolute aspect-[4/3] cursor-pointer rounded-lg bg-[var(--color-card)] p-1.5 text-left shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition-[transform,box-shadow] duration-200 ease-out hover:shadow-[0_18px_36px_rgba(0,0,0,0.32)]"
            style={{
              top: `${card.top}%`,
              left: `${card.left}%`,
              width: `${card.width}%`,
              zIndex: isFront ? FRONT_Z : card.z,
              transform: `rotate(${card.rotate}deg)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `rotate(${card.rotate}deg) scale(1.08)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${card.rotate}deg)`;
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full rounded-md object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}
