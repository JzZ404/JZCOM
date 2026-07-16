import type { Metadata } from "next";
import { archiveItems } from "@/data/archive";

export const metadata: Metadata = {
  title: "Archive — Joyce Zhou",
};

export default function ArchivePage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Archive</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
        {/* PLACEHOLDER — copy for the archive intro */}
        Older and miscellaneous work, unsorted.
      </p>

      <div className="mt-10 columns-2 gap-4 sm:columns-3">
        {archiveItems.map((item) => (
          <div
            key={item.id}
            className="mb-4 w-full break-inside-avoid rounded-lg bg-[var(--color-border)]"
            style={{ aspectRatio: item.aspectRatio }}
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
