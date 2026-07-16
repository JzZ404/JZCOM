import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Joyce Zhou",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">Contact</h1>
      {/* PLACEHOLDER — real contact method(s) confirmed by Joyce */}
      <p className="mt-6 text-[var(--color-fg)]">
        PLACEHOLDER — confirm with Joyce.{" "}
        <a href="mailto:hello@example.com" className="underline hover:text-[var(--color-accent)]">
          hello@example.com
        </a>
      </p>
    </section>
  );
}
