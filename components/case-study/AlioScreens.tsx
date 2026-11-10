import type { CaseStudyAlio } from "@/data/caseStudies";

type Group = NonNullable<CaseStudyAlio["screens"]>[number];

// Each app gets a band tinted with one of Alio's own accents: the indigo
// of its buttons and cards for the caregiver app, the lime of its Press to
// Speak button for the family app
const TINTS = ["color-mix(in srgb, #5B5FEF 9%, white)", "color-mix(in srgb, #B9DA4F 16%, white)"];

// Every screen of both apps, for the PDF portfolio: one band per app, the
// screens in the order someone moves through them, each with a short
// caption. Phones are the same size in every band (sized to fit nine
// across the page), so a shorter band just ends sooner.
export default function AlioScreens({ groups }: { groups: Group[] }) {
  return (
    <div className="mb-11 flex flex-col gap-4" style={{ containerType: "inline-size" }}>
      {groups.map((group, g) => (
        <section key={group.app} className="w-fit max-w-full rounded-2xl p-5" style={{ background: TINTS[g % TINTS.length] }}>
          <div className="mb-4 flex items-baseline gap-4">
            <h3 className="shrink-0 font-serif text-[19px] font-bold text-[var(--color-fg)]">{group.app}</h3>
            <p className="text-[14px] leading-snug text-[var(--color-muted)]">{group.intro}</p>
          </div>
          <ol className="flex gap-3">
            {group.items.map((item) => (
              <li key={item.src} className="shrink-0" style={{ width: "calc((100cqw - 40px - 8 * 12px) / 9)" }}>
                <img
                  src={item.src}
                  alt={`${group.app}: ${item.title}`}
                  width={393}
                  height={852}
                  className="block h-auto w-full rounded-[14px] shadow-[0_8px_18px_-8px_rgba(40,40,90,0.35)]"
                />
                <div className="mt-2.5 text-center text-[12.5px] leading-tight font-semibold text-[var(--color-fg)]">
                  {item.title}
                </div>
                <p className="mt-0.5 text-center text-[11px] leading-snug text-[var(--color-muted)]">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
