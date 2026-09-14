"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

// Two independently-stacked columns (Joyce's explicit assignment) instead of
// category-based rows — each column just runs down its own list regardless
// of the other column's total height, which is what actually makes this a
// waterfall/masonry layout instead of row-paired cards forced to match a
// neighbor's height. This replaces the old per-category-row grid entirely,
// which also means the three CategoryBackdrop illustrations (UX sketch, AI
// code-cloud, Robotics HUD — see components/CategoryBackdrop.tsx) no longer
// have a row to render behind and are unused here for now. Left in place,
// untouched, in case a different treatment brings them back.
const LEFT_COLUMN_SLUGS = ["alio", "helport", "focusfarm", "pelican"];
const RIGHT_COLUMN_SLUGS = ["nest", "poopidex", "drunky"];

function bySlug(slugs: string[]) {
  return slugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project) => project !== undefined);
}

// once: false replays the reveal every time the section re-enters the
// viewport, so it plays scrolling down AND scrolling back up, not just the
// first time.
const staggerContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const staggerViewport = { once: false, margin: "-80px" };

export default function WorkSection({
  id = "work",
  // "Work" is an <h2> when this section sits below the homepage's own hero
  // <h1>, but the standalone /work route has no other heading on the page —
  // it needs this to actually be the page's <h1>. Card titles shift down
  // to match (h2 on /work, h3 embedded on home) so the outline never skips
  // a level either way.
  headingLevel = "h2",
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const cardTitleLevel = headingLevel === "h1" ? "h2" : "h3";
  const leftColumn = bySlug(LEFT_COLUMN_SLUGS);
  const rightColumn = bySlug(RIGHT_COLUMN_SLUGS);

  return (
    // scroll-mt offsets anchor-jumps (e.g. clicking "Work" in the nav) so
    // the heading lands below the fixed nav instead of underneath it. Was
    // scroll-mt-28 (112px) — same value used elsewhere (CaseStudySection,
    // etc.) — but THIS section also has its own pt-8 (32px) on top of that,
    // landing the "Work" heading ~144px from the viewport top against a
    // scrolled nav pill that's only ~72px tall: a ~72px dead gap. scroll-mt
    // and padding-top aren't the same 112px everywhere else stacks with, so
    // this section needs its own smaller value (64px) rather than reusing
    // the shared one — 64+32=96px total, ~24px clearance under the pill,
    // not an empty gap.
    <section id={id} className="scroll-mt-16 px-3 pt-8 pb-16">
      <div className="mx-auto max-w-6xl">
        <Heading className="text-[length:var(--text-h1)] font-semibold tracking-tight">Work</Heading>
      </div>

      {/* mx-auto max-w-6xl matches the heading above — without it the grid
          only has the section's own px-3 (12px) edge padding and stretches
          full-bleed on wide screens instead of sitting in the same centered
          column as everything else. Same gap values the old per-category
          grid used — gap-y-10 (40px) between cards stacked in a column,
          sm:gap-x-14 (56px) between the two columns — just no longer paired
          row-by-row across them. sm:items-start keeps the two columns' top
          edges aligned without stretching either to match the other's total
          height. */}
      <motion.div
        className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-y-10 sm:grid-cols-2 sm:items-start sm:gap-x-14"
        initial="hidden"
        whileInView="show"
        viewport={staggerViewport}
        variants={staggerContainerVariants}
      >
        <div className="flex flex-col gap-y-10">
          {leftColumn.map((project) => (
            <ProjectCard key={project.slug} project={project} titleLevel={cardTitleLevel} />
          ))}
        </div>
        <div className="flex flex-col gap-y-10">
          {rightColumn.map((project) => (
            <ProjectCard key={project.slug} project={project} titleLevel={cardTitleLevel} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
