"use client";

import { motion } from "framer-motion";
import type { AboutData } from "@/data/about";
import HobbyCarousel from "@/components/HobbyCarousel";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-serif text-[length:var(--text-h2)] font-bold text-[var(--color-fg)]">
        {title}
      </h2>
      {children}
    </div>
  );
}

// Every entry list shares this treatment — a horizontal rule between
// entries (not after the last one) so each degree/role/award reads as
// its own line item instead of running together.
function EntryList({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-[var(--color-border)]">{children}</div>;
}

function Entry({ title, subtitle }: { title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="font-semibold text-[var(--color-fg)]">{title}</div>
      <div className="text-[14px] text-[var(--color-muted)]">{subtitle}</div>
    </div>
  );
}

// Colors + bolds each highlight phrase where it appears in `text` — same
// "call out the key terms" treatment as the hero headline's UX/AI/Robotics
// bolding, plus a hover shift so the keywords read as a little interactive.
function HighlightedText({ text, highlights }: { text: string; highlights: string[] }) {
  const pattern = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        highlights.includes(part) ? (
          <strong
            key={i}
            className="text-[var(--color-primary)] transition-colors duration-200 hover:text-[var(--color-primary-dark)]"
          >
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

// Bouncier, more pronounced reveal than the rest of the site's subtle
// fade/rise — this page is the playful one, so the scroll-in gets a spring
// overshoot and a slight rotation instead of a plain easeOut fade.
function BoldReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 56, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.83v2.15h.05c.53-1 1.83-2.15 3.77-2.15 4.03 0 4.77 2.65 4.77 6.1V24h-4v-7.5c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V24h-4V8.5z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.16c3.2 0 3.58.012 4.85.07 1.17.055 1.97.24 2.43.41.58.22 1 .48 1.44.92.44.44.7.86.92 1.44.17.46.36 1.26.41 2.43.058 1.27.07 1.65.07 4.85s-.012 3.58-.07 4.85c-.055 1.17-.24 1.97-.41 2.43a3.9 3.9 0 01-.92 1.44 3.9 3.9 0 01-1.44.92c-.46.17-1.26.36-2.43.41-1.27.058-1.65.07-4.85.07s-3.58-.012-4.85-.07c-1.17-.055-1.97-.24-2.43-.41a3.9 3.9 0 01-1.44-.92 3.9 3.9 0 01-.92-1.44c-.17-.46-.36-1.26-.41-2.43-.058-1.27-.07-1.65-.07-4.85s.012-3.58.07-4.85c.055-1.17.24-1.97.41-2.43.22-.58.48-1 .92-1.44.44-.44.86-.7 1.44-.92.46-.17 1.26-.36 2.43-.41 1.27-.058 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.014 7.05.072 5.77.13 4.9.33 4.14.62c-.79.31-1.46.72-2.13 1.39C1.34 2.68.93 3.35.62 4.14.33 4.9.13 5.77.072 7.05.014 8.33 0 8.74 0 12s.014 3.67.072 4.95c.058 1.28.258 2.15.548 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.29 1.63.49 2.91.548C8.33 23.986 8.74 24 12 24s3.67-.014 4.95-.072c1.28-.058 2.15-.258 2.91-.548a5.9 5.9 0 002.13-1.39 5.9 5.9 0 001.39-2.13c.29-.76.49-1.63.548-2.91.058-1.28.072-1.69.072-4.95s-.014-3.67-.072-4.95c-.058-1.28-.258-2.15-.548-2.91a5.9 5.9 0 00-1.39-2.13A5.9 5.9 0 0019.86.62c-.76-.29-1.63-.49-2.91-.548C15.67.014 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M2 4h20v16H2V4zm2 2.24V18h16V6.24l-8 6-8-6zM4.7 6l7.3 5.48L19.3 6H4.7z" />
    </svg>
  ),
};

export default function AboutPageContent({ about }: { about: AboutData }) {
  return (
    <section
      style={{
        cursor:
          "image-set(url(/images/about/cursor-cat-1x.png) 1x, url(/images/about/cursor-cat-2x.png) 2x) 14 14, auto",
      }}
      className="about-cat-cursor mx-auto max-w-6xl px-4 pt-6 pb-20"
    >
      <BoldReveal className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-[420px_1fr] sm:items-center">
        <img
          src={about.photo}
          alt="Joyce Zhou"
          width={600}
          height={900}
          style={{ borderRadius: "63% 37% 54% 46% / 43% 37% 63% 57%" }}
          className="cursor-sparkle aspect-[4/5] w-full object-cover"
        />
        <div>
          <h1 className="mb-8 font-serif text-[32px] leading-tight font-bold text-[var(--color-fg)]">
            {about.introHeader}
          </h1>
          <p className="text-[20px] leading-relaxed text-[var(--color-fg)]">
            <HighlightedText text={about.introBody} highlights={about.introHighlights} />
          </p>
        </div>
      </BoldReveal>

      <div className="mb-14 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
        <BoldReveal>
          <Section title="Education">
            <EntryList>
              {about.education.map((item, i) => (
                <Entry
                  key={i}
                  title={item.degree}
                  subtitle={
                    <>
                      {item.school}
                      {item.timeframe && <> · {item.timeframe}</>}
                    </>
                  }
                />
              ))}
            </EntryList>
          </Section>
        </BoldReveal>

        <BoldReveal delay={0.1}>
          <Section title="Professional Experience">
            <EntryList>
              {about.experience.map((item, i) => (
                <Entry
                  key={i}
                  title={`${item.role} — ${item.org}`}
                  subtitle={`${item.timeframe} · ${item.location}`}
                />
              ))}
            </EntryList>
          </Section>
        </BoldReveal>
      </div>

      <div className="mb-14 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
        <BoldReveal>
          <Section title="Competitions & Hackathons">
            <EntryList>
              {about.competitions.map((item, i) => (
                <Entry
                  key={i}
                  title={
                    <>
                      {item.name}
                      {item.result && <> — {item.result}</>}
                    </>
                  }
                  subtitle={`${item.role} · ${item.host} · ${item.timeframe}`}
                />
              ))}
            </EntryList>
          </Section>
        </BoldReveal>

        <BoldReveal delay={0.1} className="flex flex-col gap-14">
          <Section title="Leadership">
            <EntryList>
              {about.leadership.map((item, i) => (
                <Entry key={i} title={`${item.role} — ${item.org}`} subtitle={item.timeframe} />
              ))}
            </EntryList>
          </Section>

          <Section title="Certifications">
            <EntryList>
              {about.certifications.map((cert, i) => (
                <div key={i} className="py-3 first:pt-0 last:pb-0">
                  <div className="text-[15px] text-[var(--color-fg)]">{cert}</div>
                </div>
              ))}
            </EntryList>
          </Section>
        </BoldReveal>
      </div>

      <BoldReveal className="mb-14">
        <Section title="Outside of Work">
          <HobbyCarousel hobbies={about.hobbies} />
        </Section>
      </BoldReveal>

      <BoldReveal>
        <Section title="Connect">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.socials.map((social, i) => (
              <li key={i}>
                <a
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-4 text-[var(--color-fg)] no-underline transition-colors hover:border-[var(--color-primary)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[var(--color-primary)]">{SOCIAL_ICONS[social.label]}</span>
                    <span className="font-semibold">{social.label}</span>
                  </span>
                  <span className="text-[var(--color-muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--color-primary)]">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </BoldReveal>
    </section>
  );
}
