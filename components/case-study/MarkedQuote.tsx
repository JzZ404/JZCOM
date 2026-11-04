"use client";

import { motion } from "framer-motion";

// A pull-quote (big opening mark, serif text) with key phrases marked as if
// by a highlighter: the mark sweeps across each phrase, left to right, the
// first time the quote scrolls into view. `color` is the highlighter ink.
export default function MarkedQuote({
  text,
  highlights = [],
  color,
}: {
  text: string;
  highlights?: string[];
  color: string;
}) {
  const escaped = highlights.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = escaped.length ? text.split(new RegExp(`(${escaped.join("|")})`, "g")) : [text];
  let marked = 0;

  return (
    <motion.figure
      className="relative mb-11 w-full pl-8 sm:pl-12"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div aria-hidden className="absolute top-0 left-0 font-serif text-[5.5rem] leading-none text-[var(--color-border)]">
        “
      </div>
      <blockquote className="pt-7 font-serif text-[22px] leading-relaxed text-[var(--color-fg)]">
        {parts.map((part, i) => {
          if (!highlights.includes(part)) return <span key={i}>{part}</span>;
          const order = marked++;
          return (
            <motion.mark
              key={i}
              className="box-decoration-clone bg-no-repeat px-0.5 font-semibold text-[var(--color-fg)]"
              // The highlighter stroke: a band behind the lower part of the
              // text, drawn by growing its width
              style={{
                backgroundColor: "transparent",
                backgroundImage: `linear-gradient(${color}, ${color})`,
                backgroundPosition: "0 88%",
              }}
              variants={{
                hidden: { backgroundSize: "0% 45%" },
                shown: {
                  backgroundSize: "100% 45%",
                  transition: { duration: 0.7, ease: "easeInOut", delay: 0.4 + order * 0.45 },
                },
              }}
            >
              {part}
            </motion.mark>
          );
        })}
      </blockquote>
    </motion.figure>
  );
}
