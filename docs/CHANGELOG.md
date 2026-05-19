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
