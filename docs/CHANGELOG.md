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
