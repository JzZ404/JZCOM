// A LinkedIn post shown with LinkedIn's own embed, as wide as its column.
// LinkedIn's embed code fixes the frame's height (measured for 504px wide),
// so it's passed in. Wider, the post's text takes fewer lines while its
// photos grow, so the total stays about the same (a little shorter at full
// desktop width); on phones the text wraps
// onto many more lines, so the frame gets extra height there instead of
// cutting the bottom off. Lazy-loaded, so LinkedIn's page (and its scripts)
// only load once a visitor scrolls near it.
export default function LinkedInPostEmbed({
  embedUrl,
  height,
  title,
}: {
  embedUrl: string;
  height: number;
  title: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_18px_rgba(0,0,0,0.06)]">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
        className="block h-[calc(var(--embed-h)*1.24)] w-full sm:h-[var(--embed-h)] lg:h-[calc(var(--embed-h)*0.93)]"
        style={{ "--embed-h": `${height}px` } as React.CSSProperties}
      />
    </div>
  );
}
