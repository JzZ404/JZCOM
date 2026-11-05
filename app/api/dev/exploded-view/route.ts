import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ExplodedPart } from "@/data/caseStudies";

// Dev-only: the exploded-view layout editor's Save button. Rewrites the
// canvas size and `items` list of PELICAN's exploded view in
// data/caseStudies.ts. Off (404) anywhere but `next dev`, so the live site
// can never write files.

const DATA_FILE = path.join(process.cwd(), "data", "caseStudies.ts");
// The canvas line and the list sit between these two lines, and only the
// exploded view's items are indented this way
const START = '      title: "Exploded View",\n';
const END = "      ],\n";

const SRC = /^\/images\/pelican\/parts\/[a-z0-9-]+\.webp$/;
// Text goes into a double-quoted string in the data file
const TEXT = /^[^"\\\n]{1,80}$/;

function isPart(p: unknown): p is ExplodedPart {
  if (!p || typeof p !== "object") return false;
  const { src, name, detail, x, y, w, flip, rotate } = p as Record<string, unknown>;
  const finite = (n: unknown) => typeof n === "number" && Number.isFinite(n);
  return (
    typeof src === "string" &&
    SRC.test(src) &&
    typeof name === "string" &&
    TEXT.test(name) &&
    (detail === undefined || (typeof detail === "string" && TEXT.test(detail))) &&
    finite(x) &&
    finite(y) &&
    finite(w) &&
    (w as number) > 0 &&
    (flip === undefined || typeof flip === "boolean") &&
    (rotate === undefined || finite(rotate))
  );
}

// One line per part, in the data file's style; optional fields only when set
function toLine(p: ExplodedPart) {
  const round = (n: number) => Math.round(n * 10) / 10;
  let line = `        { src: "${p.src}", name: "${p.name}"`;
  if (p.detail) line += `, detail: "${p.detail}"`;
  line += `, x: ${round(p.x)}, y: ${round(p.y)}, w: ${round(p.w)}`;
  if (p.flip) line += ", flip: true";
  if (p.rotate) line += `, rotate: ${round(p.rotate)}`;
  return `${line} },\n`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }
  const body = await request.json().catch(() => null);
  const items: unknown = body?.items;
  const canvas: unknown = body?.canvas;
  const size = (n: unknown) => Number.isInteger(n) && (n as number) > 0 && (n as number) < 5000;
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100 ||
    !items.every(isPart) ||
    !size((canvas as { w?: unknown })?.w) ||
    !size((canvas as { h?: unknown })?.h)
  ) {
    return Response.json({ error: "Invalid layout" }, { status: 400 });
  }
  const { w, h } = canvas as { w: number; h: number };

  const source = await readFile(DATA_FILE, "utf8");
  const start = source.indexOf(START);
  const end = start === -1 ? -1 : source.indexOf(END, start + START.length);
  if (start === -1 || end === -1) {
    return Response.json({ error: "Couldn't find the exploded view in data/caseStudies.ts" }, { status: 500 });
  }
  const from = start + START.length;
  const block = `      canvas: { w: ${w}, h: ${h} },\n      items: [\n${items.map(toLine).join("")}`;
  await writeFile(DATA_FILE, source.slice(0, from) + block + source.slice(end));
  return Response.json({ saved: items.length });
}
