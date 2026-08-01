"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

type Sprinkle = { id: number; x: number; y: number; dx: number; dy: number; color: string };

const SPRINKLE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-primary-light)",
];
const SPRINKLE_COUNT = 10;
const NAVIGATE_DELAY_MS = 380;

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -8 },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

export default function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [sprinkles, setSprinkles] = useState<Sprinkle[]>([]);
  // Falls back to the plain placeholder block if a project's cover image
  // hasn't been dropped into /public/images/<slug>/ yet.
  const [coverFailed, setCoverFailed] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const burst = Array.from({ length: SPRINKLE_COUNT }, (_, i) => {
      const angle = (i / SPRINKLE_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 36 + Math.random() * 36;
      return {
        id: Date.now() + i,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
      };
    });
    setSprinkles(burst);
    setTimeout(() => router.push(`/work/${project.slug}`), NAVIGATE_DELAY_MS);
  }

  return (
    // No initial/whileInView/viewport here on purpose — this card is a
    // stagger child. Its "hidden"/"show" state comes from the parent grid
    // in WorkSection, which is what makes the cards in a row reveal one
    // after another instead of all at once.
    <motion.div
      className="h-full"
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        className="group relative block h-full"
      >
        {/* Two-layer key+ambient shadows follow Material Design 3's elevation
            tokens (rest ≈ M3 level 1, hover ≈ level 3) rather than a single
            flat drop-shadow — that's what gives real M3 elevation its depth. */}
        <motion.div
          className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12),0px_1px_2px_0px_rgba(0,0,0,0.08)] transition-shadow duration-300 group-hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.30),0px_4px_8px_3px_rgba(0,0,0,0.15),0_0_45px_color-mix(in_srgb,color-mix(in_srgb,var(--color-primary)_35%,var(--color-bg)_65%)_50%,transparent)]"
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={cardVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--color-border)]">
            {!coverFailed ? (
              <motion.img
                src={project.coverImage}
                alt=""
                onError={() => setCoverFailed(true)}
                style={project.coverPosition ? { objectPosition: project.coverPosition } : undefined}
                className="h-full w-full object-cover"
                variants={imageVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            ) : (
              <motion.div
                className="h-full w-full bg-[var(--color-border)]"
                variants={imageVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
                aria-hidden
              />
            )}
          </div>
          {/* Fixed-height title/chips slots + line-clamped description keep every
              card the same overall height regardless of copy length. */}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="line-clamp-2 min-h-[2.6em] text-[2rem] leading-tight font-bold text-[var(--color-fg)]">
              {project.title}
            </h3>
            <ul className="mt-2 flex flex-wrap content-start gap-1.5">
              {project.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-[0.8125rem] font-normal text-white"
                >
                  {chip}
                </li>
              ))}
            </ul>
            <p className="mt-3 line-clamp-3 flex-1 text-[0.9375rem] leading-snug font-normal text-[var(--color-muted)]">
              {project.summary}
            </p>
          </div>
        </motion.div>

        {sprinkles.map((s) => (
          <motion.span
            key={s.id}
            initial={{ x: s.x, y: s.y, opacity: 1, scale: 1 }}
            animate={{ x: s.x + s.dx, y: s.y + s.dy, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ backgroundColor: s.color }}
            className="pointer-events-none absolute top-0 left-0 h-1.5 w-1.5 rounded-full"
          />
        ))}
      </Link>
    </motion.div>
  );
}
