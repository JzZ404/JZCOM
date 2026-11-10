// The case studies in the PDF portfolio (/portfolio-pdf), in order. Each
// starts on its own page.
//
// `pages` (optional) fixes what goes on each landscape page, as section ids
// (the ids in each case study's sidebar). "overview" is the title block and
// hero. "<id>#<n>" is the n-th row of a section, e.g. one demo feature per
// page, and "<id>#<n>.<m>" the m-th row inside that; the section heading
// comes with its very first row. A page's content is scaled to
// fit if it runs long. Without `pages`, the export fills pages
// automatically. `heroImage` replaces the case study's hero on the cover
// page with a still made for print.
// Each PDF page links back to the case study here (/work/<slug>)
export const PORTFOLIO_SITE = "https://www.the-jz.com";

export type PortfolioPdfProject = { slug: string; heroImage?: string; pages?: string[][] };

export const portfolioPdfProjects: PortfolioPdfProject[] = [
  {
    slug: "alio",
    heroImage: "/images/alio/pdf-cover.jpg",
    pages: [
      ["overview"],
      ["why"],
      ["problem", "competitive"],
      ["architecture", "tech-stack"],
      ["demo#1"],
      ["demo#2"],
      ["demo#3"],
      ["demo#4"],
      ["screens"],
      ["design-system"],
      ["business-model", "roadmap"],
      ["responsible-ai"],
    ],
  },
  {
    slug: "helport",
    heroImage: "/images/helport/pdf-cover.jpg",
    pages: [
      ["overview"],
      ["research", "pain-points"],
      ["problem", "solution"],
      ["personas"],
      ["target-market", "demo"],
      // Design Process: the two iterations, then each final-prototype feature
      ["demo-iterations#1.1"],
      ["demo-iterations#1.2"],
      ["demo-iterations#2.1", "demo-iterations#2.2.1"],
      ["demo-iterations#2.2.2"],
      ["demo-iterations#2.2.3"],
      ["demo-iterations#2.2.4"],
      ["competitive"],
      ["pricing", "outcomes"],
      ["recognition"],
    ],
  },
  {
    slug: "pelican",
    heroImage: "/images/pelican/pdf-cover.jpg",
    pages: [
      ["overview"],
      ["why", "architecture"],
      ["process"],
      ["pipeline"],
      ["demo"],
      ["challenges", "whats-next"],
    ],
  },
  {
    slug: "focusfarm",
    heroImage: "/images/focusfarm/pdf-cover.jpg",
    pages: [
      ["overview"],
      ["why", "playground"],
      // The pipeline's stages, then its chart beside the live debug view
      ["technical-stack", "pipeline#1", "pipeline#2.1"],
      ["pipeline#2.2", "whats-next"],
    ],
  },
];
