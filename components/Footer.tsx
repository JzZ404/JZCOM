"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Just the social/contact links now — Work/Archive/About/Contact all
// dropped per Joyce, so this is purely "how to reach me," not a second
// site nav. All three get the same ↗ arrow already used on case-study
// "Live Demo" buttons.
const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/joycez0317/", label: "LinkedIn" },
  { href: "mailto:jiayiz54@uw.edu", label: "Email" },
  { href: "https://www.instagram.com/zhou_uy/", label: "Instagram" },
];

// Every page gets this except About — Joyce's call, her page ends on its
// own note rather than a repeated site-wide footer.
export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/about") return null;

  return (
    <footer className="border-t border-[var(--color-border)] px-4 py-6 sm:px-8">
      {/* flex-row unconditionally (no sm: breakpoint split) — logo and
          links share one line at every width instead of stacking on
          mobile, with gap/text size trimmed down so 3 links + arrows
          still fit a 375px-wide phone without wrapping. */}
      <div className="mx-auto flex max-w-6xl flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex shrink-0 items-end gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/about/cursor-cat-2x.png"
              alt=""
              aria-hidden
              className="h-5 w-5 object-contain"
            />
            <span className="font-notable text-xl tracking-tight text-[var(--color-primary)]">
              JZ
            </span>
          </Link>
          <span className="text-[12px] whitespace-nowrap text-[var(--color-muted)]">
            © {new Date().getFullYear()} Joyce Zhou
          </span>
        </div>
        <ul className="flex flex-row gap-x-4 text-[13px] font-semibold sm:gap-x-8 sm:text-[14px]">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 whitespace-nowrap text-[var(--color-fg)] no-underline transition-colors duration-150 hover:text-[var(--color-primary)]"
              >
                {link.label}
                <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
