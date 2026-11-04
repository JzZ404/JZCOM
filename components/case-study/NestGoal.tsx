import { CalendarCheck, CalendarDays, UsersRound, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

type Goal = {
  what: { label: string; text: string };
  who: { label: string; text: string };
  measure: { label: string; items: string[] };
};

// One mark per measure, in order, in the HMW notes' lime / mint / periwinkle
const MEASURE_MARKS: { Icon: LucideIcon; bg: string; fg: string }[] = [
  { Icon: CalendarCheck, bg: "rgba(141, 198, 63, 0.22)", fg: "#4F7F1A" },
  { Icon: CalendarDays, bg: "rgba(126, 238, 196, 0.35)", fg: "#1F7A5A" },
  { Icon: UsersRound, bg: "rgba(140, 147, 240, 0.25)", fg: "#4048B8" },
];

const LABEL = "mb-2 font-mono text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase";

// The goal statement in its three parts: what Nest does and who it serves on
// the left, how success is measured on the right as three checkable metrics.
export default function NestGoal({ goal }: { goal: Goal }) {
  return (
    <div className="mb-11 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col gap-4">
        {[goal.what, goal.who].map((part, i) => (
          <Reveal key={part.label} variant="left" delay={i * 0.08} className="flex-1 rounded-xl bg-[var(--color-card)] p-7">
            <div className={LABEL}>{part.label}</div>
            <p className="text-[17px] leading-relaxed text-[var(--color-fg)]">{part.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal variant="right" delay={0.15} className="flex flex-col rounded-xl bg-[var(--color-card)] p-7">
        <div className={LABEL}>{goal.measure.label}</div>
        {/* The list centered in the card's space below the label, both ways;
            items stay left-aligned inside it so the icons line up */}
        <ul className="mx-auto flex w-fit flex-1 flex-col justify-center gap-5 py-2">
          {goal.measure.items.map((item, i) => {
            const mark = MEASURE_MARKS[i % MEASURE_MARKS.length];
            return (
              <li key={item} className="flex items-start gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ background: mark.bg }}
                >
                  <mark.Icon aria-hidden className="h-5 w-5" color={mark.fg} strokeWidth={2} />
                </span>
                <span className="pt-2.5 text-[16px] leading-snug font-semibold text-[var(--color-fg)]">{item}</span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
