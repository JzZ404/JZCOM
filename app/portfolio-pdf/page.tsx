import type { Metadata } from "next";
import { projects } from "@/data/projects";
import {
  alioCaseStudy,
  caseStudies,
  drunkyCaseStudy,
  focusfarmCaseStudy,
  helportCaseStudy,
  pelicanCaseStudy,
  poopidexCaseStudy,
} from "@/data/caseStudies";
import { PORTFOLIO_SITE, portfolioPdfProjects } from "@/data/portfolioPdf";
import AlioCaseStudyPage from "@/components/case-study/AlioCaseStudyPage";
import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import DrunkyCaseStudyPage from "@/components/case-study/DrunkyCaseStudyPage";
import HelportCaseStudyPage from "@/components/case-study/HelportCaseStudyPage";
import PelicanCaseStudyPage from "@/components/case-study/PelicanCaseStudyPage";
import SimpleCaseStudyPage from "@/components/case-study/SimpleCaseStudyPage";
import { PdfModeProvider } from "@/components/case-study/PdfMode";

// The PDF portfolio: the chosen case studies back to back, laid out for A4
// (see the [data-pdf-root] rules in globals.css), meant to be printed to PDF
// rather than browsed. Not linked from the site.
export const metadata: Metadata = {
  title: "Joyce Zhou — Portfolio",
  robots: { index: false, follow: false },
};

function CaseStudyFor({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  // The PDF has no next-project footer, so this is never shown
  const next = project;
  if (caseStudies[slug]) return <CaseStudyPage caseStudy={caseStudies[slug]} nextProject={next} />;
  switch (slug) {
    case "alio":
      return <AlioCaseStudyPage caseStudy={alioCaseStudy} nextProject={next} />;
    case "helport":
      return <HelportCaseStudyPage caseStudy={helportCaseStudy} nextProject={next} />;
    case "drunky":
      return <DrunkyCaseStudyPage caseStudy={drunkyCaseStudy} nextProject={next} />;
    case "pelican":
      return <PelicanCaseStudyPage caseStudy={pelicanCaseStudy} nextProject={next} />;
    case "poopidex":
      return <SimpleCaseStudyPage caseStudy={poopidexCaseStudy} nextProject={next} />;
    case "focusfarm":
      return <SimpleCaseStudyPage caseStudy={focusfarmCaseStudy} nextProject={next} />;
    default:
      return null;
  }
}

// ?project=<slug> limits it to one case study, for exporting each as its
// own PDF
export default async function PortfolioPdfPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project } = await searchParams;
  const projects = project ? portfolioPdfProjects.filter((p) => p.slug === project) : portfolioPdfProjects;
  return (
    <div data-pdf-root>
      {projects.map(({ slug, pages, heroImage }) => (
        // The page plan travels with the project for the export's layout
        <section
          key={slug}
          className="pdf-project"
          data-pdf-pages={pages ? JSON.stringify(pages) : undefined}
          data-pdf-url={`${PORTFOLIO_SITE}/work/${slug}`}
        >
          <PdfModeProvider heroImage={heroImage} siteUrl={`${PORTFOLIO_SITE}/work/${slug}`}>
            <CaseStudyFor slug={slug} />
          </PdfModeProvider>
        </section>
      ))}
    </div>
  );
}
