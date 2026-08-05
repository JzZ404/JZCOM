import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import {
  caseStudies,
  caseStudySkeletons,
  alioCaseStudy,
  poopidexCaseStudy,
  focusfarmCaseStudy,
  drunkyCaseStudy,
  pelicanCaseStudy,
} from "@/data/caseStudies";
import CaseStudyPage from "@/components/case-study/CaseStudyPage";
import CaseStudySkeletonPage from "@/components/case-study/CaseStudySkeletonPage";
import AlioCaseStudyPage from "@/components/case-study/AlioCaseStudyPage";
import DrunkyCaseStudyPage from "@/components/case-study/DrunkyCaseStudyPage";
import SimpleCaseStudyPage from "@/components/case-study/SimpleCaseStudyPage";
import ProjectFallbackDetail from "@/components/ProjectFallbackDetail";

const simpleCaseStudies: Record<string, typeof poopidexCaseStudy> = {
  poopidex: poopidexCaseStudy,
  focusfarm: focusfarmCaseStudy,
  pelican: pelicanCaseStudy,
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return { title: project ? `${project.title} — Joyce Zhou` : "Work — Joyce Zhou" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const caseStudy = caseStudies[slug];
  if (caseStudy) {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];
    return <CaseStudyPage caseStudy={caseStudy} nextProject={nextProject} />;
  }

  if (slug === "alio") {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];
    return <AlioCaseStudyPage caseStudy={alioCaseStudy} nextProject={nextProject} />;
  }

  if (slug === "drunky") {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];
    return <DrunkyCaseStudyPage caseStudy={drunkyCaseStudy} nextProject={nextProject} />;
  }

  const simpleCaseStudy = simpleCaseStudies[slug];
  if (simpleCaseStudy) {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];
    return <SimpleCaseStudyPage caseStudy={simpleCaseStudy} nextProject={nextProject} />;
  }

  const skeleton = caseStudySkeletons[slug];
  if (skeleton) {
    const projectIndex = projects.findIndex((p) => p.slug === slug);
    const nextProject = projects[(projectIndex + 1) % projects.length];
    return <CaseStudySkeletonPage caseStudy={skeleton} nextProject={nextProject} />;
  }

  return <ProjectFallbackDetail project={project} />;
}
