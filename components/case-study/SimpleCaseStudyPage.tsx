"use client";

import type { Project } from "@/data/projects";
import type { CaseStudySimple } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import PlaceholderBlock from "./PlaceholderBlock";
import Reveal from "./Reveal";
import WildlifeCollage from "./WildlifeCollage";
import PhotoPair from "./PhotoPair";

export default function SimpleCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudySimple;
  nextProject: Project;
}) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    { id: "why", label: "Why We Built This" },
    { id: "technical-stack", label: "Technical Stack" },
    { id: "whats-next", label: "What's Next" },
  ];

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={tocItems} nextProject={nextProject}>
      <CaseStudySection id="why" number="01 — Why We Built This" title="Why We Built This">
        <div className="mb-11 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {caseStudy.whyWeBuiltThis.images?.length === 2 ? (
            <PhotoPair
              images={caseStudy.whyWeBuiltThis.images}
              alt={caseStudy.title}
              caption={caseStudy.whyWeBuiltThis.imageCaption}
            />
          ) : caseStudy.whyWeBuiltThis.images ? (
            <WildlifeCollage images={caseStudy.whyWeBuiltThis.images} alt={caseStudy.title} />
          ) : caseStudy.whyWeBuiltThis.image ? (
            <img
              src={caseStudy.whyWeBuiltThis.image}
              alt={`${caseStudy.title} — why we built this`}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <PlaceholderBlock label="why we built this — image" height={260} />
          )}
          <div className="flex flex-col justify-center gap-4">
            {caseStudy.whyWeBuiltThis.story.map((paragraph, i) => {
              const isEmphasis = typeof paragraph === "object";
              return (
                <p
                  key={i}
                  className={
                    isEmphasis
                      ? "text-[18px] leading-relaxed font-bold text-[var(--color-primary)]"
                      : "text-[16px] leading-relaxed text-[var(--color-muted)]"
                  }
                >
                  {isEmphasis ? paragraph.text : paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </CaseStudySection>

      <CaseStudySection id="technical-stack" number="02 — Technical Stack" title="Technical Stack">
        {caseStudy.technicalStack.image && (
          <img
            src={caseStudy.technicalStack.image}
            alt={`${caseStudy.title} technical stack`}
            className="mb-8 w-full rounded-xl object-contain"
          />
        )}
        {caseStudy.technicalStack.categories ? (
          <div className="mb-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudy.technicalStack.categories.map((category, i) => (
              <Reveal
                key={category.title}
                delay={i * 0.06}
                className="rounded-xl bg-[var(--color-card)] p-6"
              >
                <h3 className="mb-2 text-[16px] font-bold tracking-wider text-[var(--color-primary)] uppercase">
                  {category.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-[16px] leading-relaxed text-[var(--color-fg)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        ) : (
          <>
            {!caseStudy.technicalStack.image && (
              <PlaceholderBlock label="technical stack — diagram" height={220} className="mb-8" />
            )}
            <ul className="flex flex-col gap-3">
              {(caseStudy.technicalStack.items ?? []).map((item, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p className="text-[16px] leading-relaxed text-[var(--color-fg)]">• {item}</p>
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </CaseStudySection>

      <CaseStudySection id="whats-next" number="03 — What's Next" title="What's Next" className="mb-20">
        <ul className="flex flex-col gap-3">
          {caseStudy.whatsNext.map((item, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-[16px] leading-relaxed text-[var(--color-fg)]">• {item}</p>
            </Reveal>
          ))}
        </ul>
      </CaseStudySection>
    </CaseStudyShell>
  );
}
