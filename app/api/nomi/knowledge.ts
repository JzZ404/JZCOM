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
import { about } from "@/data/about";
import { archiveProjects } from "@/data/archive";
import { nomiKnowledge } from "@/data/nomiKnowledge";

// Turns the site's data files into plain reading material for Nomi. Content
// only: image paths, layout/positioning settings, and anything still marked
// PLACEHOLDER (unconfirmed with Joyce) are dropped, so Nomi can't repeat them.

const LAYOUT_KEYS = /^(id|image|images|video|videos|src|logo|photo|icon|layout|column|zoom|compact|interactive|aspectRatio|heroLabel|.*(Image|Images|Video|Position|Scale|Layout))$/;
const FILE_PATH = /^\/[\w/.() -]+\.(png|jpe?g|webp|gif|svg|mp4|mov|pdf|pptx)$/i;
const isPlaceholder = (s: string) => s.includes("PLACEHOLDER");

function toText(value: unknown, indent = ""): string {
  if (value == null || value === "" || typeof value === "boolean") return "";
  if (typeof value === "string") return isPlaceholder(value) || FILE_PATH.test(value) ? "" : value;
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    // Lists of plain values (tags, chips) read best inline.
    if (value.every((item) => typeof item === "string" || typeof item === "number")) {
      return value.map((item) => toText(item)).filter(Boolean).join(", ");
    }
    return value
      .map((item) => toText(item, indent + "  "))
      .filter(Boolean)
      .map((t) => `${indent}- ${t.trimStart()}`)
      .join("\n");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !LAYOUT_KEYS.test(key))
      .map(([key, v]) => {
        const t = toText(v, indent + "  ");
        if (!t) return "";
        return t.includes("\n") ? `${indent}${key}:\n${t}` : `${indent}${key}: ${t.trim()}`;
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

const section = (title: string, body: string) => (body.trim() ? `## ${title}\n${body.trim()}` : "");

function factSheet(): string {
  const { qa, offLimits, ...free } = nomiKnowledge;
  const parts = Object.entries(free)
    .filter(([, v]) => v.trim())
    .map(([key, v]) => `${key}: ${v.trim()}`);
  const answers = qa.filter((x) => x.q.trim() && x.a.trim()).map((x) => `Q: ${x.q.trim()}\nA: ${x.a.trim()}`);
  return [...parts, ...answers].join("\n\n");
}

export const offLimits = nomiKnowledge.offLimits.filter((s) => s.trim());

// An explicit index with counts, up front — so "what robotics projects..."
// gets the right number instead of being pieced together from scattered
// mentions (the case studies' "3 — Robotics Students" team lines got read as
// a project count).
const CATEGORY_NAMES: Record<string, string> = { ux: "UX / product design", ai: "AI", robotics: "Robotics" };
function projectIndex(): string {
  const lines = [`Joyce's portfolio has exactly ${projects.length} featured projects:`];
  for (const [category, name] of Object.entries(CATEGORY_NAMES)) {
    const inCategory = projects.filter((p) => p.category === category);
    if (inCategory.length) lines.push(`- ${name} (${inCategory.length}): ${inCategory.map((p) => `${p.title} (/work/${p.slug})`).join(", ")}`);
  }
  // Her exact part on each, in one place — broad questions ("can she code?")
  // otherwise blur her role into the whole team's work.
  lines.push("", "Joyce's exact part on each project (use this wording; never upgrade it):");
  for (const p of projects) lines.push(`- ${p.title.split(":")[0]}: ${p.role}`);
  return lines.join("\n");
}

// Built once per server instance — the data is static, and an identical
// string each time is what lets the API cache it (much cheaper follow-ups).
export const knowledge = [
  section("Project index", projectIndex()),
  section("About Joyce", toText(about)),
  section("Joyce's own notes (from her directly)", factSheet()),
  section("Projects (overview; full write-ups at /work/<slug>)", toText(projects)),
  section("Case study: Alio (slug: alio)", toText(alioCaseStudy)),
  section("Case study: Helport (slug: helport)", toText(helportCaseStudy)),
  section("Case study: Nest (slug: nest)", toText(caseStudies.nest)),
  section("Case study: Poopidex (slug: poopidex)", toText(poopidexCaseStudy)),
  section("Case study: FocusFarm (slug: focusfarm)", toText(focusfarmCaseStudy)),
  section("Case study: Drunky (slug: drunky)", toText(drunkyCaseStudy)),
  section("Case study: Pelican (slug: pelican)", toText(pelicanCaseStudy)),
  section("Archive (older work)", toText(archiveProjects)),
]
  .filter(Boolean)
  .join("\n\n");
