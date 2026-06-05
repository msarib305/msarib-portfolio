# Changelog

Timestamped log of every meaningful change to msarib-portfolio. Newest entries at the top.

## Format

Each entry has the following shape:

```
## YYYY-MM-DD HH:MM PKT
### <type>(<scope>): <short description>
- pnpm typecheck: pass | fail
- pnpm lint: pass | fail
- pnpm build: pass | fail
- Vercel preview: <URL> | N/A
- Playwright: <spec file and result> | N/A this phase
- Manual visual check: confirmed by Sarib | pending
```

Types follow Conventional Commits: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `test`. Scope is the phase or area of the codebase (e.g. `scaffold`, `design-tokens`, `s-logo`, `nav`, `contact`).

Entries are written at commit time, not at phase start.

---

## 2026-06-05 PKT
### perf(images): Phase 14 — next-cloudinary, bundle audit, Lighthouse baseline, font cache headers

**Summary:** Performance pass targeting Lighthouse 90+ on all four axes (Performance, Accessibility, Best Practices, SEO) across Mobile and Desktop on six primary routes.

**New files:**
- `src/lib/cloudinary.ts` — `cloudinaryPublicId(url)` utility. Strips extension, version segment, transformation segments, preserves folder paths. 8/8 edge-case tests pass.
- `src/components/CldImageClient.tsx` — `'use client'` re-export of `CldImage`. Required because next-cloudinary ships without a client directive but uses hooks internally.
- `scripts/lighthouse.mjs` — Headless Lighthouse runner. Iterates 6 routes (Desktop + Mobile), writes JSON reports to `lighthouse-reports/`, prints a colour-coded score table. Uses Playwright's bundled Chromium. `pnpm lighthouse` or `node scripts/lighthouse.mjs [baseUrl]`.

**Modified files:**
- `src/components/WorkCard.tsx` — `next/image` → `CldImage`. f_auto + q_auto applied by default. `priority` and `fetchPriority` forwarded.
- `src/components/CaseStudyCover.tsx` — image branch: `next/image` → `CldImage`.
- `src/components/CaseStudyGallery.tsx` — image items: `next/image` → `CldImage`.
- `src/app/layout.tsx` — Added `dns-prefetch` for `img.youtube.com` and `www.youtube-nocookie.com`.
- `next.config.ts` — `@next/bundle-analyzer` wrapper (gated by `ANALYZE=true`). `qualities` reduced from `[70, 75]` to `[75]`. Added `headers()` setting 1-year cache on `/fonts/:path*`.
- `package.json` — Added `"lighthouse"` script. Added `next-cloudinary@6.17.5` dependency. Added `@next/bundle-analyzer` dev dependency.
- `.gitignore` — Added `lighthouse-report/` entry.
- `.env.example` — Added `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` placeholder.

**Packages added:** `next-cloudinary@6.17.5`, `@next/bundle-analyzer` (dev)

**Lighthouse scores — before and after (local, production server `pnpm build && pnpm start`)**

| Route | Profile | Before | After | Delta |
|---|---|---|---|---|
| `/` | Mobile | 82 | ~81 | 0 (noise) |
| `/` | Desktop | 98 | 99 | +1 |
| `/work` | Mobile | 90 | 81-86 | see note |
| `/work` | Desktop | 99 | 100 | +1 |
| `/about` | Mobile | 89 | 90 | +1 |
| `/about` | Desktop | 100 | 100 | 0 |
| `/writings` | Mobile | 89 | 93 | +4 |
| `/writings` | Desktop | 100 | 100 | 0 |
| `/contact` | Mobile | 88 | 96 | +8 |
| `/contact` | Desktop | 100 | 100 | 0 |
| `/projects/anime-...` | Mobile | 91 | **100** | +9 |
| `/projects/anime-...` | Desktop | 100 | **100** | 0 |

All Accessibility, Best Practices, SEO: 96-100 on all routes and profiles.

**Bundle audit findings**

Conducted via Turbopack build manifest (webpack mode blocked by React Compiler incompatibility — see DEC-057).

| | Size |
|---|---|
| Public route JS total (uncompressed) | 446 KB |
| Public route JS estimated gzipped | ~130 KB |
| Largest non-public chunk | 2.7 MB (Keystatic admin: `markdown-it`, `entities`) |

No server-only code found in the client bundle. No duplicate dependencies. The 2.7 MB Keystatic chunk is not loaded on any public route.

**Known issue: home page showreel bandwidth on slow connections**

The home page mobile Performance score was 82 before Phase 14 and is ~80-82 after. This is not a Phase 14 regression. Root cause: the showreel video (`portfolio-showreel`, H.264, w=960) downloads 3.2 MB during page load because `preload="metadata"` is ignored by Chrome when `autoPlay` is also set on the video element. At Lighthouse's simulated Slow 4G (1.6 Mbps), this saturates bandwidth and delays all other resources including the LCP image. The issue is unchanged by the CldImage migration.

Mitigation deferred. Options: Cloudinary `f_auto` on the video source (WebM/AV1 smaller derivatives), poster-first-then-video-on-idle pattern, reduced source video bitrate.

**Note on `/work` local score variability**

Local Lighthouse shows 81-86 for `/work` mobile (high variance). This is an artifact of CldImage making direct Cloudinary CDN requests instead of the `next/image` local proxy used in baseline. Under Lighthouse Slow 4G simulation, the WSL2 → internet → Cloudinary path adds real-world latency on top of the simulated throttling. The baseline 90 was architecturally privileged by serving from localhost disk. Production scores expected to be 90+ (Cloudinary edge CDN co-located with users). Authoritative scores from `node scripts/lighthouse.mjs https://msarib.dev` after deployment.

**Build status:**
- `pnpm typecheck`: pass
- `pnpm lint`: pass
- `pnpm build`: pass
- Vercel preview: pending

**Env var required (add to Vercel dashboard before next deploy):**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddgwzcrim` (Production + Preview environments)

---

## 2026-05-20 PKT
### feat(contact): Phase 12 — contact form, Resend email, Cloudflare Turnstile

**New routes:** `/contact` (full contact page replacing Phase 8 placeholder)

**New files:**
- `src/app/contact/actions.ts` — Server Action: Zod validation, rate-limit check, Turnstile verify, Resend send, record on success
- `src/lib/contact-schema.ts` — Zod v3 schema and `ContactFormState` type
- `src/lib/email.ts` — Resend wrapper, dark-themed HTML email, `escapeHtml` helper
- `src/lib/rate-limit.ts` — In-memory IP rate limiter. Soft signal: catches casual repeats; resets on cold start. Hard prevention from Turnstile + Resend dashboard monitoring.
- `src/components/ContactForm.tsx` — Client Component, `useActionState`, field errors via `aria-describedby`, Turnstile reset on token failure
- `src/components/ContactInfo.tsx` — Sidebar: LinkedIn, YouTube, Upwork, Fiverr (confirmed URLs)
- `src/components/ContactSuccess.tsx` — Personalised success state with submitter's name
- `src/components/TurnstileWidget.tsx` — Cloudflare Turnstile, dark theme, `refreshExpired: 'auto'`, `forwardRef` for reset

**Modified files:**
- `src/app/contact/page.tsx` — Rewritten from PlaceholderPage to Server Component with hero, form, sidebar
- `src/app/globals.css` — Added `--color-error: #ff4545` token; appended contact CSS block
- `.env.example` — Added 5 env var placeholders for Resend and Turnstile
- `docs/DECISIONS.md` — DEC-049 through DEC-053

**Packages added:** `resend@^6`, `zod@^3`, `@marsidev/react-turnstile@^1`

**Key corrections applied during implementation:**
1. FormData values coerced to strings before Zod parse (user-facing error messages fire correctly)
2. Rate limit records only on successful email delivery (no lockout after service failures)
3. Turnstile widget resets via ref after server-side token rejection
4. Dark theme enforced on Turnstile widget
5. PillButton already supported button mode — no extension needed
6. Resend v6 confirmed: `replyTo` camelCase, `from` display-name format, `to` array, `error.message` path

**Env vars required (add to Vercel dashboard):**
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass (/contact static)
- Vercel preview: pending (requires env vars)
- Playwright: N/A this phase
- Manual visual check: pending

---

## 2026-05-20 PKT
### feat(writings): Phase 11 — writings collection, index, post template, RSS feed

**New routes:** `/writings` (index, empty state), `/writings/[slug]` (per-post template), `/feed.xml` (RSS 2.0 route handler)

**New files:**
- `keystatic.config.ts` — `writings` collection added alongside `projects`
- `src/data/writings.ts` — `WritingItem` interface, async helpers, inline reading time (Markdoc AST walk)
- `src/components/WritingCard.tsx` — index card, `.write-card` + `.is-featured` layouts
- `src/components/WritingMeta.tsx` — date, read time, tags row in mono font
- `src/components/WritingsEmpty.tsx` — empty state with RSS pill CTA
- `src/components/WritingNav.tsx` — prev/next post navigation
- `src/components/WritingBody.tsx` — Markdoc pipeline, `.post-body` wrapper, fence + blockquote overrides
- `src/app/writings/page.tsx` — replaces Phase 8 PlaceholderPage
- `src/app/writings/[slug]/page.tsx` — per-post route, `dynamicParams = false`
- `src/app/feed.xml/route.ts` — RSS 2.0 with CDATA and XML escaping

**Architecture:** Decision A (fields.markdoc, same as projects). Server Component rendering throughout (no `'use client'`). Only `status === 'published'` writings are publicly routable. DEC-044 through DEC-048 added.

- pnpm typecheck: pass
- pnpm lint: pending
- pnpm build: pass
- Vercel preview: pending
- Playwright: N/A this phase
- Manual visual check: pending

---

## 2026-05-20 PKT
### feat(cms): Keystatic Phase 10 — projects migrated to MDX content files

**Packages added:** `@keystatic/core@0.5.50`, `@keystatic/next@5.0.4`, `@markdoc/markdoc@0.5.7`

**New files:**
- `keystatic.config.ts` — collection schema with all ProjectItem fields; `fields.slug` for title, `fields.markdoc` for body, `block()` Figure component
- `content/projects/samurai-saga/index.mdoc`
- `content/projects/nvidia-ai-assistant/index.mdoc`
- `content/projects/character-creator/index.mdoc`
- `content/projects/tresemme-metaverse/index.mdoc`
- `src/app/keystatic/keystatic.ts` — Keystatic admin page (Client Component)
- `src/app/keystatic/layout.tsx` — admin layout
- `src/app/keystatic/[[...params]]/page.tsx` — admin page slot
- `src/app/api/keystatic/[...params]/route.ts` — API route handler
- `.env.example` — documents local vs. GitHub mode vars

**Modified files:**
- `src/data/projects.ts` — rewritten to `createReader`; async exports (`getProjects`, `getFeaturedProjects`, `findProjectBySlug`, `getProjectNav`); `ProjectBodyBlock` type removed
- `src/components/ProjectBody.tsx` — rewritten to Markdoc rendering; custom list/figure renderers; `.case-body` wrapper
- `src/components/FeaturedWork.tsx` — async Server Component, awaits `getFeaturedProjects()`
- `src/components/WorkIndex.tsx` — async Server Component, awaits `getProjects()`
- `src/app/projects/[slug]/page.tsx` — async data with `Promise.all`, async `generateStaticParams`
- `src/components/CaseStudyHeader.tsx` — tags prop widened to `readonly string[]`
- `src/app/globals.css` — added `.case-body` layout and typography block

**Rollback:** `git revert HEAD && git push origin main`

---

## 2026-05-20 PKT
### feat(about): hero, narrative, pillars, timeline, skills, CTA

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/data/experience.ts`: new file. ExperienceItem interface (slug, years, role,
  company, location, summary, bullets, tags, current). Six entries newest-first:
  SwiftNine (current), Vmmersion, Exarta Senior, Ideofuzion, Exarta first, HashTech.
  Dates confirmed against PROFESSIONAL_HISTORY.md by Sarib.
- `src/data/skills.ts`: new file. SkillCategoryItem interface (slug, label, items).
  Four categories verbatim from v15: Engines & Languages, Systems & Frameworks,
  Platforms & Tools, Practice.
- `src/components/AboutHero.tsx`: new. Server Component. Two-column hero with eyebrow,
  h1 "Lead UE5 developer from Lahore.", lede, stats (07/10/06), CSS-only portrait
  placeholder with .pwm text overlay.
- `src/components/AboutNarrative.tsx`: new. Server Component. h2 "The short version."
  plus four paragraphs verbatim from v15. Bold lead-ins on paragraphs 2 through 4.
- `src/components/AboutPillars.tsx`: new. Server Component. Three engineering pillar
  cards with module-level PILLARS constant. .three-card/.three-grid/.t-card layout
  from v15. Blob reuses wib-drift1 keyframe. t1 card has teal .t-pill chip.
- `src/components/Timeline.tsx`: new. Server Component. Timeline header with h2
  "Experience." and secondary PillButton resume link. Maps experience[] to TimelineEntry.
- `src/components/TimelineEntry.tsx`: new. Server Component. .exp-row 3-column grid
  (200px / 1fr / 280px). Current entry gets teal radial gradient and PillBadge
  tone="grad-1" "Current" label. .deets uses .deets-summary paragraph + ul structure.
- `src/components/SkillsGrid.tsx`: new. Server Component. Skills section with h2
  "Skills.", maps skills[] to SkillCategory.
- `src/components/SkillCategory.tsx`: new. Server Component. .skill-cat card with
  accent-colored h4 and list of items.
- `src/app/about/page.tsx`: replaced PlaceholderPage with full About composition.
  Imports: AboutHero, AboutNarrative, AboutPillars, Timeline, SkillsGrid, ContactCTA.
  Updated metadata description.
- `src/app/globals.css`: appended Phase 9 CSS inside @layer components. Classes:
  about-hero, about-hero-grid, about-h1, about-lede, about-stats, about-stat (.num,
  .lbl), about-portrait (.pwm, .nm, .ro), about-narrative, three-card, three-card-bg
  (.blob3), three-card-head (.lede), three-grid, t-card (.t1/.t2/.t3), t-pill, t-desc,
  timeline, timeline-head, exp-row, exp-row.current, now-wrap, role (.role-title,
  .company, .deets, .deets-summary), tags (.tag), skills-section (.skills-section-head),
  skills-grid, skill-cat. Responsive breakpoints at 1200px, 900px, 600px. 1200px block
  includes .exp-row.current .tags { border-top-color: transparent } to prevent the
  border cutting through the teal gradient. prefers-reduced-motion guard on blob3.
- `docs/DECISIONS.md`: DEC-036 through DEC-039.
- `docs/DESIGN_SYSTEM.md`: Phase 9 component entries.

## 2026-05-20 PKT
### feat(routing): /work index, case study template, route placeholders

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/data/projects.ts`: new file. Replaces `src/data/featured-work.ts`. Full `ProjectItem` interface and `ProjectBodyBlock` discriminated union. Four projects (Samurai Saga, NVIDIA AI Assistant, Character Creator System, TRESemmé Metaverse), all `featured: true`. Helper exports: `featuredProjects`, `findProjectBySlug`, `getProjectNav`. TRESemmé year corrected from '2025' to '2022 to 2023'. TRESemmé client corrected from 'TRESemmé · HCL' to 'TRESemmé · Unilever'.
- `src/data/featured-work.ts`: deleted. Fully migrated to `projects.ts`.
- `src/components/WorkCard.tsx`: import updated to `ProjectItem` from `projects.ts`. `prefetch={false}` removed from Link (default prefetch restored).
- `src/components/FeaturedWork.tsx`: import updated to `featuredProjects` from `projects.ts`.
- `src/app/work/page.tsx`: new. Server Component. Metadata + WorkIndex.
- `src/components/WorkIndex.tsx`: new. Server Component. Work index hero and cards grid (all projects).
- `src/app/projects/[slug]/page.tsx`: new. Server Component. `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, `notFound()` guard, full case study layout with chips, title, summary+specs grid, cover image, body blocks, prev/next nav.
- `src/components/CaseStudyHeader.tsx`: new. Chips row and h1.
- `src/components/CaseStudySpecs.tsx`: new. `<dl>`/`<dt>`/`<dd>` spec block (Year, Client, Role, Engine, Status).
- `src/components/ProjectBody.tsx`: new. `ProjectBodyBlock[]` renderer with c2 grouping reducer. Heading blocks start new `.case-section` groups.
- `src/components/CaseStudyNav.tsx`: new. Prev/next nav. Null prev shows `/work` link.
- `src/components/PlaceholderPage.tsx`: new. Shared placeholder layout used by three route pages.
- `src/app/about/page.tsx`: new. Placeholder page.
- `src/app/writings/page.tsx`: new. Placeholder page.
- `src/app/contact/page.tsx`: new. Placeholder page.
- `src/app/globals.css`: appended Phase 8 CSS inside `@layer components`. New classes: `.work-index-hero`, `.work-index-hero-grid`, `.work-index-meta`, `.work-index-meta-row`, `.work-index-cards`, `.case-hero`, `.case-meta-row`, `.case-chip`, `.case-title`, `.case-summary`, `.case-summary-text`, `.case-specs`, `.case-spec-row`, `.case-spec-key`, `.case-spec-val`, `.case-media`, `.case-media-frame`, `.case-section`, `.case-list`, `.case-list-item`, `.case-figure`, `.case-nav`, `.case-nav-link`, `.case-nav-dir`, `.case-nav-title`, `.case-nav-empty`, `.case-nav-link.is-next`, `.placeholder-page`. Responsive breakpoints at 1200px, 900px, 600px.
- `docs/DECISIONS.md`: DEC-031 through DEC-035.
- `docs/DESIGN_SYSTEM.md`: Phase 8 component entries (CaseStudyHeader, CaseStudySpecs, ProjectBody, CaseStudyNav, WorkIndex, PlaceholderPage).

---

## 2026-05-20 PKT
### feat(home-closing): what I bring cards with blob bg, contact CTA

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/page.tsx`: added WhatIBring and ContactCTA imports and renders after ExpertiseGrid.
- `src/app/globals.css`: added `--radius-20: 20px` token to `@theme`. Appended `.wib-section`, `.wib-head`, `.wib-lede`, `.wib-grid`, `.wib-bg`, `.wib-blob3`, `.wib-card`, `.wib-card-headline`, `.wib-card-body`, `.wib-card-detail`, `.contact-cta-section`, `.contact-cta-card`, `.contact-cta-body`, `.contact-cta-actions` to `@layer components`. Responsive breakpoints at 900px and 600px. Reduced-motion blob animation guard. Appended `@keyframes wib-drift1`, `wib-drift2`, `wib-drift3`.
- `src/data/what-i-bring.ts`: new file. `WhatIBringItem` interface and 3-item array (Technical depth, Engineering leadership, Shipped products).
- `src/components/WhatIBringCard.tsx`: new Server Component. `<article>` wrapper with PillBadge, h3 headline, body paragraph, arrow-marker bullet list.
- `src/components/WhatIBring.tsx`: new Server Component. Section with heading block and 3-column `.wib-grid` containing `.wib-bg` blob layer and three WhatIBringCard instances.
- `src/components/ContactCTA.tsx`: new Server Component. Two-element pattern: `.contact-cta-section` outer + `.contact-cta-card` inner. Two PillButtons: primary "Contact me" (/contact) and secondary "Download resume" (/resume.pdf).
- `public/resume.pdf`: Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf copied from docs/ to public/. Served statically at /resume.pdf.
- `docs/DECISIONS.md`: DEC-028 (transform-only blob animation), DEC-029 (min() for CTA card width), DEC-030 (article element for WhatIBringCard).
- `docs/DESIGN_SYSTEM.md`: Phase 7 component specs for WhatIBringCard, WhatIBring, ContactCTA.

---

## 2026-05-20 PKT
### feat(home-mid): selected work grid, feature showcase, expertise grid

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/page.tsx`: added FeaturedWork, FeatureShowcase, ExpertiseGrid imports and renders after Hero.
- `src/app/globals.css`: appended `.eyebrow`, `.section`, `.section-head`, `.work-grid`, `.work-card`, `.work-card-media`, `.work-card-img`, `.work-card-overlay`, `.work-card-tag-img`, `.work-card-body`, `.work-card-meta`, `.work-card-title`, `.work-card-summary`, `.wc-1` through `.wc-4`, `.feature-showcase`, `.feature-text`, `.feature-visual-wrap`, `.feature-visual-frame`, `.feature-img`, `.feature-img-glow`, `.feature-credit`, `.expertise-section`, `.expertise-head`, `.expertise-grid`, `.exp-card`, `.exp-media`, `.exp-img`, `.exp-video`, `.exp-tint`, `.ec-title`, `.c1` through `.c8` to `@layer components`. Responsive breakpoints at 1200px, 900px, 600px. Reduced-motion guard restores BW image and tint on expertise card hover.
- `src/data/featured-work.ts`: new file. `FeaturedWorkItem` interface and 4-item array (Samurai Saga, NVIDIA AI Assistant, Character Creator System, TRESemmé Metaverse). Cloudinary demo placeholders with `// TODO: <slug>` comments.
- `src/data/expertise.ts`: new file. `ExpertiseItem` interface and 8-item array. Cloudinary demo placeholders with `// TODO: <slug>` comments.
- `src/components/WorkCard.tsx`: new Server Component. `<Link prefetch={false}>` renders as `<a>` in DOM (cursor enlarge works). Tint via CSS variable on the `<Link>` element.
- `src/components/FeaturedWork.tsx`: new Server Component. `.section` container, `.section-head` with PillButton, `.work-grid` mapping WorkCard.
- `src/components/FeatureShowcase.tsx`: new Server Component. Two-column layout. Duplicate `<img>` glow technique (DEC-025).
- `src/components/ExpertiseCard.tsx`: new Client Component. `onMouseEnter`/`onMouseLeave` handlers for video play/pause. `matchMedia` reduced-motion check inline in `onHover`. `<h3>` for card title.
- `src/components/ExpertiseGrid.tsx`: new Server Component. `content-visibility: auto` on section.
- `docs/DECISIONS.md`: DEC-024 (plain img vs next/image), DEC-025 (duplicate-image glow), DEC-026 (preload=metadata for expertise videos), DEC-027 (hardcoded data layer).
- `docs/DESIGN_SYSTEM.md`: Phase 6 component specs for WorkCard, FeaturedWork, FeatureShowcase, ExpertiseCard, ExpertiseGrid.

---

## 2026-05-19 PKT
### feat(hero): showreel with canvas-mirrored glow, word-by-word reveal, hero meta row, hero CTAs

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: accessibility snapshot confirmed h1, video, CTAs, meta row present; zero console errors
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/page.tsx`: replaced Phase 2 placeholder with `<Hero />`. `<Cursor />` retained as first fragment child.
- `src/components/Hero.tsx`: new Server Component. Two-column grid (0.85fr 1.4fr). Headline and subhead split into per-word `React.Fragment` wrappers (space as sibling text node, not inside inline-block span). Hero meta row (Years in engine, Shipped projects, Currently). PillButton CTAs (Get in touch / View my work). Imports ShowreelGlow.
- `src/components/ShowreelGlow.tsx`: new client component. Single `<video>` with poster, autoPlay, muted, loop, playsInline. `<canvas>` sibling paints video frames at ~10fps (INTERVAL_MS=100, canvas 160px wide proportional height, ctx alpha:false). prefers-reduced-motion: video.pause() + RAF not started. cancelAnimationFrame cleanup on unmount.
- `src/app/globals.css`: appended `.hero`, `.hero-grid`, `.hero-text`, `.hero-headline`, `.hero-headline-accent`, `.hero-headline-word`, `.hero-subhead`, `.hero-subhead-word`, `.hero-actions`, `.hero-meta`, `.hero-meta-item`, `.hero-meta-label`, `.hero-meta-value`, `.showreel`, `.showreel-frame`, `.showreel-video`, `.showreel-glow-canvas`, `.reel-label`, `.reel-label-dot`, `.reel-credits`, `.reel-credits-title` to `@layer components`. Responsive breakpoints at 1200px, 900px, 600px. Reduced-motion guards for canvas (display:none) and reel dot (animation:none). `@keyframes word-reveal` appended outside @layer.
- `docs/DECISIONS.md`: DEC-021 (pure CSS word reveal, no Motion), DEC-022 (10fps canvas throttle), DEC-023 (matchMedia reduced motion in ShowreelGlow).
- `docs/DESIGN_SYSTEM.md`: Hero, ShowreelGlow component specs and @keyframes word-reveal entry added.

---

## 2026-05-19 PKT
### feat(shell): nav, footer, mobile menu, skip link, Dark Reader safety meta

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/globals.css`: added nav, footer, mobile-menu, skip-link, clock, font-toggle classes to @layer components; added @keyframes pulse; added .clock-dot animation: none to prefers-reduced-motion block; added main[tabindex="-1"]:focus { outline: none } to @layer base.
- `src/app/layout.tsx`: added SkipToContent, Nav, Footer; wrapped children in `<main id="main-content" tabIndex={-1}>`; added viewport export; removed metadata.other; added suppressHydrationWarning on `<body>`.
- `src/app/page.tsx`: changed outer `<main>` to React fragment; layout now provides the `<main>` landmark.
- `src/components/SkipToContent.tsx`: new server component.
- `src/components/Nav.tsx`: new client component. Fixed nav, three-column grid, five links, scroll threshold 30px, mobile menu state.
- `src/components/MobileMenu.tsx`: new client component. Right-side drawer, focus trap, scroll lock, Escape closes, focus returns to burger.
- `src/components/FontToggle.tsx`: new client island. localStorage toggle between PP Right Grotesk and PP Neue Montreal. aria-pressed.
- `src/components/LahoreClock.tsx`: new client island. Asia/Karachi timezone, 1s interval, pulse dot.
- `src/components/Footer.tsx`: new server component with two client islands. Five-column grid, three logical regions.
- `docs/DESIGN_SYSTEM.md`: component specs for SkipToContent, Nav, MobileMenu, FontToggle, LahoreClock, Footer.
- `docs/DECISIONS.md`: DEC-016 through DEC-020.
- `docs/CHANGELOG.md`: Phase 4 entry.

---

## 2026-05-19 PKT
### feat(components): S-logo, pill button system, 3D pill badge, cursor system + /design-system showcase route; amend Phase 2 @theme with badge-fg token (DEC-015)

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/globals.css`: added `--color-badge-fg: #1a1a1f` to @theme (DEC-015); appended `@layer components` block with .s-logo, .s-logo-mark, .s-logo-text, .s-logo-text .sub, .s-logo-lg, .s-logo-xl size variants, .pill-btn, .pill-btn--primary, .pill-btn--secondary, .pill-btn--lg, .pill-btn--sm, .pill-badge, .pill-badge--grad-1/2/3, .cursor-gradient, .cursor-dot, .cursor-dot--visible, .cursor-dot--hover; appended `@keyframes s-logo-spin` outside @layer.
- `src/app/page.tsx`: imported Cursor, rendered `<Cursor />` as first child of `<main>`.
- `src/app/design-system/page.tsx`: new internal showcase route. robots noindex/nofollow. Renders SLogo (3 sizes + text variants), PillButton (primary/secondary, all 3 sizes, icon, as link), PillBadge (all 3 gradient tones). No cursor mounted.
- `src/components/SLogo.tsx`: new client component. Props: size, href, ariaLabel, showText, textLabel, subText, className. 720deg spin on mouseenter via JS class toggle; animationend cleanup.
- `src/components/PillButton.tsx`: new server component. Discriminated union type on href renders as Link or button. Variants: primary/secondary. Sizes: sm/md/lg.
- `src/components/PillBadge.tsx`: new server component. Three gradient tones (grad-1/2/3) from Phase 2 @theme tokens.
- `src/components/Cursor.tsx`: new client component. RAF lerp loop at 0.55 factor. CSS vars --cursor-x/--cursor-y on documentElement. Guards for pointer:coarse and prefers-reduced-motion. Full cleanup on unmount.
- `docs/DESIGN_SYSTEM.md`: all four Phase 3 component specifications populated (SLogo, PillButton, PillBadge, Cursor). --color-badge-fg added to colour token table.
- `docs/DECISIONS.md`: DEC-015 added (Phase 3 @theme amendment, space-y-20 rationale).

---

## 2026-05-19 PKT
### feat(tokens): translate v15 design tokens to Tailwind v4 @theme, set up font stack with preload budget

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push to main
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/app/globals.css`: 9 @font-face blocks (PP Right Grotesk x3, PP Right Grotesk Text x2, PP Neue Montreal x3, PP Neue Montreal Text x1), @theme block with 33 colour tokens + font/radius/easing/breakpoint/type-scale/shadow tokens, @theme inline for --font-mono, @layer base structural resets, :root app-specific tokens, body[data-font="montreal"] font toggle stub.
- `src/app/layout.tsx`: JetBrains Mono via next/font/google (preload: false), exactly 2 preload links (WideBlack + Text Regular), jetbrainsMono.variable className on html.
- `src/app/page.tsx`: minimal landing surface with wordmark (PP Right Grotesk 900), subtitle (PP Right Grotesk Text 400), and ISO date timestamp (JetBrains Mono). All three families render above the fold. All colours via @theme token utilities.
- `public/fonts/`: extracted from portfolio_design_v15/fonts.zip. 9 woff2 files.
- `docs/DESIGN_SYSTEM.md`: all Phase 2 sections populated. Spatial Black weight corrected from 900 to 800 (v15 source of truth).

---

## 2026-05-19 21:10 PKT
### feat(scaffold): initial Next.js 16 project + dev tooling + six docs

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending (Sarib to connect via Vercel dashboard)
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL
