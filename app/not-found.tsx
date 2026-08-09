import Link from "next/link";
import CatKeyboardMash from "@/components/CatKeyboardMash";

// Next.js renders this inside the root layout automatically (nav + main
// wrapper already applied there), so this only needs its own content.
// min-h-[calc(100vh-Nrem)] + centering — this page should read as one
// screen, not something you scroll through: 7rem of that is the pt-28
// the root layout's <main> already uses to clear the fixed nav, the rest
// accounts for the site Footer that renders below <main> on every page.
// That remainder is responsive, not a flat value, because the Footer
// itself wraps to two lines below the sm breakpoint (~104.5px measured)
// vs one line above it (~77px) — a flat subtraction sized for the
// one-line footer left mobile ~25px taller than the viewport and
// scrolling.
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-3xl flex-col items-center justify-center px-4 text-center sm:min-h-[calc(100vh-12rem)]">
      <span className="font-serif text-[80px] leading-none font-bold text-[var(--color-primary)] sm:text-[120px]">
        404
      </span>
      <h1 className="mt-4 font-serif text-[28px] leading-tight font-bold text-[var(--color-fg)] sm:text-[36px]">
        This page doesn&apos;t exist.
      </h1>

      {/* Full-bleed, breaks out of this section's max-w-3xl on purpose —
          see CatKeyboardMash. Also doubles as the old static subtitle:
          it types "My cat sat on the keyboard again." first, then keeps
          going straight into the mash with no break — one line, not two
          separate elements. */}
      <div className="mt-5 w-full">
        <CatKeyboardMash />
      </div>

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
