import Link from "next/link";

// Nav content matches Joyce's hero reference (Work / Archive / About).
// Contact still exists at /contact — just not linked here for now; add it
// back (or move it into a footer) if that was an oversight in the reference.
const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
] as const;

export default function Nav() {
  return (
    <header>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-8">
        <Link
          href="/"
          className="text-xl font-black uppercase tracking-tight text-[var(--color-accent)]"
        >
          JZ
        </Link>
        <ul className="flex gap-20 text-[15px] font-bold">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-[var(--color-accent)]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
