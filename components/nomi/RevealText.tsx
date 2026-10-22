"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TICK_MS = 35;

// Nomi's reply appearing word by word, each word softly fading in. The API
// streams text in uneven bursts (often the whole short answer in under a
// second); this paces it out at a steady reading speed instead. While the
// reply is still streaming, the last word is held back (it may be half a word).
export default function RevealText({
  text,
  streaming,
  animate,
  onProgress,
  onDone,
}: {
  text: string;
  streaming: boolean;
  animate: boolean; // false = show it all at once (reduced motion, or already revealed)
  onProgress?: () => void;
  onDone?: () => void;
}) {
  const tokens = text.split(/(\s+)/).filter(Boolean);
  const available = streaming ? Math.max(0, tokens.length - 1) : tokens.length;
  const [shown, setShown] = useState(animate ? 0 : tokens.length);
  const availableRef = useRef(available);
  useEffect(() => {
    availableRef.current = available;
  }, [available]);
  const doneRef = useRef(!animate);

  useEffect(() => {
    if (!animate) return;
    const timer = setInterval(() => {
      setShown((s) => {
        const target = availableRef.current;
        if (s >= target) return s;
        // One token (a word or the space after it) per tick ≈ 14 words/s —
        // a comfortable reading pace. Doubles only for a very long backlog.
        return Math.min(target, s + (target - s > 120 ? 2 : 1));
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [animate]);

  useEffect(() => {
    onProgress?.();
    if (!doneRef.current && !streaming && shown >= tokens.length) {
      doneRef.current = true;
      onDone?.();
    }
  }, [shown, streaming, tokens.length, onProgress, onDone]);

  if (!animate) return <span className="whitespace-pre-line">{text}</span>;
  return (
    <span className="whitespace-pre-line">
      {tokens.slice(0, shown).map((token, i) =>
        /^\s+$/.test(token) ? (
          token
        ) : (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(3px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {token}
          </motion.span>
        ),
      )}
    </span>
  );
}
