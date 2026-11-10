"use client";

import { createContext, useContext } from "react";

// Set inside the PDF portfolio (/portfolio-pdf): case studies render as
// print pages, without the sidebar, the back link, or the next-project
// footer. `heroImage` replaces the hero with a still made for print;
// `siteUrl` is the case study on the live site.
type PdfMode = { heroImage?: string; siteUrl?: string };
const PdfModeContext = createContext<PdfMode | null>(null);

export function PdfModeProvider({ heroImage, siteUrl, children }: PdfMode & { children: React.ReactNode }) {
  return <PdfModeContext.Provider value={{ heroImage, siteUrl }}>{children}</PdfModeContext.Provider>;
}

export const usePdfMode = () => useContext(PdfModeContext) !== null;
export const usePdfHeroImage = () => useContext(PdfModeContext)?.heroImage;
export const usePdfSiteUrl = () => useContext(PdfModeContext)?.siteUrl;
