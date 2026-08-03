"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import CategoryBackdrop from "@/components/CategoryBackdrop";
import { projects, type ProjectCategory } from "@/data/projects";

const CATEGORIES: ProjectCategory[] = ["ux", "ai", "robotics"];

// Turned off for now — the dot-grid/blueprint patterns read as distracting.
// Structure stays wired so this is a one-line flip to bring them back.
const SHOW_CATEGORY_BACKDROPS = false;

// once: false replays the reveal every time a row re-enters the viewport,
// so it plays scrolling down AND scrolling back up, not just the first time.
const staggerContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const staggerViewport = { once: false, margin: "-80px" };

export default function WorkSection({ id = "work" }: { id?: string }) {
  // scroll-mt-28 offsets anchor-jumps (e.g. clicking "Work" in the nav from
  // another page, which does a native #work jump rather than the smooth
  // in-page scroll) so the heading lands below the fixed nav instead of
  // underneath it — same clearance value used elsewhere (CaseStudySection,
  // etc.) for the same reason.
  return (
    <section id={id} className="scroll-mt-28 px-4 pt-8 pb-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Work</h2>
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {CATEGORIES.map((category) => {
          const categoryProjects = projects.filter((project) => project.category === category);
          return (
            <div key={category} className="relative py-6">
              {SHOW_CATEGORY_BACKDROPS && <CategoryBackdrop category={category} />}
              <div className="relative mx-auto max-w-6xl">
                <motion.div
                  className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-14"
                  initial="hidden"
                  whileInView="show"
                  viewport={staggerViewport}
                  variants={staggerContainerVariants}
                >
                  {categoryProjects.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
