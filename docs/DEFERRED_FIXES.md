# Deferred Fixes

Tracked items intentionally left for a later pass, so a future reader seeing them knows they are
logged, not overlooked. Created during Phase 19.7 (2026-06-11).

## Resolved in Phase 22 (2026-06-16)

- **Item 1** (global-error.tsx em-dash) RESOLVED 22.1 (sentence split).
- **Items 2 and 3** (studio/title count copy) RESOLVED 22.1, but in the OPPOSITE direction: the canonical
  was changed to 5 studios / 6 engagements / 10 titles, so visible copy went to "five studios" (not "six").
  See DEC-085.
- **Item 4** (anime mdoc role) RESOLVED 22.1 (Vmmersion to "Lead Software Developer").
- **Item 6** (pre-existing em-dash sweep) RESOLVED 22.1 (all 45 em-dashes swept; 5 en-dashes too).
- **Item 7** (images.qualities warnings) RESOLVED 22.5 (`[40, 55, 75]`).
- Also resolved in 22.1: Work H1 "2019 to present" trim; About H1 and Home Hero "from Lahore" trims.
- Resolved in 22.5: nested-`<main>` bug in `writings/[slug]/page.tsx` (found during the markup audit).

Item 5 (WSL Lighthouse Chrome path) remains pending below.

**Scroll-on-load (Phase 22.8a, 2026-06-17):** Phase 22.2's `data-scroll-behavior="smooth"` fix was CORRECT
for Next.js 16's transition behavior but did NOT address all scroll-on-load sources. A separate
`GalleryThumbnails` `scrollIntoView`-on-mount source scrolled case studies down to the bottom-of-page
thumbnail strip; fully resolved in 22.8a with a `prevIndexRef` guard (see DEC-086). Lesson for future
regression hunts: check BOTH the framework scroll mechanism AND any component-level `useEffect`s that call
`scrollIntoView` / `scrollTo` / `focus`.

## Resolved in Phase 23 (2026-06-17)

- **Item 9** (legacy `gallery` field + `CaseStudyGallery` removal) RESOLVED 23.1. The chain was wired but
  carried only empty arrays in all 8 mdocs; removed end to end (the empty `gallery: []` frontmatter had to
  be stripped from every mdoc too, since Keystatic's strict reader rejects orphaned keys). It had been
  pencilled for Phase 24; pulled forward into Phase 23's hygiene step. See DEC-087.

Phase 23 also delivered five QoL features + a table of contents (reading progress bar, back-to-top, reading
time on case studies, print stylesheet, TOC, keyboard shortcuts + modal). These were planned features, not
items from this list. None of the other pending items below were resolved by Phase 23.

## Resolved in Phase 24 (2026-06-18)

Five fixes, all regression / polish on Phase 23 features. Full rationale in DEC-088.

- **Back-to-top Windows regression** RESOLVED 24.1. uBlock Origin's cosmetic filter matched the generic
  `.back-to-top` class; renamed to `.msarib-back-to-top` and locked the `msarib-` prefix convention for all
  new CSS. Android touch target 44x44px + safe-area-inset padding.
- **TOC sidebar 64px gap** RESOLVED 24.2. Moved `padding-top` from the body to the grid parent so sidebar and
  body share one baseline.
- **Case study heading periods** RESOLVED 24.3. 65 headings got a trailing period; the TOC strips it at
  display.
- **Reading progress jumpy + middle-click miss** RESOLVED 24.4. rAF polling loop + lerp replaces the scroll
  listener and CSS transition.
- **Case study hero layout rework** RESOLVED 24.5. Two-column title/specs grid; reading time moved into the
  specs; `CaseStudyHeader` split into `CaseStudyTags` + `CaseStudyTitle`; orphaned `ReadingTime` deleted.

New deferred item surfaced (mobile keyboard shortcuts visibility, Issue 6b) is listed below; Phase 25 scope
is captured in its own section.

## Resolved in Phase 25 (2026-06-19)

Full rationale in DEC-089 (Cross-Environment Resilience Pass, 25.1 to 25.9).

- **Filter-list immunity audit** RESOLVED 25.1 / 25.2. Back-to-top `aria-label` removed (`9d9b2b7`); full audit
  of 343 selectors / 18 aria-labels / ~22 ids found zero new at-risk matches, so the retroactive sweep was a
  no-op (no migration needed).
- **Extension defenses** RESOLVED 25.3 to 25.5. Dark Reader lock (cross-referenced; the meta predates Phase 25
  via `2932904`), translate identity + layout hardening, Bitwarden attribute, Turnstile email fallback.
- **Browser / OS edge cases** RESOLVED 25.6. No-JS noscript fallback (`e764943`); Forced Colors pill border
  (`d31002c`). (`prefers-reduced-data` and `prefers-contrast: more` deferred, see below.)
- **Real-device test matrix** RESOLVED 25.7. RESILIENCE.md scaffolded with the matrix and failure-handling
  protocol; running it on hardware surfaced the 25.7.a-e hotfix arc (hero jumble, about zoom, reel height, nav
  drawer, footer touch targets), all shipped. Real-device re-verification of those fixes is PENDING (below).
- **Public credibility page** RESOLVED 25.8. `/resilience` shipped (`464ef48`).

---

## Copy editorial pass (post-19.7)

A single editorial pass that reconciles visible page copy with the canonical counts and the
authoritative role title in `docs/PROFESSIONAL_HISTORY.md`. None of these are in 19.7 scope (19.7
shipped no visible-copy changes), but the meta descriptions on `/about` and `/work` already use the
canonical counts, so the visible copy currently lags the meta. Resolve all four together.

Priority order:

1. **`src/app/global-error.tsx:24` user-visible em-dash (ELEVATED).** The error-page body sentence
   that begins "Reload the page" contains an em-dash before "if it keeps happening." This is a project
   no-em-dash rule violation in user-facing copy (not a code comment), so it is the top-priority item.
   Replace the em-dash with a comma, semicolon, or separate sentence.

2. **`/about` visible copy: "five studios" to "six studios".** The page body still says five studios;
   the canonical count is six (`docs/MASTER_CONTEXT.md`). The `/about` meta description already says
   "six studios".

3. **`/work` visible copy: "Nine shipped projects across five studios" to "Ten shipped titles across
   six studios".** The canonical counts are ten titles and six studios. The `/work` meta description
   already uses the canonical wording.

4. **Anime case-study mdoc summary: "Senior Unreal Engine Developer on a team of five UE devs" to
   "Lead Software Developer".** `content/projects/anime-stylized-action-tgs2024/index.mdoc` carries a
   stale role title; the authoritative title in `docs/PROFESSIONAL_HISTORY.md` is "Lead Software
   Developer". `llms-full.txt` (shipped in 19.7) already uses the authoritative title, so the mdoc and
   `llms-full.txt` currently disagree until this is fixed. See DEC-082.

---

## Tooling (added Phase 20, 2026-06-12)

5. **WSL Lighthouse runner: Chrome path fails to launch.** The project's Lighthouse runner
   (`scripts/lighthouse.mjs`, run via `pnpm lighthouse`) resolves a Windows Chrome path
   (`C:\Users\...`) that fails to launch when invoked from WSL, so local Lighthouse cannot run in a
   WSL session. Workaround for a future WSL run: install Chrome in the Linux side and set
   `CHROME_PATH=/usr/bin/google-chrome` (or point the runner at the Playwright-bundled Chromium).
   Environmental only, unrelated to any shipped code. Production Lighthouse (run from a normal
   browser or CI) is unaffected.

---

## Discovered Phase 21 (2026-06-15)

Phase 21 resolved none of the items above; all remain pending. Two new items surfaced.

6. **Pre-existing em-dash audit and sweep.** Discovered during Phase 21.1: em-dashes exist in
   `src/data/expertise.ts` `bwImageAlt` strings (e.g. "Combat and gameplay systems -- Unreal Engine
   development"), `src/components/FeatureShowcase.tsx` `SHOWCASE_ALT`, and various comments across the
   codebase. These predate Phase 21. Per the project no-em-dash rule they should be removed in a
   dedicated sweep phase. Special handling for alt text (read aloud by screen readers as pauses, which
   is sometimes structurally intentional), evaluate case-by-case: em-dash separating subject from
   clarifier -> replace with comma or colon; em-dash as AI-tell punctuation -> replace with comma or
   sentence rewrite; em-dash inside a quote -> preserve (quoted material is exempt). Comments can be
   swept aggressively (no a11y or rendering concerns). Recommend: post-Phase-21, before any new content
   phases. (Note: this deliberately expands the line-below caveat, which previously left comment/alt
   em-dashes untracked; alt text is delivered, screen-reader-facing copy and is now in scope.)

7. **Next.js 16 `images.qualities` warnings (dev-only).** Surfaced during Phase 21.2 on a fresh dev
   server start. The `<Image>` component warns when `quality` props do not match values in
   `next.config.ts`'s `images.qualities` array (default `[75]`). Current code uses `quality={40}` on the
   FeatureShowcase glow and `quality={55}` on the expertise cards. Fix: add 40 and 55 to the array,
   `images: { qualities: [40, 55, 75] }`. Two-line config change. Dev-only warning; production renders
   correctly. Predates Phase 21.

---

## Deferred (added or confirmed Phase 22, 2026-06-16)

8. **FIND ME button platform icons (future).** Add LinkedIn / YouTube / Upwork / Fiverr brand marks plus
   an envelope icon for the email link, applied to all 5 FIND ME buttons on `/contact`. Scope creep
   relative to 22.7's "same styling as the existing 4" brief, but aligns with the 22.3 case-study pill icon
   work (same recruiter-scanning recognition logic). The `platformIconForUrl()` helper and the inline
   Simple Icons marks from 22.3 can be reused. (Carried past Phase 23; not picked up there.)
9. ~~**Legacy `gallery` field + `CaseStudyGallery` removal.**~~ RESOLVED 23.1 (see above; was pencilled for
   Phase 24, pulled forward).
10. **DMARC upgrade (manual, Sarib, Cloudflare DNS).** Current policy is `p=none` (monitor only). Staged
    rollout once the `none` reports show clean alignment: move to `p=quarantine` on or after 2026-06-17,
    then to `p=reject` once `quarantine` runs clean for a reporting window. Manual Cloudflare DNS TXT edit
    by Sarib; not a code change. See `docs/DNS_CONFIGURATION.md`.
11. **CSP enforcement flip** (report-only to enforce). The report-only CSP console notice is the only
    standing first-party console error site-wide. Not taken in Phase 24; deferred to the end of the
    resilience arc, per Sarib.

    **Hard prerequisite (surfaced 2026-06-21, post-Phase-25 recovery commits).** Instagram reel embeds
    on `/projects/exarta-uefn-portfolio` (Enigmara, Clumsy Champions, and the newly added CR-ICE-IS
    gallery) violate the current report-only CSP. Confirmed via Playwright console during the CR-ICE-IS
    gallery commit: activating a reel logs `Framing 'https://www.instagram.com/' violates report-only
    CSP directive: frame-src challenges.cloudflare.com www.youtube-nocookie.com`. Report-only logs but
    does not block, so reels work today; an enforced flip would BREAK every Instagram embed site-wide.
    Before flipping, next.config.ts must add www.instagram.com to frame-src and (almost certainly)
    script-src (the embed.js loader); img-src and connect-src may also need Instagram CDN domains
    depending on what the embed fetches. Verification: enable the enforced CSP locally, navigate to
    /projects/exarta-uefn-portfolio, click each gallery's reel, capture every domain the CSP blocks,
    add those to next.config.ts, re-verify all reels load, then flip production. Recommend a
    comprehensive sweep of ALL report-only violations before the flip, not just the Instagram one.
12. **GitHub README rewrite.** Separate effort.
13. **Full device matrix testing.** Separate effort.
14. **Code-block copy buttons (future).** A click-to-copy affordance on `<pre>` code blocks in case-study
    and writings prose. Not in Phase 23 scope.
15. **Blog content (Phase 26).** `content/writings` is currently empty; the writings detail route, reading
    time, progress bar, and TOC are all live and waiting on actual posts.
16. **Mobile keyboard shortcuts visibility (Issue 6b, deferred from Phase 24).** The keyboard-shortcuts modal
    and its discoverable affordance stay visible on all devices. A keyboard-only feature has little value on
    touch-only devices. Future consideration: detect `(hover: none)` and `(pointer: coarse)` to hide it on
    touch-only devices. See DEC-088.

## Phase 25 scope -- Cross-Environment Resilience Pass (SHIPPED 2026-06-19)

SHIPPED across 25.1 to 25.9; see "Resolved in Phase 25" above and DEC-089. The original scope is preserved
below for reference. The largest resilience pass since the site foundation. Scope:

- **Filter-list immunity audit.** Retroactively apply the `msarib-` prefix to existing at-risk public-facing
  CSS classes (the convention was locked in 24.1 for NEW classes; this sweeps the back catalogue). See
  DEC-088.
- **Extension category defensive patterns.** Dark Reader, page-translate, password managers, and privacy
  extensions: audit for breakage and add defensive patterns.
- **Browser / OS edge cases.** Windows Forced Colors mode, `prefers-reduced-data`, no-JS, iOS Safari, and
  hybrid (touch + pointer) devices.
- **Real-device test matrix.** A defined matrix of browser / OS / device combinations the local Linux
  Playwright Chromium cannot cover (the cross-platform gap documented in DEC-088).

### Planned post-Phase-22 action (sequenced, not a deferred fix)

After Sarib toggles the GitHub repo private, a small follow-up commit removes `/docs/MASTER_CONTEXT.md` and
`/docs/PROFESSIONAL_HISTORY.md` from `.gitignore` and `git add`s both, tracking the canonical context docs
for cross-machine backup without public exposure. See DEC-085.

---

## Deferred from Phase 25.6

### prefers-reduced-data implementation

Skipped during Phase 25.6 due to poor browser support: Chrome only honors this via its data-saver mode;
Firefox and Safari don't ship the media query at all. Real-world coverage is minimal even though Tier 1
lists it conceptually. Revisit when Chromium-derived browsers and Safari ship native support, OR if user
feedback indicates strong demand for data-conscious rendering (skip showreel autoplay, lower Cloudinary
quality, drop decorative effects).

### prefers-contrast: more implementation

Skipped during Phase 25.6 because Phase 25.6's Forced Colors defense already addresses the strongest
high-contrast case (Windows High Contrast / `forced-colors: active`). Adding `prefers-contrast: more` would
provide marginal additional hardening on already-covered territory. Revisit if user feedback indicates need
for softer high-contrast preferences (e.g., users who don't enable Forced Colors but increase system
contrast).

---

## Deferred during Phase 25.7 to 25.9 (2026-06-19)

Surfaced by the real-device session and the 25.7.f investigation. Full rationale in DEC-089 and RESILIENCE.md
Section 6.

- **Safari card/glow cosmetics (3 items, 25.7.f).** Expertise-card rounded corners flatten on hover, WIB card
  top border crops on hover, and the gradient / showreel-glow blur shows an edge on macOS Retina Safari. No
  clean single-rule fix covered all three. The one candidate (`transform: translateZ(0)` on `.exp-card`)
  cannot be verified without real Safari and risks a `.exp-tint` mix-blend-mode regression; captured for a
  future real-device experiment. Safari-only, non-blocking.
- **Performance "lag after sustained use" (across browsers).** Needs profiling. Hypothesis from the 25.7
  diagnostic pass: cumulative cost of multiple always-running requestAnimationFrame loops (Cursor, ShowreelGlow
  canvas, Nav scroll) plus content-visibility re-render on scroll plus the always-on atmospheric-gradient
  animations. Deferred to a future investigation phase.
- **Nested-`<main>` in three pages.** `src/app/contact/page.tsx`, `src/app/writings/page.tsx` (the index), and
  `src/app/design-system/page.tsx` each render their own `<main>` inside the layout's
  `<main id="main-content">`, a CLAUDE.md one-main violation. `/about` and the new `/resilience` are correct
  (fragment return). The `writings/[slug]` instance was fixed in 22.5; these three remain. Surfaced during the
  25.8 pre-flight. Batch in a post-Phase-25 hygiene pass, not piecemeal.
- **iPhone XR (A12, 3GB) general slowness.** Older-hardware platform reality on an animation-heavy site, not a
  fix candidate. Recorded so it is not re-investigated as a bug.
- **25.7.a to 25.7.e real-device re-verification (PENDING).** The five fixes are Playwright-Simulated and
  shipped; real-device verification on iPhone XR, iPhone 14 Plus, and Pixel 8 Pro is pending Sarib's session
  and folds into RESILIENCE.md as living-document maintenance (Section 5 datestamps, Section 4 status flip),
  not a numbered sub-phase. Critical findings would trigger a hotfix sub-phase per RESILIENCE.md Section 6.

- **ShowreelGlow cold-load black-video race (macOS Safari) -- Finding 2, HIGH.** On a cold-cache load of the
  home page in macOS Safari, the showreel `<video>` renders black while the blurred glow `<canvas>` behind it
  draws the video frames correctly (proof the video is decoding); a force reload clears it. Root cause:
  `ctx.drawImage(video)` readback on Safari can hand the video's decode surface to the canvas and leave the
  video element's own compositing layer black until a repaint. Pre-existing (`ShowreelGlow.tsx` untouched since
  Phase 22.1; git-confirmed not in any Phase 27 / 25.10.d commit); surfaced during the Phase 27.2 MacBook
  verification. NOT reproducible in Playwright (Linux WebKitGTK) or on iPhone Safari. Candidate fixes (need
  real-device iteration): (1) a compositor repaint nudge on the video's `playing` event; (2) drive the canvas
  from `requestVideoFrameCallback` so the video has painted before readback. `readyState` guards will not help
  (the canvas already has frames). Deferred to a dedicated commit with a macOS Safari iteration budget.

- **Atmospheric wash blocky edges on macOS Safari, root cause is NOT blur radius -- Finding 3, HIGH.** The
  `.atm-wrapper` / `.atm-blobs` wash shows blocky/tiled edges on Sarib's macOS Safari (Home + About). Phase 27.2
  reduced `filter: blur(100px)` to 60px, then 27.2.1 to 40px, on the WebKit large-blur-tiling hypothesis; real
  macOS Safari STILL showed the artifact at 40px (the empirically clean iOS/mobile floor), so blur radius is
  eliminated as the cause. Both changes were reverted (`cb3accb`); `.atm-blobs` is back to 100/60/40 by
  viewport. Playwright WebKitGTK rendered all three values cleanly and never reproduced the artifact (DEC-088
  divergence, reconfirmed). Do NOT iterate blur value alone. Fresh diagnostic path: Sarib captures macOS Safari
  Web Inspector on `.atm-*` (all mask + filter computed styles), tests with the mask removed vs the dual mask,
  tests with the filter removed to isolate which layer produces the edges, checks retina (2x) vs 1x, and checks
  whether `-webkit-mask-composite: source-in` (the legacy keyword WebKit resolves, vs Chromium's `intersect`)
  or a compositor layer boundary (blur layer + mask layer + animated children) is the cause. Needs Sarib's
  macOS Safari + macOS version. Extends the pre-existing 25.7.f "gradient / showreel-glow edge cutoff" entry in
  RESILIENCE.md Section 6. See DEC-091.

- **FeatureShowcase glow blocky halo on macOS Safari -- Finding 4.** `.feature-img-glow` (a duplicate image with
  `filter: blur(80px) saturate(1.4)`, `q_auto` at quality 40) shows a banded/blocky halo on macOS Safari, the
  same large-blur family as Finding 3. Phase 27.5 planned to replace the browser blur with a pre-blurred
  Cloudinary asset (`e_blur`), but that fix assumes the WebKit large-blur diagnosis; since Finding 3 eliminated
  blur radius as the atmospheric cause, 27.5 was NOT shipped, pending the Finding 3 root-cause diagnosis.
  Re-scope 27.5 once Finding 3 is understood. 27.5 also carries the separate, low-risk double-optimization
  cleanup (ExpertiseCard / FeatureShowcase routed through `/_next/image` on top of Cloudinary) and the AboutHero
  glow `f_auto` addition, both still valid regardless of the blur diagnosis.

---

## Deferred during Phase 27.6 (2026-07-02)

- **Best Practices console error: `upgrade-insecure-requests` in report-only CSP -- LOW, resolves at the CSP
  enforce-flip.** Chromium DevTools logs one error on every page load: "The Content Security Policy directive
  'upgrade-insecure-requests' is ignored when delivered in a report-only policy." This is the sole reason the
  Lighthouse Best Practices score is 96 (not 100) site-wide; no functional impact. It is expected behavior of
  `Content-Security-Policy-Report-Only` mode (the directive is only enforced under `Content-Security-Policy`),
  and it is the same "only standing first-party console error" already tracked under item 11 (CSP enforcement
  flip). Fix is automatic and requires no standalone code change: it clears when the report-only policy flips to
  enforced in `next.config.ts`. Do NOT remove the directive from the report-only policy as a workaround; it must
  stay so the report-only test accurately reflects what enforcement will apply after the flip. Diagnosed during
  the Phase 27.6 baseline correction; see DEC-092.

---

## Notes

- These items were surfaced during the Phase 19.7 working-tree audit. The count discrepancies trace to
  mdoc/visible copy not being updated when `experience.ts` was corrected in Phase 19.1.
- Out-of-scope pre-existing em-dashes in code/CSS comments (`globals.css`, `page.tsx:77`) and in
  `docs/CHANGELOG.md` prose are not tracked here; the no-em-dash rule targets delivered copy, not
  internal comments and changelog history.
