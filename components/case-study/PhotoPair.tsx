// Two candid photos side by side with a slight independent tilt — a
// lighter, snapshot-y treatment than WildlifeCollage's full organic-blob
// collage, since these are usually just two shots of the same moment.
const TILTS = [-3, 2];

export default function PhotoPair({
  images,
  alt,
  caption,
}: {
  images: string[];
  alt: string;
  caption?: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — photo ${i + 1}`}
            style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
          />
        ))}
      </div>
      {caption && (
        <p className="mt-4 text-center text-[13px] text-[var(--color-muted)] italic">{caption}</p>
      )}
    </div>
  );
}
