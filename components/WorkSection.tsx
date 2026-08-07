"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import CategoryBackdrop from "@/components/CategoryBackdrop";
import { projects, type ProjectCategory } from "@/data/projects";

const CATEGORIES: ProjectCategory[] = ["ux", "ai", "robotics"];

// All three category backdrops — UX's organic blur, AI's code texture,
// Robotics' HUD ring.
const CATEGORIES_WITH_BACKDROP: ProjectCategory[] = ["ux", "ai", "robotics"];

// once: false replays the reveal every time a row re-enters the viewport,
// so it plays scrolling down AND scrolling back up, not just the first time.
const staggerContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const staggerViewport = { once: false, margin: "-80px" };

export default function WorkSection({ id = "work" }: { id?: string }) {
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
  return (
    <section id={id} className="scroll-mt-16 px-4 pt-8 pb-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Work</h2>
      </div>

      {/* py-8 on each row + gap-4 between rows (was py-6 + gap-8) — the
          total visual space between one category's last card and the
          next's first card is unchanged (24+32+24 = 80px either way), but
          more of that space now belongs to each row's own box (so its
          backdrop has more breathing room) and less belongs to the shared
          gap between rows. Swap py-N/gap-N together, not independently —
          the pairing is what keeps the on-screen result identical. */}
      <div className="mt-4 flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const categoryProjects = projects.filter((project) => project.category === category);
          return (
            <div key={category} className="relative overflow-hidden py-8">
              {CATEGORIES_WITH_BACKDROP.includes(category) && (
                <CategoryBackdrop category={category} />
              )}
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
