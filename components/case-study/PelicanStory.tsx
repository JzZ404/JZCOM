"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { CaseStudyPelican } from "@/data/caseStudies";
import { inView, useHoverReplay } from "./researchMotion";

type Paragraph = CaseStudyPelican["whyWeBuiltThis"]["story"][number];

// The robot's lid orange (sampled from the photos) for the box, and a
// deeper shade behind the label's white text so it stays readable
const LID = "#E35F07";
const LABEL = "#B84A00";

// PELICAN's Why We Built This text: the lead, the paragraph about what the
// camera spots (with a bottle in the sentence, boxed like a YOLO
// detection), and the beak line.
// Sizes match Drunky's Why We Built This (17px body / 18px emphasis) so the
// two case studies read consistently.
export default function PelicanStory({ story }: { story: Paragraph[] }) {
  return (
    <>
      {story.map((paragraph, i) => {
        if (typeof paragraph === "string") {
          return (
            <p
              key={i}
              className={`text-[17px] leading-relaxed ${i === 0 ? "text-[var(--color-fg)]" : "text-[var(--color-muted)]"}`}
            >
              {paragraph}
            </p>
          );
        }
        if ("detection" in paragraph) return <DetectedParagraph key={i} text={paragraph.text} {...paragraph.detection} />;
        return (
          <p key={i} className="text-[18px] leading-relaxed font-bold text-[var(--color-primary)]">
            {paragraph.text}
          </p>
        );
      })}
    </>
  );
}

// The paragraph with its object in the sentence, at text size. As it
// scrolls in, the detection box snaps onto the object (from slightly too
// big, the way a tracker settles) and its class label and confidence appear
// on a tab, top-left as in the detector's overlay. Hovering runs the camera
// again.
function DetectedParagraph({ text, image, label }: { text: string; image: string; label: string }) {
  const { replays, replay, handlers } = useHoverReplay();
  const play = replay ? { animate: "shown" } : { whileInView: "shown", viewport: inView };
  const [before, after] = text.split("{detection}");
  // The word (or dash) just before the object stays on its line with it
  const [, lead, joined] = before.match(/^(.*\s)?(\S+\s*)$/) ?? [null, before, ""];
  return (
    // Taller lines leave room for the label tab above the box
    <p className="text-[17px] leading-[2.2] text-[var(--color-muted)]" {...handlers}>
      {lead}
      <span className="whitespace-nowrap">
        {joined}
        <motion.span
          key={replays}
          role="img"
          aria-label={label}
          className="relative mx-0.5 inline-block px-[3px] py-[2px] align-middle leading-none"
          initial="hidden"
          {...play}
        >
          {/* Hovering the bottle picks it up: a little closer, tipped over */}
          <motion.img
            src={image}
            alt=""
            className="block h-[2.8em] w-auto"
            whileHover={{ scale: 1.2, rotate: -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2px] border-[1.5px]"
            style={{ borderColor: LID }}
            variants={{ hidden: { opacity: 0, scale: 1.5 }, shown: { opacity: 1, scale: 1 } }}
            transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-full left-0 rounded-t-[2px] px-1 font-mono text-[9.5px] leading-[1.35] font-semibold whitespace-nowrap text-white"
            style={{ background: LABEL }}
            variants={{ hidden: { opacity: 0, y: 3 }, shown: { opacity: 1, y: 0 } }}
            transition={{ delay: 0.6, duration: 0.25, ease: "easeOut" }}
          >
            {label} <Confidence />
          </motion.span>
        </motion.span>
      </span>
      {after}
    </p>
  );
}

// A live-looking confidence score: jumps around 0.82–0.98 every few hundred
// milliseconds, like a detector's frame-by-frame readout. It only runs while
// on screen, and holds still with reduced motion on.
function Confidence() {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref);
  const still = useReducedMotion();
  const [score, setScore] = useState(0.92);
  useEffect(() => {
    if (!visible || still) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setScore(0.82 + Math.random() * 0.16);
      timer = setTimeout(tick, 250 + Math.random() * 350);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [visible, still]);
  return (
    <span ref={ref} className="tabular-nums">
      {score.toFixed(2)}
    </span>
  );
}
