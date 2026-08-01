"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DemoCard from "./DemoCard";

function ShimmerBar({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-[var(--color-border)] ${className}`}>
      <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]" />
    </div>
  );
}

function ShimmerSkeleton() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <ShimmerBar className="h-4 w-3/4" />
      <ShimmerBar className="h-4 w-full" />
      <ShimmerBar className="h-4 w-1/2" />
    </div>
  );
}

function ProgressBar() {
  const [key, setKey] = useState(0);
  return (
    <div className="w-full max-w-xs">
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <motion.div
          key={key}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          onAnimationComplete={() => setTimeout(() => setKey((k) => k + 1), 500)}
          className="h-full rounded-full bg-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}

function SpinnerVariants() {
  return (
    <div className="flex items-center gap-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-8 w-8 rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]"
      />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]"
          />
        ))}
      </div>
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="h-6 w-6 rounded-full bg-[var(--color-accent)]"
      />
    </div>
  );
}

export default function LoadingStates() {
  return (
    <section>
      <h2 className="text-[length:var(--text-h2)] font-semibold">Loading states</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard name="Shimmer Skeleton">
          <ShimmerSkeleton />
        </DemoCard>
        <DemoCard name="Progress Bar">
          <ProgressBar />
        </DemoCard>
        <DemoCard name="Spinner Variants">
          <SpinnerVariants />
        </DemoCard>
      </div>
    </section>
  );
}
