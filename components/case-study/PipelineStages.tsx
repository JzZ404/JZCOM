"use client";

import { motion } from "framer-motion";
import type { IconName } from "@/components/icons";
import IconBadge from "./IconBadge";

type Stage = { title: string; icon?: IconName; steps: { title: string; body: string }[] };

// A pipeline drawn as one line with an icon node per stage and that stage's
// steps hanging off it. Wide screens: a bold line runs left to right into an
// arrowhead, and each stage drops a light branch for its steps. Phones: the
// stages stack along one bold vertical line. Stages with more steps get
// proportionally more width (with a floor, so a one-step stage isn't
// squeezed).
// On scroll-in the main line draws left to right over DRAW_S seconds and each
// stage fades up as the line reaches it, so the flow plays in reading order.
const DRAW_S = 1.2;

export default function PipelineStages({ stages }: { stages: Stage[] }) {
  const stageDelay = (i: number) => (stages.length > 1 ? (i / (stages.length - 1)) * DRAW_S * 0.85 : 0);
  return (
    <motion.div
      className="relative"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: false, margin: "-80px" }}
    >
      {/* The main flow (wide screens only): from the first node's center to
          an arrowhead at the right edge */}
      <motion.div
        aria-hidden
        className="absolute top-5 right-2 left-5 -mt-px hidden h-0.5 origin-left bg-[var(--color-primary)] lg:block"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: DRAW_S, ease: "easeInOut" } } }}
      />
      <motion.svg
        aria-hidden
        viewBox="0 0 12 12"
        className="absolute top-5 right-0 -mt-[7px] hidden h-3.5 w-3.5 lg:block"
        style={{ fill: "var(--color-primary)" }}
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: DRAW_S - 0.1, duration: 0.2 } } }}
      >
        <path d="M0 0L12 6L0 12z" />
      </motion.svg>

      <ol className="relative flex flex-col lg:flex-row lg:gap-8">
        {stages.map((stage, i) => (
          <motion.li
            key={stage.title}
            className="flex flex-col lg:basis-0"
            style={{ flexGrow: stage.steps.length + 2 }}
            variants={{
              hidden: { opacity: 0, y: 14 },
              shown: { opacity: 1, y: 0, transition: { delay: stageDelay(i), duration: 0.45, ease: "easeOut" } },
            }}
          >
            {/* Background behind the node + title so the main line stops at
                the node instead of showing in the gap before the title */}
            <div className="flex w-fit items-center gap-3 bg-[var(--color-bg)] pr-3">
              {stage.icon ? (
                <IconBadge name={stage.icon} />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[14px] font-bold text-[var(--color-primary-dark)] tabular-nums">
                  {i + 1}
                </span>
              )}
              <h3 className="font-serif text-[19px] font-bold text-[var(--color-fg)]">
                {stage.title}
              </h3>
            </div>
            {/* The branch: a line down from the node, steps beside it. On
                phones it's the bold main line, and its bottom padding carries
                it on to the next node. */}
            <ol
              className={`ml-5 flex flex-1 flex-col gap-5 border-l-2 border-[var(--color-primary)] pt-4 pl-7 lg:flex-none lg:border-l lg:border-[var(--color-border)] lg:pb-0 ${
                i < stages.length - 1 ? "pb-8" : "pb-2"
              }`}
            >
              {stage.steps.map((step) => (
                <li key={step.title}>
                  <h4 className="mb-1 text-[16px] font-bold text-[var(--color-fg)]">{step.title}</h4>
                  <p className="max-w-[46ch] text-[15px] leading-relaxed text-[var(--color-muted)]">{step.body}</p>
                </li>
              ))}
            </ol>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
