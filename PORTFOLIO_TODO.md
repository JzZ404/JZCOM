# Portfolio Site — Ship Checklist

Companion to [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md). Ordered phases, each with what blocks it and — where useful — which Claude Code skill to reach for. Check items off as they land; don't reorder past a blocked item without Joyce's sign-off.

**Status as of 2026-07-15:** scaffold + Home/Work/Archive/About/Contact placeholder routes are built and pushed to `main`. IA changed from the original handoff — see note under Phase 2.

---

## Phase 0 — Repo hygiene (before anything else)

- [x] **Fix git repo scope.** Rescoped to a fresh repo at `/Users/jz/Documents/JZCOM`, remote set to `https://github.com/JzZ404/JZCOM.git`, pushed. The stray home-level `.git` at `/Users/jz` is untouched/unrelated — leave it alone.
- [x] Add `.gitignore` (Next.js default, from `create-next-app`).
- [x] GitHub remote added and pushed.

## Phase 1 — Blocking decisions (need Joyce, not code)

Per the handoff's Pre-Build Prep section — resolve or explicitly placeholder-and-flag before the matching build step:

- [ ] **Design tokens** — color palette (hex), type scale (family + sizes for h1/h2/body/caption), spacing scale. Blocks all styling.
- [ ] **Image assets** — what exists per project (screenshots/renders/photos), confirm they land in `/public/images/...`. None supplied yet.
- [ ] **Routing decision** — `/work/[slug]` separate pages vs. expandable sections. Blocks IA and nav.
- [ ] **Responsive/a11y baseline** — confirm mobile-first + WCAG AA target before styling.
- [ ] **Featured row** — pick 3–5 projects for the home page before building that section.
- [ ] **Final project go/no-go** — the 26-project list in the handoff includes "sketchy"/weaker candidates; Joyce makes the final cut.
- [ ] **Attribution double-check** — confirm role framing for every project beyond the three flagged (Poopidex, FocusFarm, Alio) in the handoff.

*Useful tool: `/design-consultation` to turn resolved tokens into a `DESIGN.md` design system doc, or `/design-shotgun` if Joyce wants to see visual options before committing to a palette rather than specifying hex values cold.*

## Phase 2 — Scaffold

- [x] `create-next-app` with TypeScript + Tailwind v4 + App Router in `JZCOM/`.
- [x] Install Framer Motion.
- [x] Folder structure: `/app`, `/components`, `/data`, `/public/images`.
- [x] Layout shell + nav. **IA changed from the original handoff** — nav is now Work / Archive / About / Contact (no explicit "Home" link; the logo/name links home). Archive is a new section: an image-only masonry/waterfall wall of older or miscellaneous work, distinct from Work's curated case studies — no per-item pages, just a visual gallery Joyce fills in later. Confirmed with Joyce 2026-07-15.
- [x] Design tokens wired into `app/globals.css`'s `@theme` block (Tailwind v4 is CSS-native, not a `tailwind.config.js` file) — placeholders, all marked `PLACEHOLDER — confirm with Joyce`.
- [ ] Deploy to a Vercel preview URL. **Blocked on Joyce** — needs her Vercel account. Recommended path: import the `JzZ404/JZCOM` GitHub repo from the Vercel dashboard (auto-deploys on push to `main`), rather than the CLI.
- [x] Scaffold + data + route commits pushed to `main`.

*Tool: `/setup-deploy` once Joyce has connected the Vercel project, to wire deploy config into `CLAUDE.md` for future automated checks.*

## Phase 3 — Content data file (build before components that render it)

- [x] `data/projects.ts` — schema in place (slug, title, tags, summary, role, featured, coverImage, links) with **5 placeholder entries only**, at Joyce's request — she'll add the rest of the real 26-project list herself later.
- [x] `data/archive.ts` — separate schema for the Archive wall (id, image, aspectRatio), 9 placeholder entries with varied ratios to drive the masonry layout until real images land.
- [x] Tag set typed as a union (`Robotics | AI/ML | UX/Product | Interactive/Creative | PM`).
- [ ] Joyce fills in real project data + attribution-correct copy (see `CLAUDE.md`) — remaining 21 projects, real summaries/roles, real images under `/public/images/...`.

## Phase 4 — Build section by section

Build and deploy-check after each section, don't batch:

- [x] **Hero** (`HeroSection.tsx`) — built, verified locally (desktop + mobile screenshots).
- [x] **Featured work** (`FeaturedProjects.tsx`) — 2x2 interactive grid (Framer Motion hover), capped to first 4 featured projects.
- [x] **Work grid** (`app/work/page.tsx`, `ProjectCard.tsx`) — flat grid of all projects, no tag filtering yet.
- [x] **Project detail/gallery template** (`/work/[slug]`) — driven by `data/projects.ts`, placeholder image blocks (3 per project) standing in for a real gallery.
- [x] **Archive** (`app/archive/page.tsx`) — CSS-columns masonry waterfall, driven by `data/archive.ts`.
- [x] **About** — structural placeholder only, no real copy (per handoff: don't invent it).
- [x] **Contact** — structural placeholder only (placeholder email), no real copy.
- [ ] Tag filtering on the Work grid (deferred — not yet built).
- [ ] Verify all of the above on a **deployed** preview URL, not just local dev, once Vercel is connected.

*Tool: `/browse` or `/qa` to click through the deployed preview once it exists.*

## Phase 5 — Attribution QA pass

- [ ] Read every case study's copy against the Attribution Notes in the handoff. Specifically verify: Poopidex reads as Joyce's build, FocusFarm uses PM verbs only (no "built"), Alio doesn't claim ML fine-tuning credit.
- [ ] For any project not explicitly covered in the handoff, confirm role framing with Joyce rather than guessing.

## Phase 6 — Polish pass (last, per handoff's explicit ordering)

- [ ] Motion pass — Framer Motion transitions, respect `prefers-reduced-motion`.
- [ ] Responsive edge cases (small phones, ultra-wide).
- [ ] Image optimization (`next/image`, proper sizes, lazy loading below the fold).
- [ ] Accessibility pass to the Phase 1 baseline (contrast, focus states, alt text, semantic headings, keyboard nav).

*Tool: `/design-review` for a visual-QA pass on the live preview; `/benchmark` for Core Web Vitals/Lighthouse before calling it done.*

## Phase 7 — Pre-launch checklist

- [ ] Meta tags / Open Graph image / favicon / page titles per route.
- [ ] 404 page.
- [ ] Broken-link sweep across all project detail pages.
- [ ] Cross-browser spot check (Safari, Chrome, mobile Safari).
- [ ] Analytics — confirm with Joyce whether wanted before launch or deferred.

*Tool: `/qa` for a full test-fix-verify pass before calling the preview ship-ready.*

## Phase 8 — Ship

- [ ] Final review of the Vercel preview URL with Joyce.
- [ ] `/land-and-deploy` (or manual merge) once approved.
- [ ] **Domain/DNS migration is explicitly out of scope for this pass** — the-jz.com stays on Squarespace until Joyce decides to cut over. Do not touch DNS.

---

## Open questions log

Anything Joyce answers that changes a Phase 1 item should get logged here with a date, so later sessions don't re-litigate it.

- **2026-07-15 — Git repo scope:** rescope to `JZCOM/`, remote is `https://github.com/JzZ404/JZCOM.git`.
- **2026-07-15 — Routing:** confirmed separate routes (`/work/[slug]`), not expandable sections.
- **2026-07-15 — Scaffold timing:** start immediately with placeholders rather than waiting on real design tokens/images.
- **2026-07-15 — Nav / IA:** final nav is Work, Archive, About, Contact. Archive is a new section (not in the original handoff) — a masonry/waterfall wall of older/miscellaneous work, no case study pages, images inserted later. Work stays the curated, tag-filterable case study grid with detail pages.
- **2026-07-15 — `data/projects.ts` scope:** only 5 placeholder entries for now, not the full 26-project list — Joyce will add real projects herself.
