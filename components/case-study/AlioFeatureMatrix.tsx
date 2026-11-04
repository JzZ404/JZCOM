import { Check, X } from "lucide-react";
import Reveal from "./Reveal";

// Alio's indigo family. The table panel stays light in both site themes, so
// every color inside it is set explicitly.
const PANEL_BG = "#FAFAFE";
const LINE = "#E4E5F7";
const INK = "#1E1B4B";
const INDIGO = "#4F46E5";
const HIGHLIGHT_COL = "#EEEFFF";
const HIGHLIGHT_HEAD = "#E0E1FF";

type Value = "yes" | "partial" | "no";
const SPOKEN: Record<Value, string> = { yes: "Yes", partial: "Partial", no: "No" };

// Which products have which capability: a full indigo check, a half-filled
// circle, or a faint ✕ (each also read out to screen readers), so the
// pattern reads before any single cell does.
// The first product (Alio) is the highlighted column. On narrow screens the
// table scrolls sideways with the feature names pinned on the left; from
// laptop width up it fits its column.
export default function AlioFeatureMatrix({
  products,
  rows,
}: {
  products: string[];
  rows: { feature: string; values: Value[] }[];
}) {
  return (
    <Reveal variant="scale" className="h-full">
      {/* relative: keeps the cells' visually hidden labels inside this
          scroll box — without a positioned ancestor here they'd anchor to
          the page and widen it on phones */}
      <div className="relative h-full overflow-x-auto rounded-2xl border" style={{ background: PANEL_BG, borderColor: LINE }}>
        <table className="h-full w-full min-w-[640px] table-fixed border-collapse text-left lg:min-w-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[24%] px-3 py-3 lg:w-[25%]" style={{ background: PANEL_BG }}>
                <span className="sr-only">Feature</span>
              </th>
              {products.map((product, i) => (
                <th
                  key={product}
                  scope="col"
                  className={`px-0.5 py-3 text-center text-[12px] leading-tight ${i === 0 ? "font-bold" : "font-semibold"}`}
                  style={{ color: i === 0 ? INDIGO : INK, background: i === 0 ? HIGHLIGHT_HEAD : undefined }}
                >
                  {product}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-t" style={{ borderColor: LINE }}>
                <th
                  scope="row"
                  className="sticky left-0 z-10 px-3 py-3.5 text-[13.5px] leading-snug font-semibold"
                  style={{ color: INK, background: PANEL_BG }}
                >
                  {row.feature}
                </th>
                {row.values.map((value, i) => (
                  <td key={products[i]} className="px-1 py-3.5" style={{ background: i === 0 ? HIGHLIGHT_COL : undefined }}>
                    <span className="flex justify-center">
                      <Mark value={value} />
                      <span className="sr-only">{SPOKEN[value]}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

function Mark({ value }: { value: Value }) {
  const size = "h-[22px] w-[22px]";
  if (value === "yes") {
    return (
      <span aria-hidden className={`flex items-center justify-center rounded-full ${size}`} style={{ background: INDIGO }}>
        <Check className="h-3.5 w-3.5" color="white" strokeWidth={3} />
      </span>
    );
  }
  if (value === "partial") {
    // Left half filled
    return (
      <svg aria-hidden viewBox="0 0 22 22" className={size}>
        <circle cx="11" cy="11" r="9.5" fill="white" stroke={INDIGO} strokeWidth="1.75" />
        <path d="M11 1.5a9.5 9.5 0 0 0 0 19z" fill={INDIGO} />
      </svg>
    );
  }
  return (
    <span aria-hidden className={`flex items-center justify-center rounded-full ${size}`} style={{ background: "#EDEDF4" }}>
      <X className="h-3.5 w-3.5" color="#9A9CB0" strokeWidth={2.5} />
    </span>
  );
}
