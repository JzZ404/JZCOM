type HeroSectionProps = {
  name: string;
  positioning: string;
  bio: string;
};

export default function HeroSection({ name, positioning, bio }: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-[length:var(--text-h1)] font-semibold tracking-tight">
        {name}
      </h1>
      <p className="mt-4 max-w-2xl text-[length:var(--text-h2)] text-[var(--color-fg)]">
        {positioning}
      </p>
      <p className="mt-6 max-w-2xl text-[length:var(--text-body)] text-[var(--color-muted)]">
        {bio}
      </p>
    </section>
  );
}
