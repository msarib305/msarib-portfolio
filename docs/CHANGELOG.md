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
