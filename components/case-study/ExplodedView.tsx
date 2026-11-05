"use client";

import type { ExplodedCanvasSize, ExplodedPart } from "@/data/caseStudies";
import ExplodedPartsViewer from "./ExplodedPartsViewer";
import ExplodedViewEditor from "./ExplodedViewEditor";

// PELICAN's exploded view. In dev it comes with the layout editor; the
// live site only ever gets the drawing.
export default function ExplodedView({ canvas, items }: { canvas: ExplodedCanvasSize; items: ExplodedPart[] }) {
  if (process.env.NODE_ENV === "development") return <ExplodedViewEditor initialCanvas={canvas} initial={items} />;
  return <ExplodedPartsViewer canvas={canvas} items={items} />;
}
