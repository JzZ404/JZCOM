import type { IconName } from "@/components/icons";
import { IconGlyph } from "./IconBadge";
import Reveal from "./Reveal";

// Alio's own palette, sampled from the original technical-stack graphic this
// replaces — kept as literals (like the page's other Alio accents) since
// they're the project's brand colors, not site tokens. The cards are light in
// both site themes, so every text color inside is set explicitly.
const HEADER_BG = "#CAD0FF";
const BODY_BG = "#DEE0EF";
const NAVY = "#1F2782";
const LIME = "#C0DA5A";
const TEXT = "#1C1C1E";

type Layer = { title: string; icon: IconName; items: string[] };

// One card per layer of the stack, left to right as the system is built up:
// a periwinkle header (icon + layer name) over a lavender list.
export default function AlioTechStack({ layers }: { layers: Layer[] }) {
  return (
    <div className="mb-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {layers.map((layer, i) => (
        <Reveal
          key={layer.title}
          delay={i * 0.08}
          variant="scale"
          className="flex flex-col overflow-hidden rounded-xl"
        >
          <div className="flex min-h-20 items-center gap-3 px-4 py-4" style={{ background: HEADER_BG }}>
            {/* The icon with a lime copy offset behind it — the same lime
                drop the original graphic's hand-drawn numerals had */}
            <span className="relative h-7 w-7 shrink-0">
              <IconGlyph name={layer.icon} className="absolute top-[3px] left-[3px] h-7 w-7" style={{ color: LIME }} />
              <IconGlyph name={layer.icon} className="relative h-7 w-7" style={{ color: NAVY }} />
            </span>
            <h3 className="font-serif text-[18px] leading-tight font-bold" style={{ color: NAVY }}>
              {layer.title}
            </h3>
          </div>
          <ul className="flex flex-1 flex-col gap-2 px-4 py-5" style={{ background: BODY_BG }}>
            {layer.items.map((item) => (
              <li key={item} className="flex items-baseline gap-2 text-[14px] leading-snug" style={{ color: TEXT }}>
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full" style={{ background: NAVY }} />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
