import type { CaseStudyShellData } from "./CaseStudyShell";
import CaseStudyLinkIcons from "./CaseStudyLinkIcons";
import { usePdfSiteUrl } from "./PdfMode";

// The PDF portfolio's cover page for a case study: the cover image edge to
// edge across the top (a finished composition, logo and all, so cropped
// only as much as the band needs), and a band beneath with the title, the one-line description, and
// the project facts. The export gives it a whole page with no margins
// (data-pdf-bleed).
export default function PdfCover({ caseStudy, image }: { caseStudy: CaseStudyShellData; image: string }) {
  const siteUrl = usePdfSiteUrl();
  return (
    <div id="overview" data-pdf-bleed className="flex flex-col bg-[var(--color-bg)]">
      {/* The image takes whatever height the band leaves, trimming a sliver
          off its top and bottom when the band runs tall */}
      <img
        src={image}
        alt={caseStudy.heroLabel}
        className="block min-h-0 w-full flex-1 object-cover"
        style={{ objectPosition: caseStudy.heroImagePosition ?? "center 60%" }}
      />
      <div className="grid shrink-0 grid-cols-[1fr_1fr] items-center gap-16 px-14 py-8">
        <div>
          <div className="flex items-center gap-5">
            {/* A long title ("Helport: AI Copilot for Live Calls") steps
                down so it stays on one or two lines */}
            <h1
              className={`font-serif leading-[1.05] font-bold text-balance text-[var(--color-fg)] ${
                caseStudy.title.length > 16 ? "text-[40px]" : "text-[64px]"
              }`}
            >
              {caseStudy.title}
            </h1>
            {caseStudy.links && <CaseStudyLinkIcons links={caseStudy.links} />}
            {siteUrl && (
              <a
                href={siteUrl}
                className="shrink-0 rounded-full border border-[var(--color-primary)] px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-[var(--color-primary)] no-underline"
              >
                View on website ↗
              </a>
            )}
          </div>
          <p className="mt-3 text-[17px] leading-snug font-semibold text-pretty text-[var(--color-muted)]">
            {caseStudy.subheading}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-10 gap-y-4">
          {caseStudy.meta.map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] font-semibold tracking-wider text-[var(--color-primary)] uppercase">
                {item.label}
              </dt>
              <dd className="text-[15px] leading-snug font-semibold text-[var(--color-fg)]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
