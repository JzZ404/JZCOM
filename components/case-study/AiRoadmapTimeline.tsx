"use client";

// PLACEHOLDER — light green → light purple, per Joyce's direction for
// this graphic specifically. Not site tokens (the site has no purple
// token); literal endpoints so the ramp stays smooth and predictable.
const RAMP_START = "#9BCB5C";
const RAMP_END = "#B79FE0";

export function phaseColor(i: number, count: number) {
  const t = count > 1 ? i / (count - 1) : 0;
  // oklch interpolation instead of srgb — green and purple sit almost
  // opposite each other on the hue wheel, so mixing in srgb crashes
  // through a muddy gray at the midpoint instead of transitioning smoothly.
  return `color-mix(in oklch, ${RAMP_END} ${Math.round(t * 100)}%, ${RAMP_START})`;
}

// A straight timeline, one dot per phase, evenly spaced along a
// gradient line — dots line up with the phase columns rendered below it.
export default function AiRoadmapTimeline({ count }: { count: number }) {
  return (
    <div className="relative mb-10 px-6">
      <div
        className="h-[3px] w-full rounded-full"
        style={{ background: `linear-gradient(in oklch to right, ${RAMP_START}, ${RAMP_END})` }}
      />
      <div className="absolute inset-x-6 top-0 grid grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex justify-center">
            <div
              className="mt-[-5px] h-3 w-3 rounded-full ring-4 ring-[var(--color-bg)]"
              style={{ background: phaseColor(i, count) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
