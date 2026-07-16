import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Joyce Zhou",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">About</h1>
      {/* PLACEHOLDER — full About copy comes from Joyce, not invented here */}
      <p className="mt-6 max-w-2xl text-[var(--color-fg)]">
        PLACEHOLDER — confirm with Joyce. Longer bio, background, and how she works
        goes here.
      </p>
    </section>
  );
}
