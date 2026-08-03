"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Nav content matches Joyce's hero reference (Work / Archive / About).
// Work lives on the home page as a scrollable section (#work), not a
// separate route — the /work URL still exists as a direct-link fallback.
// Contact still exists at /contact — just not linked here for now; add it
// back (or move it into a footer) if that was an oversight in the reference.
const LINKS = [
  { href: "/#work", label: "Work", anchor: "work" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
] as const;

type Ripple = { id: number; x: number; y: number };

export default function Nav() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Record<string, Ripple[]>>({});
  const [scrolled, setScrolled] = useState(false);
  // Suppresses the nav's own transition for exactly one paint after a
  // navigation — without this, switching from a scrolled page to a fresh
  // (unscrolled) one animates the nav sliding from its floating pill back
  // to flush, since the CSS transition can't tell a route change from an
  // actual scroll.
  const [suppressTransition, setSuppressTransition] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigating resets scroll to the top and can leave the hover pill's
  // layoutId mid-flight while the nav itself snaps from floating back to
  // flush — clearing the hover state avoids that jump.
  useEffect(() => {
    setHovered(null);
    setSuppressTransition(true);
    setScrolled(window.scrollY > 20);
    const id = requestAnimationFrame(() => setSuppressTransition(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  function spawnRipple(key: string, e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    const ripple = { id, x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), ripple] }));
    setTimeout(() => {
      setRipples((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((r) => r.id !== id) }));
    }, 600);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between border ${
          suppressTransition ? "" : "transition-all duration-300"
        } ${
          scrolled
            ? "mt-2 rounded-full border-[var(--color-border)] bg-[var(--color-bg)]/8 px-4 py-2.5 shadow-lg backdrop-blur-lg backdrop-saturate-150 sm:px-8 sm:py-3"
            : "mt-0 rounded-none border-transparent bg-transparent px-4 py-5 shadow-none backdrop-blur-none sm:px-8 sm:py-8"
        }`}
      >
        {/* cat + "JZ" move as one unit — the -translate-y-0.5 here nudges
            the whole group up to match the nav links' optical baseline,
            the +translate-y-0.5 on the cat is a separate, smaller offset
            just between the icon and the text within the group. */}
        <Link href="/" className="flex -translate-y-0.5 items-center gap-2">
          <img
            src="/images/about/cursor-cat-2x.png"
            alt=""
            aria-hidden
            className="h-5 w-5 translate-y-0.5 object-contain sm:h-6 sm:w-6"
          />
          <span className="font-notable text-xl tracking-tight text-[var(--color-primary)] sm:text-2xl">
            JZ
          </span>
        </Link>
        <ul
          className="flex gap-4 text-[14px] font-bold sm:gap-10 sm:text-[17px]"
          onMouseLeave={() => setHovered(null)}
        >
          {LINKS.map((link) => (
            <li
              key={link.href}
              onMouseEnter={() => setHovered(link.href)}
              className="relative"
            >
              {hovered === link.href && (
                <motion.div
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -mx-3 -my-1.5 rounded-full bg-[var(--color-primary)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Link
                href={link.href}
                onClick={(e) => {
                  spawnRipple(link.href, e);
                  if ("anchor" in link && pathname === "/") {
                    e.preventDefault();
                    document.getElementById(link.anchor)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`relative z-10 block overflow-hidden rounded-full px-3 py-1.5 transition-colors duration-150 ${
                  hovered === link.href ? "text-white" : ""
                }`}
              >
                {link.label}
                {(ripples[link.href] ?? []).map((ripple) => (
                  <motion.span
                    key={ripple.id}
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: 120, height: 120, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ left: ripple.x, top: ripple.y }}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50"
                  />
                ))}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
