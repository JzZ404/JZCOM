// Exports the PDF portfolio (/portfolio-pdf) to a landscape A4 PDF.
//
//   npx next build && npx next start -p 3100
//   node scripts/export-portfolio-pdf.mjs portfolio.pdf http://localhost:3100/portfolio-pdf
//
// Needs Playwright with its Chromium; set PLAYWRIGHT to where it's
// installed (defaults to the copy that ships with gstack).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? `${process.env.HOME}/.claude/skills/gstack/node_modules/playwright`);

const out = process.argv[2] ?? "portfolio.pdf";
const url = process.argv[3] ?? "http://localhost:3000/portfolio-pdf";
// Landscape A4 is 1122.5 x 793.7 CSS px; printing at this scale lays the
// page out at 1280px, the site's full desktop layout
const WIDTH = 1280;
const SCALE = 1122.5 / WIDTH;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });

// A viewport as tall as the page puts everything "in view" at once, so
// every scroll-triggered reveal and count-up runs
const height = await page.evaluate(() => document.documentElement.scrollHeight);
await page.setViewportSize({ width: WIDTH, height });
await page.waitForTimeout(500);
const height2 = await page.evaluate(() => document.documentElement.scrollHeight);
if (height2 !== height) await page.setViewportSize({ width: WIDTH, height: height2 });

// Videos print their current frame: load each, show a frame a moment in,
// and hold it
await page.evaluate(async () => {
  await Promise.all(
    [...document.querySelectorAll("video")].map(
      (v) =>
        new Promise((resolve) => {
          v.pause();
          v.preload = "auto";
          const done = () => resolve();
          setTimeout(done, 8000);
          v.addEventListener("seeked", done, { once: true });
          const seek = () => { v.currentTime = Math.min(1, (v.duration || 2) / 2); };
          if (v.readyState >= 1) seek();
          else { v.addEventListener("loadedmetadata", seek, { once: true }); v.load(); }
        }),
    ),
  );
});
// Let the reveals, draws, and count-ups finish
await page.waitForTimeout(6000);

// Lay the pages out ourselves, filling each with no blank stretches
const PAGE_HEIGHT = Math.floor(793.7 / SCALE) - 1;
const paginate = readFileSync(new URL("./paginate-portfolio-pdf.js", import.meta.url), "utf8");
const zooms = await page.evaluate(`(${paginate})({ pageHeight: ${PAGE_HEIGHT}, pad: 30 })`);
zooms.forEach((p, i) => console.log(`page ${i + 1} (${p.used}/${PAGE_HEIGHT - 60}):`, p.items.join(" | ")));
// Moving the blocks changes the page's height; keep it all in view so no
// reveal fades back out, and let them settle
const height3 = await page.evaluate(() => document.documentElement.scrollHeight);
await page.setViewportSize({ width: WIDTH, height: height3 });
await page.waitForTimeout(2500);

await page.pdf({
  path: out,
  format: "A4",
  landscape: true,
  scale: SCALE,
  printBackground: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
});
await browser.close();
console.log("wrote", out);

// Keep colors true in Acrobat (see fix-pdf-colors.py); needs PyMuPDF
try {
  execFileSync("python3", [new URL("./fix-pdf-colors.py", import.meta.url).pathname, out], { stdio: "inherit" });
} catch {
  console.warn("Skipped the Acrobat color fix (run: pip install pymupdf)");
}
