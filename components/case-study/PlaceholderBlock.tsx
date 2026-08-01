// Diagonal-stripe placeholder for images/screenshots that haven't been
// supplied yet — labeled so it's obvious what real asset needs to replace it.
export default function PlaceholderBlock({
  label,
  height = 220,
  className = "",
}: {
  label: string;
  height?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      style={{
        height,
        backgroundImage:
          "repeating-linear-gradient(135deg, color-mix(in srgb, var(--color-fg) 8%, var(--color-bg)), color-mix(in srgb, var(--color-fg) 8%, var(--color-bg)) 8px, color-mix(in srgb, var(--color-fg) 14%, var(--color-bg)) 8px, color-mix(in srgb, var(--color-fg) 14%, var(--color-bg)) 16px)",
      }}
      className={`flex items-center justify-center rounded-xl px-3 text-center font-mono text-[11px] leading-tight text-[var(--color-muted)] ${className}`}
    >
      [ {label} ]
    </div>
  );
}
