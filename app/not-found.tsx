import Link from "next/link";

// Next.js renders this inside the root layout automatically (nav + main
// wrapper already applied there), so this only needs its own content.
export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <span className="font-serif text-[80px] leading-none font-bold text-[var(--color-primary)] sm:text-[120px]">
        404
      </span>
      <h1 className="mt-4 font-serif text-[28px] leading-tight font-bold text-[var(--color-fg)] sm:text-[36px]">
        This page wandered off.
      </h1>
      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[var(--color-muted)]">
        Whatever you're looking for isn't here — it may have moved or never existed.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/#work"
          className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-[15px] font-semibold text-[var(--color-fg)] no-underline transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        >
          See the work
        </Link>
      </div>
    </section>
  );
}
