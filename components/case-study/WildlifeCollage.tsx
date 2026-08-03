// A scattered, overlapping collage instead of a single tidy rectangle —
// each photo gets its own organic blob mask (same technique as the About
// page's profile photo) and independent tilt, like snapshots scattered
// across a desk rather than a grid.
const BLOBS = [
  "63% 37% 54% 46% / 43% 37% 63% 57%",
  "37% 63% 46% 54% / 57% 63% 37% 43%",
  "54% 46% 37% 63% / 46% 54% 63% 37%",
  "46% 54% 63% 37% / 63% 46% 37% 54%",
];
const TILTS = [-7, 6, -5, 8];
// True corners, no inward nudge — pushes the photos apart toward the edges
// of the container instead of converging in the middle, where they'd
// overlap enough to hide which animal is which.
const POSITIONS = ["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"];

export default function WildlifeCollage({ images, alt }: { images: string[]; alt: string }) {
  return (
    <div className="relative aspect-square w-full">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${alt} — photo ${i + 1}`}
          style={{
            borderRadius: BLOBS[i % BLOBS.length],
            transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
            zIndex: i,
          }}
          className={`absolute h-[50%] w-[50%] object-cover shadow-[0_12px_28px_rgba(0,0,0,0.2)] ${POSITIONS[i % POSITIONS.length]}`}
        />
      ))}
    </div>
  );
}
