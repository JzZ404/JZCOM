"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import type { ArchiveProject } from "@/data/archive";
import ArchiveProjectCard from "./ArchiveProjectCard";

const COLUMN_COUNT = 3;

// Rough relative height per project, in units of "card width" — exact
// pixels don't matter since every column ends up the same real width, this
// just needs to rank projects well enough to balance the three columns.
// Featured layout's second row is a fixed height rather than aspect-ratio
// driven, so it gets a flat estimate instead of 1/aspectRatio.
function estimateHeight(project: ArchiveProject): number {
  const CAPTION = 0.26;
  if (project.layout === "featured") {
    const [first] = project.images;
    return 1 / first.aspectRatio + 0.6 + CAPTION;
  }
  return project.images.reduce((sum, img) => sum + 1 / img.aspectRatio, 0) + CAPTION;
}

function splitIntoColumns(projects: ArchiveProject[], columns: number): ArchiveProject[][] {
  const result: ArchiveProject[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  for (const project of projects) {
    let shortest = 0;
    for (let i = 1; i < columns; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    result[shortest].push(project);
    heights[shortest] += estimateHeight(project);
  }
  return result;
}

// Each column drifts vertically at its own rate as it crosses the viewport
// — a faint layered "waterfall" instead of all three cards moving in
// lockstep with the page scroll. Kept small on purpose: the columns should
// read as basically anchored in place, just not perfectly synced — an
// earlier, much wider version (plus a scroll-linked rotate) felt dizzying
// rather than subtle.
const PARALLAX_RANGE: [number, number][] = [
  [-10, 10],
  [12, -14],
  [-14, 8],
];

function ParallaxColumn({ projects, index }: { projects: ArchiveProject[]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRange = PARALLAX_RANGE[index % PARALLAX_RANGE.length];
  const yRaw = useTransform(scrollYProgress, [0, 1], yRange);
  // Spring softens the follow so it feels like it has some weight/momentum
  // rather than tracking the scrollbar 1:1.
  const y = useSpring(yRaw, { stiffness: 120, damping: 20, mass: 0.5 });

  return (
    <motion.div ref={ref} style={{ y }} className="flex flex-col gap-8">
      {projects.map((project, i) => (
        <ArchiveProjectCard key={project.id} project={project} delay={i * 0.08} />
      ))}
    </motion.div>
  );
}

export default function ArchiveWaterfallGrid({ projects }: { projects: ArchiveProject[] }) {
  const columns = splitIntoColumns(projects, COLUMN_COUNT);

  return (
    <>
      {/* Mobile: flat single column in original order — the column split
          below is desktop-only, since on one column it'd just group all of
          column A's cards before any of column B's instead of reading top
          to bottom in upload order. */}
      <div className="flex flex-col gap-8 sm:hidden">
        {projects.map((project, i) => (
          <ArchiveProjectCard key={project.id} project={project} delay={i * 0.08} />
        ))}
      </div>

      <div className="hidden gap-8 sm:grid sm:grid-cols-3">
        {columns.map((col, i) => (
          <ParallaxColumn key={i} projects={col} index={i} />
        ))}
      </div>
    </>
  );
}
