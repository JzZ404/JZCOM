"use client";

import type { Project } from "@/data/projects";
import type { CaseStudySkeleton } from "@/data/caseStudies";
import CaseStudyShell from "./CaseStudyShell";
import CaseStudySection from "./CaseStudySection";
import PlaceholderBlock from "./PlaceholderBlock";

// Barebones case-study renderer: a plain ordered list of numbered sections,
// each holding a labeled placeholder until real content replaces it. Same
// shell (sidebar, header, Detailed/TL;DR toggle, footer) as the built-out
// Nest page, just without any of Nest's bespoke section designs — those get
// added in per-section once there's real content to design around.
export default function CaseStudySkeletonPage({
  caseStudy,
  nextProject,
}: {
  caseStudy: CaseStudySkeleton;
  nextProject: Project;
}) {
  const tocItems = [
    { id: "overview", label: "Overview" },
    ...caseStudy.sections.map((section) => ({ id: section.id, label: section.title })),
  ];

  return (
    <CaseStudyShell caseStudy={caseStudy} tocItems={tocItems} nextProject={nextProject}>
      {caseStudy.sections.map((section) => (
        <CaseStudySection
          key={section.id}
          id={section.id}
          number={section.number}
          title={section.title}
        >
          <PlaceholderBlock label={section.placeholder} height={240} className="mb-11" />
        </CaseStudySection>
      ))}
    </CaseStudyShell>
  );
}
