# Portfolio Site — Ship Checklist

Companion to [PORTFOLIO_HANDOFF.md](PORTFOLIO_HANDOFF.md). Ordered phases, each with what blocks it and — where useful — which Claude Code skill to reach for. Check items off as they land; don't reorder past a blocked item without Joyce's sign-off.

**Status as of 2026-07-15:** nothing built yet. Repo contains only the handoff doc.

---

## Phase 0 — Repo hygiene (before anything else)

- [ ] **Fix git repo scope.** `.git` currently lives at `/Users/jz` (home directory) — `git status` from this project shows Desktop, Downloads, `.ssh`, `.claude.json` etc. as untracked. Do not push this repo anywhere until resolved. Recommended: `git init` a fresh repo scoped to `/Users/jz/Documents/JZCOM`, migrate `PORTFOLIO_HANDOFF.md`/`CLAUDE.md`/`PORTFOLIO_TODO.md` into it, and treat the home-level `.git` as legacy/unrelated.
- [ ] Add `.gitignore` (Next.js default: `node_modules`, `.next`, `.env*.local`, `.vercel`).
- [ ] Create GitHub remote (or confirm existing one) once repo scope is fixed.

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

- [ ] `create-next-app` with TypeScript + Tailwind + App Router in `JZCOM/`.
- [ ] Install Framer Motion.
- [ ] Folder structure: `/app`, `/components`, `/data`, `/public/images`.
- [ ] Layout shell + nav (Home / Work / About / Contact), empty route stubs.
- [ ] Design tokens wired into `tailwind.config` — real values if Phase 1 resolved, otherwise clearly-marked placeholders (see `CLAUDE.md`).
- [ ] Deploy immediately to a Vercel preview URL with placeholder content — don't wait for polish. No domain/DNS work yet.
- [ ] First commit: "scaffold: project structure + empty routes."

*Tool: `/ship` once there's a working diff to PR; `/setup-deploy` to wire the Vercel deploy config if not already automatic.*

## Phase 3 — Content data file (build before components that render it)

- [ ] `data/projects.ts` — every project from the handoff's list as a typed entry: title, tags (1–3 from the fixed set), summary, role, links, image paths. Use placeholder summaries where copy isn't final, but keep attribution framing correct from day one (see `CLAUDE.md` attribution rules).
- [ ] Type the tag set as a union (`Robotics | AI/ML | UX/Product | Interactive/Creative | PM`) so filter logic is exhaustive-checked.
- [ ] Commit: "data: project content file."

## Phase 4 — Build section by section

Build and deploy-check after each section, don't batch:

- [ ] **Hero** (`HeroSection.tsx`) — commit + verify on preview URL.
- [ ] **Project grid** (`ProjectGrid.tsx`, `ProjectCard.tsx`) with tag filtering — commit + verify.
- [ ] **Project detail template** (`/work/[slug]`, driven entirely by `data/projects.ts`) — commit + verify.
- [ ] **About** — commit + verify.
- [ ] **Contact** — commit + verify.

*Tool: `/browse` or `/qa` to actually click through the deployed preview after each section rather than eyeballing code.*

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

- (none yet)
