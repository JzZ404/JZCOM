"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

const titleVariants = {
  rest: { y: 0 },
  hover: { y: -2 },
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <motion.div
        className="overflow-hidden rounded-lg border border-[var(--color-border)]"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--color-border)]">
          <motion.div
            className="h-full w-full bg-[var(--color-border)]"
            variants={imageVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-hidden
          />
        </div>
        <motion.div className="p-4" variants={titleVariants} transition={{ duration: 0.2 }}>
          <h3 className="font-medium group-hover:text-[var(--color-accent)]">
            {project.title}
          </h3>
          <p className="mt-1 text-[length:var(--text-caption)] text-[var(--color-muted)]">
            {project.tags.join(" · ")}
          </p>
        </motion.div>
      </motion.div>
    </Link>
  );
}
