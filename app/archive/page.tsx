import type { Metadata } from "next";
import { archiveProjects } from "@/data/archive";
import ArchiveWaterfallGrid from "@/components/ArchiveWaterfallGrid";

export const metadata: Metadata = {
  title: "Archive — Joyce Zhou",
};

export default function ArchivePage() {
  return (
    <section className="px-4 pt-8 pb-16">
      {/* mx-auto max-w-6xl on this inner div (not the section) matches the
          Work page's pattern — px-4 stays a mobile-safety fallback on the
          outer section instead of stacking with the max-width, which was
          pushing Archive's content 16px further in than Work's. pt-8
          (instead of the pb-16 value repeated top and bottom) matches
          WorkSection's own top padding — both pages' headers now sit at
          the same height below the nav. */}
      <div className="mx-auto max-w-6xl">
        <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Archive</h1>
      </div>

      {/* Same max-w-6xl as the intro above and as Work's card grid — no
          separate wider breakout. mt-6 matches WorkSection's own
          heading-to-grid gap (was mt-10 here, a bigger gap than Work's). */}
      <div className="mx-auto mt-6 max-w-6xl">
        <ArchiveWaterfallGrid projects={archiveProjects} />
      </div>
    </section>
  );
}
