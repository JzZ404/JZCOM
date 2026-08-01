"use client";

export type BusinessModelBlock = { title: string; items: string[] };

const COL_START = ["sm:col-start-1", "sm:col-start-2", "sm:col-start-3", "sm:col-start-4", "sm:col-start-5"];
const ROW_START = ["sm:row-start-1", "sm:row-start-2"];

// Border on every side; the outer container clips to rounded corners via
// overflow-hidden, so only the 4 outer corners round — internal cell
// edges stay square, reading as one unified grid instead of separate cards.
function Cell({
  block,
  className = "",
}: {
  block: BusinessModelBlock;
  className?: string;
}) {
  return (
    <div className={`border-[var(--color-border)] bg-[var(--color-card)] p-4 ${className}`}>
      <h3 className="mb-2 text-[13px] font-bold text-[var(--color-primary)]">{block.title}</h3>
      <ul className="flex flex-col gap-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="text-[13px] leading-snug text-[var(--color-fg)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Recreates the classic Business Model Canvas grid in code (instead of a
// static exported image) so it reflows and re-themes for dark mode.
// `topRow` columns hold either one tall block or two stacked ones
// (Key Activities/Resources, Customer Relationships/Channels) — same
// arrangement as the source canvas. Built as one 5-column CSS grid with
// explicit row/column placement (not separate cards, not auto-flow —
// auto-flow would scatter the mixed single/stacked columns) so cells
// share borders edge-to-edge.
export default function BusinessModelCanvas({
  topRow,
  bottomRow,
}: {
  topRow: BusinessModelBlock[][];
  bottomRow: BusinessModelBlock[];
}) {
  return (
    <div className="mb-11 grid grid-cols-1 overflow-hidden rounded-xl border border-[var(--color-border)] sm:grid-cols-5">
      {topRow.map((column, colIndex) =>
        column.length === 1 ? (
          <Cell
            key={colIndex}
            block={column[0]}
            className={`border-b sm:row-span-2 sm:border-b-0 ${COL_START[colIndex]} sm:row-start-1 ${
              colIndex < topRow.length - 1 ? "sm:border-r" : ""
            }`}
          />
        ) : (
          column.map((block, rowIndex) => (
            <Cell
              key={rowIndex}
              block={block}
              className={`border-b ${rowIndex === 1 ? "sm:border-t" : ""} ${COL_START[colIndex]} ${
                ROW_START[rowIndex]
              } ${colIndex < topRow.length - 1 ? "sm:border-r" : ""}`}
            />
          ))
        ),
      )}
      <div className="grid grid-cols-1 border-t border-[var(--color-border)] sm:col-span-5 sm:grid-cols-5">
        <Cell block={bottomRow[0]} className="border-b sm:col-span-2 sm:border-r sm:border-b-0" />
        <Cell block={bottomRow[1]} className="sm:col-span-3" />
      </div>
    </div>
  );
}
