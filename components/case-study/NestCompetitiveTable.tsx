"use client";

import { motion } from "framer-motion";
import { Minus, Package, Plus, Target, type LucideIcon } from "lucide-react";

// Nest's palette, sampled from the original competitive-audit graphic (mint
// header, periwinkle name column) plus the HMW notes' lime. The table stays
// light in both site themes, so every color inside is set explicitly.
const HEADER_BG = "#DFFFFA";
const NAME_BG = "#DFE3FC";
const LINE = "#CFD7FE";
const INK = "#1E1E1E";
const RELEVANCE_BG = "#F4F5FF";
const STRENGTH = "#5E9A1F";
const WEAKNESS = "#D9705A";

// A small marker per column heading, in column order: what it is, its
// strength (+), its weakness (−), and what it means for Nest
const COLUMN_MARKS: { Icon: LucideIcon; color: string }[] = [
  { Icon: Package, color: "#5B5E80" },
  { Icon: Plus, color: STRENGTH },
  { Icon: Minus, color: WEAKNESS },
  { Icon: Target, color: "#5B62D6" },
];

// Nest's competitive audit as a real table: one row per competitor, rows
// sliding in one after another; the last column — what each one means for
// Nest — is tinted, since it's where the takeaway lives. Narrow screens scroll
// it sideways with the competitor names pinned on the left.
export default function NestCompetitiveTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: { name: string; cells: string[] }[];
}) {
  const last = columns.length - 1;
  return (
    // relative: keeps the sticky column's positioning inside this scroll box
    <div className="relative mb-11 overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: LINE }}>
      <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
        <thead>
          <tr style={{ background: HEADER_BG }}>
            <th
              scope="col"
              className="sticky left-0 z-10 w-[17%] px-4 py-3.5 text-[14px] font-bold"
              style={{ color: INK, background: HEADER_BG }}
            >
              Competitor
            </th>
            {columns.map((column, i) => {
              const mark = COLUMN_MARKS[i];
              return (
                <th
                  key={column}
                  scope="col"
                  className="border-l px-4 py-3.5 text-[14px] font-bold"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="flex items-center gap-2">
                    {mark && (
                      <mark.Icon aria-hidden className="h-4 w-4 shrink-0" color={mark.color} strokeWidth={2.5} />
                    )}
                    {column}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <motion.tr
              key={row.name}
              className="group border-t"
              style={{ borderColor: LINE }}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: r * 0.07 }}
            >
              <th
                scope="row"
                className="sticky left-0 z-10 px-4 py-4 align-top text-[15px] leading-snug font-bold"
                style={{ color: INK, background: NAME_BG }}
              >
                {row.name}
              </th>
              {row.cells.map((cell, c) => (
                <td
                  key={c}
                  className={`border-l px-4 py-4 align-top text-[14px] leading-relaxed transition-colors duration-150 group-hover:bg-[#FAFBFF] ${
                    c === last ? "font-medium" : ""
                  }`}
                  style={{
                    color: INK,
                    borderColor: LINE,
                    background: c === last ? RELEVANCE_BG : undefined,
                  }}
                >
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
