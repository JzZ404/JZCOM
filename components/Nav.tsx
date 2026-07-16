import Link from "next/link";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Nav() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-semibold tracking-tight">
          Joyce Zhou
        </Link>
        <ul className="flex gap-6 text-sm">
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
