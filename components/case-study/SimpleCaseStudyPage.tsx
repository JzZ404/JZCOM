"use client";

import type { Project } from "@/data/projects";
import type { CaseStudySimple } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import PlaceholderBlock from "./PlaceholderBlock";
import Reveal from "./Reveal";
import WildlifeCollage from "./WildlifeCollage";
import PhotoPair from "./PhotoPair";
import PipelineStages from "./PipelineStages";
import ThresholdChart from "./ThresholdChart";
import IconBadge from "./IconBadge";
import FarmUnlocks from "./FarmUnlocks";
import FarmPlayground from "./FarmPlayground";

export default function SimpleCaseStudyPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudySimple;
  nextProject: Project;
}) {
  const hasWhy = Boolean(caseStudy.whyWeBuiltThis);
  const hasTechStack = Boolean(caseStudy.technicalStack);
  // Still just a PLACEHOLDER stand-in (Drunky/Pelican right now) — "Building
  // in progress..." is a more honest label than an empty "What's Next" with
  // nothing under it yet. Projects with a real roadmap (Poopidex, FocusFarm)
  // keep the normal title.
  const whatsNextIsPlaceholder = caseStudy.whatsNext.every(
    (item) => typeof item === "string" && item.includes("PLACEHOLDER"),
  );
  // Upgrades (title + detail + icon) get the locked-unlock tiles
  const whatsNextUnlocks = caseStudy.whatsNext.filter((item) => typeof item === "object");
  const whatsNextTitle = whatsNextIsPlaceholder ? "Building in progress..." : "What's Next";

  // Numbering stays sequential based on which sections actually render,
  // instead of jumping straight to "03 —" when the earlier ones are
  // skipped for a project that doesn't have that content yet.
  let sectionNumber = 0;
  const nextNumber = () => String(++sectionNumber).padStart(2, "0");

  const tocItems = [
    { id: "overview", label: "Overview" },
    ...(hasWhy ? [{ id: "why", label: "Why We Built This" }] : []),
    ...(caseStudy.playground ? [{ id: "playground", label: "Playground" }] : []),
    ...(hasTechStack ? [{ id: "technical-stack", label: "Technical Stack" }] : []),
    ...(caseStudy.pipeline ? [{ id: "pipeline", label: caseStudy.pipeline.title }] : []),
    { id: "whats-next", label: whatsNextTitle },
  ];

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={tocItems} nextProject={nextProject}>
      {hasWhy && caseStudy.whyWeBuiltThis && (
        <CaseStudySection id="why" number={`${nextNumber()} — Why We Built This`} title="Why We Built This">
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
            <Reveal variant="right" delay={0.15} className="flex flex-col justify-center gap-4">
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
            </Reveal>
          </div>
        </CaseStudySection>
      )}

      {caseStudy.playground && (
        <CaseStudySection id="playground" number={`${nextNumber()} — Playground`} title="Playground">
          {/* The island takes most of the row, its numbers stacked beside
              it (a row of four under it on narrower screens) */}
          <div className="mb-11 grid grid-cols-1 items-center gap-8 lg:grid-cols-[3fr_1fr] lg:gap-10">
            <Reveal variant="scale">
              <FarmPlayground animals={caseStudy.playground.animals} />
            </Reveal>
            <Reveal variant="right" delay={0.1} className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-1">
              {caseStudy.playground.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-[2rem] leading-none font-bold text-[var(--color-fg)] tabular-nums">
                    {stat.value}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-[var(--color-muted)]">{stat.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </CaseStudySection>
      )}

      {hasTechStack && caseStudy.technicalStack && (
        <CaseStudySection
          id="technical-stack"
          number={`${nextNumber()} — Technical Stack`}
          title="Technical Stack"
        >
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
                  delay={i * 0.07}
                  variant="scale"
                  className="rounded-xl bg-[var(--color-card)] p-6"
                >
                  <h3 className="mb-3 flex items-center gap-3 text-[14.5px] font-bold tracking-wider whitespace-nowrap text-[var(--color-primary)] uppercase">
                    {category.icon && <IconBadge name={category.icon} size="sm" />}
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
                  <li key={i}>
                    <Reveal delay={i * 0.06}>
                      <p className="text-[16px] leading-relaxed text-[var(--color-fg)]">• {item}</p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CaseStudySection>
      )}

      {caseStudy.pipeline && (
        <CaseStudySection
          id="pipeline"
          number={`${nextNumber()} — ${caseStudy.pipeline.title}`}
          title={caseStudy.pipeline.title}
        >
          {caseStudy.pipeline.intro && (
            <p className="mb-8 text-[16px] leading-relaxed text-[var(--color-muted)]">
              {caseStudy.pipeline.intro}
            </p>
          )}
          <div className="mb-11 flex flex-col gap-12">
            <PipelineStages stages={caseStudy.pipeline.stages} />
            {caseStudy.pipeline.thresholdChart &&
              (caseStudy.pipeline.liveView ? (
                // The app's own debug view on the left, the chart on the right
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
                  <Reveal variant="left">
                    <figure>
                      {caseStudy.pipeline.liveView.src.endsWith(".mp4") ? (
                        <video
                          src={caseStudy.pipeline.liveView.src}
                          poster={caseStudy.pipeline.liveView.poster}
                          aria-label={caseStudy.pipeline.liveView.alt}
                          className="w-full rounded-xl"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={caseStudy.pipeline.liveView.src}
                          alt={caseStudy.pipeline.liveView.alt}
                          className="w-full rounded-xl"
                        />
                      )}
                      {caseStudy.pipeline.liveView.caption && (
                        <figcaption className="mt-3 text-[14px] leading-relaxed text-[var(--color-muted)] italic">
                          {caseStudy.pipeline.liveView.caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                  <ThresholdChart {...caseStudy.pipeline.thresholdChart} />
                </div>
              ) : (
                <ThresholdChart {...caseStudy.pipeline.thresholdChart} />
              ))}
          </div>
        </CaseStudySection>
      )}

      <CaseStudySection
        id="whats-next"
        number={`${nextNumber()} — ${whatsNextTitle}`}
        title={whatsNextTitle}
        className="mb-20"
      >
        {whatsNextIsPlaceholder ? (
          <p className="text-[16px] leading-relaxed text-[var(--color-muted)]">
            Roadmap not written up yet — check back soon.
          </p>
        ) : whatsNextUnlocks.length ? (
          <FarmUnlocks items={whatsNextUnlocks} />
        ) : (
          <ul className="flex flex-col gap-3">
            {caseStudy.whatsNext.map((item, i) => (
              <li key={i}>
                <Reveal delay={i * 0.06}>
                  <p className="text-[16px] leading-relaxed text-[var(--color-fg)]">• {typeof item === "string" ? item : item.title}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </CaseStudySection>
    </CaseStudyShell>
  );
}
