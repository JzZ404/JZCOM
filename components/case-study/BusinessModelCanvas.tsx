import type { IconName } from "@/components/icons";
import { IconGlyph } from "./IconBadge";
import Reveal from "./Reveal";

export type BusinessModelBlock = { title: string; icon?: IconName; items: string[] };

// Alio's lavender/navy, from the original canvas graphic. The cells stay
// light in both site themes, so their text colors are set explicitly.
const CELL_BG = "linear-gradient(180deg, #F6F6FF 0%, #E7E9FB 100%)";
// Value Propositions is the canvas's center of gravity: a deeper wash and an
// outline so it reads first.
const VALUE_BG = "linear-gradient(180deg, #EEEDFF 0%, #D9DBFA 100%)";
const NAVY = "#1F2782";
const TEXT = "#1C1C1E";

const COL_START = ["sm:col-start-1", "sm:col-start-2", "sm:col-start-3", "sm:col-start-4", "sm:col-start-5"];
const ROW_START = ["sm:row-start-1", "sm:row-start-2"];

function Cell({ block, delay, className = "" }: { block: BusinessModelBlock; delay: number; className?: string }) {
  const isValue = block.title === "Value Propositions";
  return (
    <Reveal
      variant="scale"
      delay={delay}
      className={`rounded-lg p-4 ${className}`}
      style={{ background: isValue ? VALUE_BG : CELL_BG, boxShadow: isValue ? "inset 0 0 0 1.5px #A5ABF5" : undefined }}
    >
      <h3 className="mb-2.5 flex items-start gap-2 text-[15px] leading-tight font-bold" style={{ color: NAVY }}>
        {block.icon && <IconGlyph name={block.icon} className="mt-px h-4 w-4 shrink-0" />}
        {block.title}
      </h3>
      <ul className="flex flex-col gap-2">
        {block.items.map((item, i) => (
          <li key={i} className="text-[13.5px] leading-snug" style={{ color: TEXT }}>
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

// Recreates the classic Business Model Canvas in code (instead of a static
// exported image) so it reflows on phones. `topRow` columns hold either one
// tall block or two stacked ones (Key Activities/Resources, Customer
// Relationships/Channels) — same arrangement as the source canvas — placed
// explicitly on a 5-column grid (auto-flow would scatter the mixed
// single/stacked columns). Cost and Revenue split the bottom row. Cells
// appear column by column, left to right, as it scrolls in.
export default function BusinessModelCanvas({
  topRow,
  bottomRow,
}: {
  topRow: BusinessModelBlock[][];
  bottomRow: BusinessModelBlock[];
}) {
  return (
    <div className="mb-11 flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {topRow.map((column, colIndex) =>
          column.length === 1 ? (
            <Cell
              key={colIndex}
              block={column[0]}
              delay={colIndex * 0.06}
              className={`sm:row-span-2 sm:row-start-1 ${COL_START[colIndex]}`}
            />
          ) : (
            column.map((block, rowIndex) => (
              <Cell
                key={block.title}
                block={block}
                delay={colIndex * 0.06 + rowIndex * 0.04}
                className={`${COL_START[colIndex]} ${ROW_START[rowIndex]}`}
              />
            ))
          ),
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {bottomRow.map((block, i) => (
          <Cell key={block.title} block={block} delay={0.3 + i * 0.06} />
        ))}
      </div>
    </div>
  );
}
