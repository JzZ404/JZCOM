// PLACEHOLDER DATA — Joyce will replace these 5 entries with real project
// content (and add the rest of the list) later. Schema is the real contract;
// values below are not.

export type ProjectTag =
  | "Robotics"
  | "AI/ML"
  | "UX/Product"
  | "Interactive/Creative"
  | "PM";

export type Project = {
  slug: string;
  title: string;
  tags: ProjectTag[]; // 1-3 tags
  summary: string;
  role: string; // what Joyce actually did — see CLAUDE.md attribution rules
  featured: boolean;
  coverImage: string; // path under /public/images/...
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "placeholder-project-1",
    title: "Placeholder Project 1",
    tags: ["UX/Product"],
    summary: "PLACEHOLDER — confirm with Joyce.",
    role: "PLACEHOLDER — confirm with Joyce.",
    featured: true,
    coverImage: "/images/placeholder-1.jpg",
  },
  {
    slug: "placeholder-project-2",
    title: "Placeholder Project 2",
    tags: ["Robotics"],
    summary: "PLACEHOLDER — confirm with Joyce.",
    role: "PLACEHOLDER — confirm with Joyce.",
    featured: true,
    coverImage: "/images/placeholder-2.jpg",
  },
  {
    slug: "placeholder-project-3",
    title: "Placeholder Project 3",
    tags: ["AI/ML"],
    summary: "PLACEHOLDER — confirm with Joyce.",
    role: "PLACEHOLDER — confirm with Joyce.",
    featured: true,
    coverImage: "/images/placeholder-3.jpg",
  },
  {
    slug: "placeholder-project-4",
    title: "Placeholder Project 4",
    tags: ["Interactive/Creative"],
    summary: "PLACEHOLDER — confirm with Joyce.",
    role: "PLACEHOLDER — confirm with Joyce.",
    featured: false,
    coverImage: "/images/placeholder-4.jpg",
  },
  {
    slug: "placeholder-project-5",
    title: "Placeholder Project 5",
    tags: ["PM"],
    summary: "PLACEHOLDER — confirm with Joyce.",
    role: "PLACEHOLDER — confirm with Joyce.",
    featured: false,
    coverImage: "/images/placeholder-5.jpg",
  },
];
