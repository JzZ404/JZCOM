type HeadlineSegment = {
  text: string;
  bold?: boolean;
};

type HeroSectionProps = {
  name: string;
  leadWord: string; // regular-weight lead-in, e.g. "A"
  headlineLine1: string; // bold, continues leadWord on the same visual line
  headlineLine2: HeadlineSegment[]; // mixed weight, forced onto its own line
};

export default function HeroSection({
  name,
  leadWord,
  headlineLine1,
  headlineLine2,
}: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-40 pb-16 text-center">
      <p className="font-serif text-[length:var(--text-greeting)] text-[var(--color-fg)]">
        Hi! I&rsquo;m {name}
        <span aria-hidden>👋</span>
      </p>
      <h1 className="mt-4 font-serif text-[length:var(--text-display)] leading-[1.15] tracking-tight text-[var(--color-fg)]">
        <span className="font-normal">{leadWord} </span>
        <span className="font-bold">{headlineLine1}</span>
        <br />
        {headlineLine2.map((segment, i) => (
          <span key={i} className={segment.bold ? "font-bold" : "font-normal"}>
            {segment.text}
          </span>
        ))}
      </h1>
    </section>
  );
}
