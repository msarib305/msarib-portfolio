# AGENTS.md

AI agent contract for msarib-portfolio. Applies to Claude, Cursor, Copilot, and any other AI tool working in this repo. Read this file before writing any code or content.

---

## Required context

Before starting any non-trivial task, load these two files from the Claude project context:

- **MASTER_CONTEXT.md**: visual identity, design tokens, component patterns, layout system, writing rules, locked decisions, iteration history, pending items.
- **PROFESSIONAL_HISTORY.md**: career timeline, per-role engineering scope, selected project details, verification links, framing decisions (NSFW title policy, Web3 framing, name usage).

These files are in the Claude project context, not in this repo. They are the source of truth for all design decisions, copy decisions, and professional framing. Do not invent facts or design values that are not in those files.

---

## Hard writing rules

Non-negotiable. Apply to every word authored in this repo, including markdown files, code comments, and UI copy.

- No em-dashes, ever. Use commas, parentheses, semicolons, or separate sentences.
- No en-dashes in date ranges. Write "2024 to 2025" or "2024-25" with a hyphen.
- No AI tells: "I'd be happy to", "feel free to", "it's worth noting", "great question", "let me know if", "I hope this helps", hedging ("perhaps", "might want to", "you may wish to"), triplet adjective lists ("clean, modern, and beautiful"), unnecessary disclaimers, sycophancy in any form.
- Second editing pass on every piece of copy to strip AI tells before delivery.
- Direct, specific, opinionated voice. The narrator is an engineer who has shipped things, not a brand account.
- Specificity over abstraction. "Reduced bandwidth per client by 38%" beats "improved performance significantly."

---

## Plan-mode discipline

- Always plan before writing code for any phase or feature work. Produce a plan file, present it, then stop and wait.
- Ask before running `pnpm install` or `pnpm add` with any new packages. State what will be added and why.
- Never commit without explicit confirmation from Sarib. List staged files and commit message, wait for yes.
- Never push without a yes.
- Never delete files without listing them and waiting for a yes.
- Default to plan mode for all multi-step work.

---

## MCP usage protocol

- **Context7** first for any question about Next.js, React, TypeScript, Tailwind, Motion, Lenis, Keystatic, Cloudinary, or any npm package. Next.js 16 has breaking changes from training data. Never rely on memory for Next.js 16 specifics.
- **Playwright** after any change that touches an interactive flow (contact form, mobile menu, nav, font A/B toggle, expertise card hover, S-logo hover and click). Run at the end of the phase.
- **GitHub MCP** for all commit and push operations.
- **Vercel MCP** for deployment status, build logs, and environment variable management.

---

## Allowed commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm format
pnpm format:check
```

Plus `gh` CLI for repo operations. Any command outside this list requires explicit confirmation before running.

---

## Content schema for project case studies

Keystatic MDX frontmatter fields. Each field maps directly to the Keystatic collection schema defined in Phase 10.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Display name of the project |
| `summary` | string | yes | One to two sentences. No AI tells. |
| `date` | date (YYYY-MM-DD) | yes | Ship date or most recent significant milestone |
| `status` | enum | yes | `"shipped"`, `"in-production"`, `"prototype"`, `"cancelled"` |
| `role` | string | yes | e.g. "Lead Developer", "Sole Developer" |
| `engine` | string | yes | e.g. "UE5.5", "UE4.27" |
| `tags` | string[] | yes | From the tag taxonomy below |
| `client` | string | no | Studio or client name if applicable |
| `cover` | string | yes | Cloudinary public ID (e.g. `msarib/custom-fps/cover`) |
| `coverAlt` | string | yes | Descriptive alt text for the cover image |
| `gallery` | string[] | no | Array of Cloudinary public IDs |
| `video` | string | no | YouTube video ID, exactly 11 characters |
| `featured` | boolean | no | Defaults to false. Featured projects appear in the hero section. |
| `links` | {label: string, url: string}[] | no | External links (Steam page, trailer, press) |

---

## Tag taxonomy

Use only these tags. Do not invent new tags without updating this list.

**Engine versions:**
`UE4.22`, `UE4.23`, `UE4.24`, `UE4.25`, `UE4.26`, `UE4.27`, `UE5.0`, `UE5.1`, `UE5.2`, `UE5.3`, `UE5.4`, `UE5.5`, `UE5.6`, `UE5.7`

**Technology:**
`Niagara`, `GAS`, `replication`, `VR`, `pixel-streaming`, `UEFN`, `Verse`, `Blueprints`, `C++`, `AI-integration`, `Sequencer`, `MetaQuest`, `mobile-Android`, `mobile-iOS`, `Web3-Solana`, `Web3-Ethereum`

**Role:**
`Lead`, `Senior`, `Developer`, `Solo`

---

## Cloudinary workflow

All project media is stored in Cloudinary (free tier, 25 credits per month).

Folder convention: `msarib/<project-slug>/<asset-name>`

Examples:
- `msarib/custom-fps/cover.webp`
- `msarib/character-creator/gallery-01.webp`

Do not store media files in the repo. Reference Cloudinary public IDs in MDX frontmatter. The `next-cloudinary` package (added Phase 14) handles image rendering and transformation.

Version-pinning for cache busting (Phase 22): the free tier has no CDN invalidation, so re-uploading to an existing public_id keeps serving the cached old asset. When an asset is re-uploaded to a public_id already referenced in code, insert or bump the `/v<timestamp>/` segment in the delivery URL (between the transforms and the public_id) to force a fresh CDN path. Example: `.../w_1200/v1781608059/SystemsOtherEngineersWillInherit_mbk5yw`. See DEC-085.

---

## YouTube workflow

Videos are uploaded as unlisted to youtube.com/@msarib305. The 11-character video ID goes in the MDX frontmatter `video` field. The `react-lite-youtube-embed` component (added Phase 10) handles the embed. Do not use full YouTube URLs in frontmatter.

---

## Layout system (Phase 20 standard)

`.section-container` is the single source of truth for section spacing. Every full-width content section
uses it. Do NOT declare per-section `padding` / `max-width` / `margin: 0 auto` on new sections.

- **`.section-container`**: `max-width: var(--container-max)`, `margin-inline: auto`, `padding-block: 80px`
  (40px from 1280 down), `padding-inline: var(--section-gutter)`.
- **`.section-container--hero`**: adds nav-clearance top padding (132px desktop, 100px from 1280 down).
  Use on the first section of a page (the hero).
- **`.section-container--flush-top`**: zeroes the top padding. Use on a section that directly follows a
  hero (e.g. a card grid under the hero), so it does not double the vertical gap.
- **`--section-gutter`** (64 / 40 / 32 / 16 at 1280/1024/768) is the shared inline gutter token. Bespoke
  sections that cannot use `.section-container` (custom-width prose, margin-based media rows) MUST still
  set `padding-inline: var(--section-gutter)` so their content left-edges align with everything else.
- **Article widths**: prose columns use `--container-article-sm` (824, long-form reading),
  `--container-article-md` (1200, case body with images), `--container-article-lg` (1440). Do not
  introduce new bespoke prose `max-width` values; reuse a token (within ~5%).
- **Breakpoints**: the system is xs(375) / sm(600) / md(900) / lg(1200) / xl(1600) / xxl(1920) as tokens,
  but the section media queries are hardcoded at 1280/1024/768 (UE's values) and 1200/900/600 (legacy
  grid breakpoints). Match the existing query for the property you are editing.
- **Type recipes**: `.heading-2xl`..`.heading-xs`, `.paragraph-lg`..`.paragraph-xs`, `.eyebrow-lg/md/sm`,
  `.ui-lg/md/sm` are available. Prefer a recipe class over a fresh inline `font-size` on new pages.
- **Full-bleed elements must NOT live inside `.section-container`.** Anything that reaches the viewport
  edges (atmospheric washes, banded backgrounds, edge-to-edge gradients) cannot rely on its parent's
  width, because `.section-container` caps it at 1440. Use a viewport-relative box (`position: absolute;
  left: 50%; width: 100vw; margin-left: -50vw`, or `104vw / -52vw` for a 2vw overshoot), or render the
  background on a `::before` / `::after` with the same technique while the content stays inside the
  container. `body { overflow-x: clip }` makes `width: 100vw` safe (no horizontal scroll). See the
  DEC-083 Phase 20.4 amendment (`.atm-wrapper`, `.exp-row.current::before`) for worked examples.

Full rationale and the gutter-token strategy are in DEC-083 (and its Phase 20.4 amendment).

---

## Testing protocol

Run in this order after every meaningful change. All steps must pass before the change is considered done.

1. `pnpm typecheck` must exit 0 with no type errors
2. `pnpm lint` must exit 0 with zero errors and zero warnings
3. `pnpm build` must succeed
4. Vercel preview deploy on push must succeed
5. Playwright test for any interactive flow touched in this change
6. Manual visual confirmation from Sarib via the preview URL

Log all results in `docs/CHANGELOG.md` using the format defined there.

Console errors are a hard fail. No change ships with red text in DevTools. Hydration warnings count as console errors.

---

## Component and CSS patterns (Phase 22)

Full rationale in DEC-085. Reuse these rather than reinventing.

- **Canonical counts**: 5 studios / 6 engagements / 10 titles (replaced Phase 19.7's "six studios"; do not re-litigate). "Six UEFN titles" is a separate count. Vmmersion role is "Lead Software Developer".
- **Scroll restoration**: `data-scroll-behavior="smooth"` on `<html>` (Next.js 16). No `usePathname` scroll-to-top handler (it fires on POP and breaks back/forward restore).
- **One `<main>` per document**: `layout.tsx` owns the `<main>`; page components return fragments. Never nest a second `<main>`.
- **Interactive-but-disguised tint**: low-alpha accent inset box-shadow wash on an intentionally obscured-but-interactive element (the NSFW blur), fading on reveal. Not a `::before` (stacks above text), not a gradient background (does not animate).
- **CSS Grid interactive items**: explicit `justify-self` on focusable/clickable grid children, or the hit/focus box stretches to the column (the S-logo bug).
- **Clickable image grid**: `ImageGrid` optional `href`, threaded through the Keystatic schema and `normalizeImageGridItems`, rendered as an `<a target="_blank" rel="noopener noreferrer">` wrapper.
- **External link pills**: `platformIconForUrl()` + inline Simple Icons path data in `PlatformIcon.tsx` (no `simple-icons` dependency).
- **Overlay text on video**: heavy multi-layer `text-shadow` for legibility on bright frames; do not downgrade.
- **Reading mode**: `<article>` + schema.org microdata on case studies (CreativeWork) and writings (BlogPosting); JSON-LD scripts and prev/next nav stay outside the `<article>`.

### useEffect scroll/focus on mount (Phase 22.8, DEC-086)

A `useEffect` that calls `scrollIntoView`, `scrollTo`, or `focus` on a value with a deterministic initial
state ALSO fires on mount with that initial value, which can cause an unintended scroll/focus jump on page
load. The Phase 22.8a gallery bug: a thumbnail `scrollIntoView` keyed on `currentIndex` fired on mount
(index 0) and scrolled the page down to the bottom-of-page strip.

Guard one of three ways:
- **Previous-value comparison** (preferred): `if (prevRef.current === value) return; prevRef.current = value`. Skips the mount run.
- Move the side effect into the event handler that changes the value (so it runs on the change, not on mount).
- A sentinel initial value the user can never set first.

Do NOT use a one-shot `isInitialMount` ref flag: React Strict Mode double-invokes effects in dev (run,
cleanup, run again on the same instance), which flips the flag on run 1 so run 2 still fires. It works in
production but fails dev verification.

Test pattern: scroll/focus Playwright checks must wait for the latest-mounting component's DOM to be present
(e.g. the gallery's `.gallery-thumbnail--active`), not just for navigation to resolve, or they miss effects
that fire later in the lifecycle. This is directly relevant to Phase 23 (reading progress bar, back-to-top,
keyboard shortcuts).

---

## Component and CSS patterns (Phase 23)

Full rationale in DEC-087. Reuse these rather than reinventing.

- **Custom-event bridge for RSC -> Client**: a Server Component cannot use React context (client-only) to
  trigger a Client Component action. Dispatch `window.dispatchEvent(new CustomEvent('name'))` from a small
  client child and subscribe in the target listener (e.g. the Footer "Keyboard shortcuts" link ->
  `KeyboardShortcuts`). Decoupled, respects the RSC boundary.
- **Global key listener suppression**: a `window` `keydown` must bail when a modifier is held (`ctrlKey` /
  `metaKey` / `altKey`, so browser/OS shortcuts pass through) AND when focus is on a text surface (INPUT /
  TEXTAREA / SELECT / `isContentEditable`, so typing is not hijacked). `KeyboardShortcuts.tsx` is the
  reference.
- **Portal modal**: `createPortal` to `document.body`, `role="dialog" aria-modal`, reuse `useFocusTrap`
  (`@/components/Gallery/hooks/useFocusTrap`, which handles initial focus + Tab wrap + focus restoration on
  unmount), lock `document.body.style.overflow` in an effect, restore on cleanup. z-index 210 (above gallery
  fullscreen 200). Respect `usePrefersReducedMotion` (no fade).
- **Scroll-listener read vs jump (DEC-086 scope)**: a scroll/resize listener that only SYNCS state to the
  current scroll position (reading progress bar) is exempt from the DEC-086 mount guard; the initial call is
  a read, not a scroll side effect. Only listeners that CAUSE a scroll/focus jump need the guard.
- **IntersectionObserver active state**: track the active section with an IO callback plus a `prevActiveRef`
  guard (DEC-086), `rootMargin` tuned to bias toward the heading near the top of the viewport.
- **`scroll-margin-top` for fixed-nav anchors**: hash jumps under the fixed nav land beneath it; set
  `scroll-margin-top: 90px` on the jump targets (`.case-body / .post-body :is(h2, h3)`).
- **Sticky inside a grid needs `align-self: start`** on the sticky element itself (not `align-items: start`
  on the container); a stretched grid item leaves a sticky child no room to travel.
- **`:has()` guard for conditional grid columns**: `.toc-layout:has(> .toc)` applies the two-column grid only
  when the optional child is present, so an absent TOC reserves no empty column.
- **Extend, do not duplicate, `@media` blocks**: add rules to the existing `@media print` (and other media)
  block rather than opening a second one; two blocks both apply with last-wins cascade and drift apart.
- **Verify class names against the stylesheet**: grep `globals.css` for the real selector before writing a
  rule against it (the plan's `.case-study-nav` was actually `.case-nav`).
- **Keystatic strict reader**: removing a schema field is not enough; `createReader` rejects orphaned
  frontmatter (`Key ... not allowed`). Grep the content files and strip the key from frontmatter in the same
  commit as the schema deletion.

---

## Component and CSS patterns (Phase 24)

Full rationale in DEC-088. Reuse these rather than reinventing.

- **`msarib-` prefix on all new public CSS classes (LOCKED from 24.1)**: generic names like `.back-to-top`,
  `.share-buttons`, `.cookie-notice` collide with ad-blocker cosmetic filter lists (uBlock Origin, AdBlock
  Plus, AdGuard) and get `display: none`'d in user browsers with those extensions. Prefix every new class
  `msarib-` to immunize it. Tailwind utilities and framework classes (Keystatic) are exempt; they do not
  collide in practice. Phase 25 retroactively audits and prefixes existing at-risk classes.
- **Cross-platform verification**: the local test environment (Linux Playwright Chromium) does NOT cover all
  browser / OS / extension combinations. Bugs that do not reproduce locally may still exist on Windows
  browsers, on browsers with common extensions, or on mobile / tablet. A green Playwright run is necessary,
  not sufficient; real-device verification is required for production-grade features. (The 24.1 back-to-top
  bug was an ad-blocker hiding a correctly-rendered element, invisible to local Chromium.)
- **rAF polling for scroll-position tracking**: when continuously tracking scroll position for UI feedback
  (progress bars, scroll-driven animation), use a `requestAnimationFrame` loop that reads `scrollY` every
  frame, not a `scroll` event listener. Listeners miss native middle-click autoscroll on some platforms; rAF
  polls regardless of input method. Combine with a lerp to smooth the displayed value toward the true scroll
  position (`LERP_FACTOR` 0.15, or 1 under reduced-motion). The loop only READS scroll, so it is DEC-086
  exempt. `ReadingProgress.tsx` is the reference.
- **Strip-at-display, not at extraction**: when content needs different representations per context (heading
  periods in the body, none in the TOC), adapt at the consuming component (`h.text.replace(/\.$/, '')`), not
  at the data layer. The data stays semantically accurate; each consumer adapts its own presentation.
- **Grid padding belongs on the parent when a sticky child is involved**: in a CSS Grid with a sticky
  element, put top padding on the grid parent and zero the children's `padding-top` so they align with the
  sticky sibling (the 24.2 TOC alignment fix). When restructuring DOM, margins on siblings carry their intent
  forward; margins on containers may need re-anchoring (the 24.5 `.case-meta-row` `margin-bottom` preserved
  tags-to-title spacing automatically after the hero restructure).
- **Do not run `pnpm build` against a live dev server's `.next`**: the dev server and the production build
  read and write the same `.next` directory, so building while dev is running serves stale assets (this
  produced a false Playwright failure twice in Phase 24). When verifying via Playwright, restart the dev
  server fresh (terminate the running task, `pnpm dev`, wait for ready) and do not run parallel builds.

---

## Component and CSS patterns (Phase 25)

Full rationale in DEC-089. Reuse these rather than reinventing.

- **Per-line over per-character text reveal**: a per-character inline-block split jumbles on iOS 18 Safari
  after a client-side route return (Safari fails to re-measure the inline-block boxes and wraps one character
  per line). Animate per line as block-level elements instead. `Hero.tsx` `.msarib-hero-line` is the reference
  (25.7.a).
- **Opt-in animation under `prefers-reduced-motion: no-preference`**: the `@layer base` universal
  reduced-motion collapse zeroes `animation-duration` but NOT `animation-delay`, so a staggered, delayed
  element stays stuck at its hidden from-frame for the delay window under reduced motion. Define the animation
  only inside `@media (prefers-reduced-motion: no-preference)` so it does not exist when motion is off (25.7.a).
- **Portrait-media height cap**: cap portrait or square media frames with a vh-derived `max-width`
  (`min(100%, calc(70vh * 9 / 16))`) so a 9:16 item does not tower at the full stage width. Mirror any existing
  cap by construction (same value), not a parallel rule that can drift. `.gallery-main-frame.msarib-gallery-portrait`
  is the reference (25.7.c).
- **A `transform` slide-out needs a delayed `visibility` transition**: an element that both slides via
  `transform` and toggles `visibility: hidden` snaps shut unless `visibility` transitions with a delay equal to
  the transform duration (mirror the backdrop pattern). The `--open` class is the state; no JS state machine is
  needed. `.mobile-menu` is the reference (25.7.d).
- **Touch targets via `@media (pointer: coarse)`, not a width breakpoint**: touch is the problem space. A touch
  tablet at 1000px needs 44x44 targets and a 700px desktop window does not. Footer `.footer-col ul a` is the
  reference (25.7.e, WCAG 2.5.5).
- **Decorative blur bleed needs a mobile `overflow-x: clip` guard**: `filter` blur ink-overflow and
  negative-offset bleeds do not show up in Chromium `scrollWidth`, so they cannot be reproduced locally (a
  DEC-088 simulation gap), but they widen the visual viewport on mobile Safari and read as a zoomed page. The
  `.about-hero` guard at <=900px is the reference (25.7.b).
- **`/design-system` is internal, do not surface it**: it has three noindex layers (page-level
  `robots: { index: false }`, a `robots.ts` disallow, absence from the sitemap, and no link) and is a
  QA/regression surface with stand-in assets. Do not index or footer-link it. `/resilience` is the public
  credibility page (25.8).
- **Grep-first for prior art before scoping defensive work**: a previous hardening pass may already cover the
  ground. The 2026-05-21 QA audit (`2932904`) had already shipped `darkreader-lock` and `data-lpignore` before
  Phase 25 was scoped, so 25.3 and 25.5 became cross-references and incremental additions. Grep before scoping;
  re-implementing risks divergence.
- **Resilience verification is real-device load-bearing**: local Playwright is necessary, not sufficient
  (DEC-088, reconfirmed across Phase 25). Regressions are triaged by the failure-handling protocol in
  `docs/RESILIENCE.md` Section 6: Critical (page unrenderable, form unsubmittable, content inaccessible) ships
  a hotfix sub-phase; Minor cosmetic is documented as a known limitation; Tier 2/3-only is documented with no
  fix.

---

## Future work

This section is a queue of intentionally deferred items. Each item is scoped work that Sarib decides when (or whether) to pick up.

**Post-Phase-23**

- FIND ME button platform and envelope icons on `/contact` (carried past Phase 23; not picked up there).
- Code-block copy buttons on `<pre>` blocks in case-study and writings prose (future).
- Blog content: `content/writings` is empty; the route + reading time + progress bar + TOC are live and wait on posts (Phase 26).
- DMARC staged rollout (`p=none` -> `quarantine` on/after 2026-06-17 -> `reject` once clean); manual Cloudflare DNS by Sarib. See `docs/DNS_CONFIGURATION.md`.
- CSP enforcement flip (report-only -> enforce); the report-only notice is the only standing first-party console error. Not taken in Phase 24; deferred to the end of the resilience arc, per Sarib.
- After repo privatization: un-ignore and track `docs/MASTER_CONTEXT.md` + `docs/PROFESSIONAL_HISTORY.md`. Both stay gitignored while the repo is public (private content). See DEC-085.
- Mobile keyboard shortcuts visibility (Issue 6b, deferred from Phase 24): hide the shortcuts modal / affordance on touch-only devices via `(hover: none)` + `(pointer: coarse)`. See DEC-088.

**Phase 25 -- Cross-Environment Resilience Pass (COMPLETE, 2026-06-19, DEC-089)**

Shipped across 25.1 to 25.9. Filter-list immunity audit (zero new at-risk matches, so a no-op sweep); extension defenses (Dark Reader lock cross-reference, translate identity + layout hardening, Bitwarden attribute, Turnstile email fallback); browser / OS edge cases (no-JS noscript fallback, Forced Colors pill border); `docs/RESILIENCE.md` plus a real-device test matrix; the 25.7.a-e real-device hotfix arc (hero per-line reveal, about overflow guard, reel height cap, nav drawer, footer touch targets); and the `/resilience` public credibility page. Deferred (see `docs/DEFERRED_FIXES.md`): `prefers-reduced-data`, `prefers-contrast: more`, the three Safari card/glow cosmetics (25.7.f), performance "lag over time" profiling, and the nested-`<main>` cleanup in `/contact`, `/writings` index, and `/design-system`. Real-device re-verification of the 25.7.x fixes is PENDING (folds into RESILIENCE.md as living-document maintenance).

**Performance**

- Optimize home page showreel video for bandwidth. The showreel video (`portfolio-showreel`) downloads 3.2 MB on page load because Chrome ignores `preload="metadata"` when `autoPlay` is set. Options: Cloudinary video `f_auto` (WebM/AV1 smaller derivatives), poster-first-then-video-on-idle pattern, reduced source video bitrate. Target: home page mobile Lighthouse Performance 90+.
- Lighthouse CI integration via `lighthouserc.js` + GitHub Actions. Runs on every PR, catches performance regressions before merge. Deferred from Phase 14 (DEC-059).
- Vercel Analytics integration. Real-user performance data from production visitors. Sarib decides if/when to add (paid feature).

**Content**

- ~~Upload real ExpertiseCard videos.~~ MOOT as of Phase 20.2. The hover-to-play video on home expertise cards was removed (Sarib did not want the hover behavior), so the placeholder sea turtle clips no longer render. `src/data/expertise.ts` still carries unused `video`/`poster` fields; they can be stripped in a future cleanup but are harmless. No clips need uploading.
