"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AboutData } from "@/data/about";
import GradientCarousel from "@/components/GradientCarousel";

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

// Education-specific row: a school logo slot alongside the text, plus its
// own divider control instead of EntryList's blanket divide-y — consecutive
// entries from the same school (the three UCSD degrees/minor) share one
// shown logo and read as one group with no rule between them, while the
// logo's slot still reserves its width on every row so the text column
// keeps lining up whether or not that row shows a mark.
function EducationEntry({
  degree,
  subtitle,
  logo,
  divider,
}: {
  degree: React.ReactNode;
  subtitle: React.ReactNode;
  logo?: string;
  divider: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 ${divider ? "border-t border-[var(--color-border)]" : ""}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        {logo && <img src={logo} alt="" className="h-8 w-8 object-contain" />}
      </div>
      <div>
        <div className="font-semibold text-[var(--color-fg)]">{degree}</div>
        <div className="text-[14px] text-[var(--color-muted)]">{subtitle}</div>
      </div>
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

// Final pick, per Joyce: "design technologist" and "3+ years" share the
// same gentleWave style now (previously "3+ years" had its own taller
// boldWave) — the only difference between the two is however many wave
// repeats fit each phrase's own length, same as any other pair of
// differently-sized gentleWave phrases. UX/product design/AI/robotics
// settled on doubleWave (which robotics already had) since they read as
// one grouped list in the sentence rather than individually distinct
// terms.
//
// Styles are parametric (baseline/amplitude/half-wave-length in real
// pixels), not a fixed path string stretched 0-100 — a fixed path
// stretched to fit whatever width a phrase happens to render at made
// short phrases' waves look "shrunk" (same wave count, squeezed into
// less space) instead of just showing fewer waves at the same size. See
// buildWavePath below, which repeats a fixed-size wave exactly as many
// times as fits the phrase's own measured width.
type UnderlineStyle = { baseline: number; amplitude: number; halfWave: number; offset?: number; viewBoxHeight: number };

const UNDERLINE_STYLES = {
  gentleWave: { baseline: 7, amplitude: 5, halfWave: 11, viewBoxHeight: 14 },
  doubleWave: { baseline: 6, amplitude: 4, halfWave: 11, offset: 7, viewBoxHeight: 18 },
} satisfies Record<string, UnderlineStyle>;

// Explicit phrase -> style map, not a cycling index — this is the settled
// pick, not the exploration round's "show a different one per phrase so
// they're all visible at once." Phrases not listed here fall back to
// gentleWave, though in practice every highlighted phrase has an entry.
const STYLE_FOR_PHRASE: Record<string, UnderlineStyle> = {
  "design technologist": UNDERLINE_STYLES.gentleWave,
  "3+ years": UNDERLINE_STYLES.gentleWave,
  UX: UNDERLINE_STYLES.doubleWave,
  "product design": UNDERLINE_STYLES.doubleWave,
  AI: UNDERLINE_STYLES.doubleWave,
  robotics: UNDERLINE_STYLES.doubleWave,
};

// The "grouped list" phrases each get their own cursor emoji on hover —
// "design technologist" and "3+ years" don't, since Joyce only called
// out the four that read as one list in the sentence.
const CURSOR_EMOJI_FOR_PHRASE: Record<string, string> = {
  UX: "💭",
  "product design": "🎨",
  AI: "🪄",
  robotics: "🤖",
};

// Encodes `emoji` as an inline SVG and uses it as the CSS cursor image —
// same image-cursor technique the About page's cat cursor already uses
// (see .about-cat-cursor in globals.css), just built from a live emoji
// character instead of a PNG file. 16 16 centers the hotspot on the glyph.
function emojiCursor(emoji: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text x='16' y='23' font-size='26' text-anchor='middle'>${emoji}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 16 16, pointer`;
}

// Builds a smooth wave spanning exactly `width` px, baseline at `baseline`,
// swinging `amplitude` px either side, repeating roughly every `targetHalfWave`
// px — rounded to a whole number of half-waves so the pattern always ends
// cleanly at the right edge instead of cutting off mid-curve.
function buildWavePath(width: number, baseline: number, amplitude: number, targetHalfWave: number): string {
  const segments = Math.max(2, Math.round(width / targetHalfWave));
  const halfWave = width / segments;
  let d = `M0,${baseline} Q${halfWave / 2},${baseline - amplitude} ${halfWave},${baseline}`;
  for (let i = 2; i <= segments; i++) {
    d += ` T${halfWave * i},${baseline}`;
  }
  return d;
}

// One highlighted phrase — its own ref/measured-width state, since the
// wave path has to be rebuilt in real pixels once we know how wide the
// phrase actually rendered (see buildWavePath above).
function HighlightedPhrase({
  text,
  style,
  cursorEmoji,
}: {
  text: string;
  style: UnderlineStyle;
  cursorEmoji?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function measure() {
      if (ref.current) setWidth(ref.current.offsetWidth);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    // group + whileHover/initial on the parent, variants (not their own
    // whileHover) on the paths below — Framer propagates the active
    // variant name down to descendant motion components, so hovering
    // this span is what drives the squiggle's draw-on, with no
    // scale/zoom on the text itself. The color change is plain CSS
    // (group-hover), not a Framer-animated value, since Framer can't
    // tween between two var(--color-*) references. cursorEmoji (an
    // inline style, not a class) overrides cursor-default below only
    // for the phrases that have one.
    <motion.span
      ref={ref}
      initial="rest"
      whileHover="draw"
      style={cursorEmoji ? { cursor: emojiCursor(cursorEmoji) } : undefined}
      className="group relative inline-block cursor-default"
    >
      <span className="text-[var(--color-fg)] transition-colors duration-200 group-hover:text-[var(--color-primary-dark)]">
        {text}
      </span>
      {/* Phrases with a custom cursor emoji skip the squiggle entirely —
          the emoji cursor is the hover feedback for those, not a second
          decoration stacked on top of it. */}
      {width > 0 && !cursorEmoji && (
        <svg
          width={width}
          height={style.viewBoxHeight}
          viewBox={`0 0 ${width} ${style.viewBoxHeight}`}
          aria-hidden
          // calc(100% - 4px), not top-full — top-full sat right at the
          // text line-box's own bottom edge, which left a visible gap
          // under the actual glyphs once leading-relaxed widened that
          // line-box. Pulling it up tucks it right under the letters.
          className="absolute left-0 text-[var(--color-primary)]"
          style={{ top: "calc(100% - 4px)" }}
        >
          <motion.path
            d={buildWavePath(width, style.baseline, style.amplitude, style.halfWave)}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            variants={{ rest: { pathLength: 0 }, draw: { pathLength: 1 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {style.offset != null && (
            <motion.path
              d={buildWavePath(width, style.baseline + style.offset, style.amplitude, style.halfWave)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              variants={{ rest: { pathLength: 0 }, draw: { pathLength: 1 } }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            />
          )}
        </svg>
      )}
    </motion.span>
  );
}

// Same phrase-matching idea as HighlightedText above, but for the big
// display header rather than running body copy — each match gets a
// hand-drawn-style squiggle underneath instead of bold/color, and the
// squiggle draws itself on left-to-right (Framer's pathLength) on hover,
// not on scroll-into-view. A plain CSS color shift is the rest of the
// "highlight it" effect — no scale/zoom, per Joyce.
function SquiggleHighlight({ lines, highlights }: { lines: string[]; highlights: string[] }) {
  const pattern = new RegExp(`(${highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

  return (
    <>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(pattern).map((part, i) =>
            highlights.includes(part) ? (
              <HighlightedPhrase
                key={i}
                text={part}
                style={STYLE_FOR_PHRASE[part] ?? UNDERLINE_STYLES.gentleWave}
                cursorEmoji={CURSOR_EMOJI_FOR_PHRASE[part]}
              />
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </Fragment>
      ))}
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
    // Cat cursor retired per Joyce — back to the system default. The
    // .about-cat-cursor rule itself (and .cursor-sparkle on individual
    // elements below) is left in globals.css/HobbyCarousel.tsx rather
    // than deleted; dropping this className is what actually turns it
    // off, since nothing else applies that class.
    <section className="mx-auto max-w-6xl px-3 pt-2 pb-20">
      {/* Gallery leads the page now — Joyce's headshot sits in it as the
          middle/default-active card (see about.ts), so this does double
          duty as both the hobby gallery and the page's lead visual. No
          "Outside of Work" label here; that heading made sense further
          down the page, not as the very first thing before any intro. */}
      <BoldReveal className="mb-4 drop-shadow-[0px_14px_28px_rgba(0,0,0,0.14)]">
        <GradientCarousel hobbies={about.hobbies} />
      </BoldReveal>

      <BoldReveal className="mx-auto mb-14 text-center" delay={0.1}>
        {/* Wider than the body paragraph below on purpose — stretched out
            so this wraps to three lines instead of four or five, per
            Joyce, rather than matching the body's narrower reading width.
            leading-relaxed (not leading-tight) gives the now-3-line
            header more breathing room between lines. */}
        <h1 className="mx-auto mb-6 max-w-6xl font-serif text-[32px] leading-relaxed font-bold text-[var(--color-fg)]">
          <SquiggleHighlight lines={about.introHeaderLines} highlights={about.introHeaderHighlights} />
        </h1>
        {/* max-w-[823px] isn't an arbitrary round number — it's the
            measured width of the header's own third line ("moving
            across UX, product design, AI, and robotics.") at a standard
            desktop viewport, so this paragraph's own edges line up with
            that line's, not just share the same vague "narrower" idea
            max-w-2xl (672px) gave it before. */}
        <p className="mx-auto max-w-[823px] text-[20px] leading-relaxed text-[var(--color-fg)]">
          <HighlightedText text={about.introBody} highlights={about.introHighlights} />
        </p>
      </BoldReveal>

      <div className="mb-14 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
        <BoldReveal>
          <Section title="Education">
            <div>
              {about.education.map((item, i) => {
                const prev = about.education[i - 1];
                const sameGroup = i > 0 && prev.school === item.school;
                return (
                  <EducationEntry
                    key={i}
                    degree={item.degree}
                    subtitle={
                      <>
                        {item.school}
                        {item.timeframe && <> · {item.timeframe}</>}
                      </>
                    }
                    logo={sameGroup ? undefined : item.logo}
                    divider={i > 0 && !sameGroup}
                  />
                );
              })}
            </div>
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
          <Section title="Hackathons">
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
                  // host · timeframe, matching Experience's own
                  // location-then-date subtitle pattern (host standing
                  // in for location here, since competitions don't have
                  // a separate location field) — role no longer shown
                  // on this line, though it stays in the data.
                  subtitle={`${item.host} · ${item.timeframe}`}
                />
              ))}
            </EntryList>
          </Section>
        </BoldReveal>

        {/* gap-[25.5px], not gap-14 (56px) — tightened by exactly the
            measured overshoot so Certifications' own bottom edge lines
            up with Competitions' bottom edge in the column beside it. */}
        <BoldReveal delay={0.1} className="flex flex-col gap-[25.5px]">
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
