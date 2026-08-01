"use client";

import { motion } from "framer-motion";

export type ResponsibleAiRow = { risk: string; impact: string; safeguard: string };

export default function ResponsibleAiTable({ rows }: { rows: ResponsibleAiRow[] }) {
  return (
    <div className="mb-11 overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {["Risk", "Impact", "Safeguard"].map((heading) => (
              <th
                key={heading}
                className="px-5 py-4 font-serif text-[16px] font-bold text-[var(--color-fg)]"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            // motion.tr directly (not the generic Reveal div wrapper) —
            // a div isn't valid inside <tbody>, the browser would hoist
            // it out and break the table structure.
            <motion.tr
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className={i < rows.length - 1 ? "border-b border-[var(--color-border)]" : ""}
            >
              <td className="w-1/5 px-5 py-5 align-top text-[14px] leading-relaxed font-semibold text-[var(--color-primary)]">
                {row.risk}
              </td>
              <td className="w-2/5 px-5 py-5 align-top text-[14px] leading-relaxed text-[var(--color-fg)]">
                {row.impact}
              </td>
              <td className="w-2/5 px-5 py-5 align-top text-[14px] leading-relaxed text-[var(--color-muted)]">
                {row.safeguard}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
