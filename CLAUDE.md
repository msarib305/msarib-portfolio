# CLAUDE.md

Claude Code CLI overrides for msarib-portfolio. Active whenever Claude Code runs in this directory. These rules take precedence over any userStyle or session-level instruction that conflicts.

---

## Writing rules

These are restated verbatim here because Claude Code in CLI does not automatically load AGENTS.md.

- No em-dashes, ever. Use commas, parentheses, semicolons, or separate sentences.
- No en-dashes in date ranges. Write "2024 to 2025" or "2024-25" with a hyphen.
- No AI tells: "I'd be happy to", "feel free to", "it's worth noting", "great question", "let me know if", hedging, triplet adjective lists, unnecessary disclaimers, sycophancy in any form.
- Second editing pass on every piece of copy to strip AI tells before delivery.
- Direct, specific, opinionated voice. Engineer who ships things, not a brand account.

If the chat interface applies a tone style (e.g. "teacher mode"), these project-level rules override it for all output that lands in the repo.

---

## MCP trigger protocol

| Trigger | Tool | Action |
|---|---|---|
| Any question about Next.js, React, Tailwind, TypeScript, Motion, Lenis, Keystatic, Cloudinary, or any npm package | Context7 | Resolve library ID, query docs. Do not rely on training data. |
| Any change that touches an interactive flow | Playwright | Navigate, snapshot, check for console errors. Run at phase end. |
| Any commit or push operation | GitHub MCP | Stage, commit, push via GitHub MCP. Do not run git CLI without confirmation. |
| Deployment status or logs needed | Vercel MCP | Query deployment status, build logs, runtime logs. |

---

## Guard rails

These are hard stops. Do not proceed without explicit confirmation from Sarib.

- **pnpm install / pnpm add**: Describe what will be installed and why. Wait for yes.
- **git commit**: List staged files and the proposed commit message. Wait for yes.
- **git push**: Wait for yes.
- **File deletion**: List every file to be deleted. Wait for yes.
- **Environment variables**: Never write `.env` files with real secrets. Use `vercel env add` for production secrets.

---

## Default behavior

Enter plan mode before beginning any phase or feature work. Produce a plan file at `~/.claude/plans/`, present it for review, then stop. Do not write code until the plan is approved.

---

## Performance budgets

- Font preload links: maximum 2 per page. Only preload the display cut used above the fold.
- Images: `<Image>` from `next/image` only. No raw `<img>` tags. Format: WebP or AVIF.
- Offscreen video (expertise cards): `preload="metadata"` until the IntersectionObserver fires, then call `.load()` and `.play()`.
- `content-visibility: auto` on sections that are more than one viewport below the fold.
- Showreel glow: canvas mirroring the main video at low resolution, blurred 80px. One network request total. Do not fetch the video a second time.

---

## Next.js 16 pitfalls

Training data for Next.js 15 and earlier is not reliable for this project. Use Context7 for any API question.

- `middleware.ts` does not exist in Next.js 16. It is replaced by `proxy.ts` at the project root.
- `cookies()`, `headers()`, `params`, and `searchParams` are async. They must be awaited.
- React Compiler is on. Do not manually wrap with `useMemo` or `useCallback`. The compiler handles memoization.
- Server Components are the default. Add `"use client"` only when the component needs interactivity (state, events, browser APIs, refs).
- Server Actions are the correct pattern for the contact form. No API route needed.
- Caching is opt-in. Everything is dynamic by default. Use `next: { revalidate: N }` or the `use cache` directive where caching is wanted.
- `next lint` is removed in Next.js 16. The lint script calls `eslint` directly.
- Import from `motion/react`, never from `framer-motion`. They are not interchangeable.
- Scroll restoration: Next.js 16 no longer overrides CSS `scroll-behavior: smooth` during route transitions by default. With smooth-scroll on `<html>`, set `data-scroll-behavior="smooth"` on `<html>` to restore instant scroll-to-top on forward nav while keeping native back/forward restore and anchor smooth-scroll. Do NOT add a `usePathname` scroll-to-top handler: it fires on POP and breaks back/forward restoration (DEC-085).
- One `<main>` per document: `layout.tsx` renders `<main id="main-content">` around all children, so page components return a fragment and never their own `<main>`. A nested `<main>` is invalid HTML (caught in writings, DEC-085).

---

## S-logo singleton rule

The `.s-logo` component is defined once in the CSS (Phase 3). Do not create a second definition anywhere. Do not extract it into a separate component that redefines the keyframes.

Controlled via CSS variables:
- `--s-logo-size`: default 32px. Modifier classes `.s-logo-lg` (36px) and `.s-logo-xl` (44px).
- `--s-logo-bg` and `--s-logo-fg`: background and foreground colors.
- `--s-logo-bg-hover` and `--s-logo-fg-hover`: hover-state overrides.
- `--logo-spin-duration`: 700ms.

Hover behavior: JS adds `.spinning` on `mouseenter`, removes on `animationend`. The spin always completes even if the cursor leaves mid-rotation. The wrapping `<a>` navigates to `/`.

---

## Section-container standard (Phase 20)

`.section-container` is the single source of truth for section spacing. New pages and sections MUST use it and MUST NOT declare their own section `padding` / `max-width` / `margin: 0 auto`. Modifiers: `.section-container--hero` (nav-clearance top) and `.section-container--flush-top` (zero top, for a section right under a hero). Inline padding everywhere reads the `--section-gutter` token (64/40/32/16) so content left-edges align down each page; bespoke prose/media sections that can't use the class still set `padding-inline: var(--section-gutter)`. Prose widths use `--container-article-sm/md/lg`. Full rationale in DEC-083.

Full-bleed elements (atmospheric washes, edge-to-edge gradients, banded backgrounds) MUST NOT live inside `.section-container`: it caps the parent at 1440, which clips them on wide viewports. Use a viewport-relative box (`position: absolute; left: 50%; width: 100vw; margin-left: -50vw`, or `104vw / -52vw` for a 2vw overshoot) or a `::before`/`::after` with the same technique while the content stays in the container. `body { overflow-x: clip }` makes `width: 100vw` safe. Worked examples (`.atm-wrapper`, `.exp-row.current::before`) in the DEC-083 Phase 20.4 amendment.

---

## Phase 22 patterns

- **Canonical counts (do not re-litigate)**: 5 studios / 6 engagements / 10 titles. This replaced Phase 19.7's "six studios" framing. "Six UEFN titles" is a separate, correct count. Vmmersion role is "Lead Software Developer" everywhere. (DEC-085)
- **Interactive-but-disguised tint**: when an element is intentionally obscured (e.g. the NSFW blur) but must read as interactive, apply a low-alpha accent wash via `box-shadow: inset 0 0 0 100px rgba(0,217,196,0.08)` that fades on reveal. Inset box-shadow, not a `::before` (it stacks above the text) and not a gradient background (it does not animate).
- **CSS Grid interactive items**: set explicit `justify-self` on a focusable/clickable grid child, or it defaults to `stretch` and the hit/focus box silently expands to the whole column (the S-logo bug, DEC-085).
- **Clickable image grid**: `ImageGrid` items take an optional `href`; the image wraps in `<a target="_blank" rel="noopener noreferrer">` with an accent-border + `scale(1.02)` hover. Thread any new item field through BOTH the Keystatic block schema and `normalizeImageGridItems`.
- **External link pills**: use `platformIconForUrl()` (hostname to brand icon, generic external-link fallback) for any new case-study link. Inline Simple Icons path data in `PlatformIcon.tsx`; do not add the `simple-icons` dependency.
- **Cloudinary version-pinning**: the free tier has no CDN invalidation. After re-uploading to an existing public_id, insert or bump the `/v<timestamp>/` segment in the codebase URL to force a fresh CDN path.
- **Overlay text on video**: text over the showreel video needs a heavy multi-layer `text-shadow` (the credits use a 3-layer tight+mid+wide drop) for legibility on bright frames. Do not downgrade it to a single or 2-layer drop.
- **Reading mode**: case-study and writings prose are wrapped in `<article>` with schema.org microdata; keep JSON-LD scripts and prev/next nav OUTSIDE the `<article>`.

---

## Future work

Intentionally deferred items. Full details in AGENTS.md under the same heading.

- **FIND ME button icons (Phase 23)**: add platform + envelope icons to the 5 `/contact` FIND ME buttons (DEC-085).
- **Repo privatization (post-Phase-22)**: after Sarib toggles the GitHub repo private, a follow-up commit un-ignores and tracks `docs/MASTER_CONTEXT.md` + `docs/PROFESSIONAL_HISTORY.md`. Until then both stay gitignored (private content, public repo).

- **Showreel video bandwidth**: Home page mobile Lighthouse ~81 due to 3.2 MB video download. Mitigation options: Cloudinary video f_auto (WebM/AV1), poster-first pattern, reduced bitrate.
- **Lighthouse CI**: `lighthouserc.js` + GitHub Actions. Catches performance regressions on PRs. Deferred from Phase 14.
- **Vercel Analytics**: Real-user performance data. Sarib decides if/when.
- **Real ExpertiseCard videos**: MOOT as of Phase 20.2. The hover-to-play video was removed, so the demo sea_turtle clips no longer render and no clips need uploading. `expertise.ts` keeps unused `video`/`poster` fields (harmless; strip in a future cleanup).
