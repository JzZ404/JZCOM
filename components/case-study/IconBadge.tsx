import type { CSSProperties } from "react";
import { ICONS, type IconName } from "@/components/icons";

// An icon in a round badge: the case studies' marker for a stage, step, or
// feature, so they all read as one visual language. `style` recolors it for
// a page with its own brand palette (Helport).
export default function IconBadge({
  name,
  size = "md",
  style,
}: {
  name: IconName;
  size?: "sm" | "md";
  style?: CSSProperties;
}) {
  const Icon = ICONS[name];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] ${
        size === "sm" ? "h-9 w-9" : "h-10 w-10"
      }`}
      style={style}
    >
      <Icon aria-hidden className={size === "sm" ? "h-4.5 w-4.5" : "h-5 w-5"} strokeWidth={2} />
    </span>
  );
}

// The same icon without the badge, for sitting inline beside a title.
export function IconGlyph({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  const Icon = ICONS[name];
  return <Icon aria-hidden className={className} style={style} strokeWidth={2} />;
}
