type DemoCardProps = {
  name: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export default function DemoCard({ name, description, children, className = "" }: DemoCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-mono text-sm font-semibold text-[var(--color-fg)]">{name}</h3>
        {description && (
          <p className="text-[length:var(--text-caption)] text-[var(--color-muted)]">
            {description}
          </p>
        )}
      </div>
      <div
        className={`flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
