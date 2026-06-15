# Deferred Fixes

Tracked items intentionally left for a later pass, so a future reader seeing them knows they are
logged, not overlooked. Created during Phase 19.7 (2026-06-11).

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

## Notes

- These items were surfaced during the Phase 19.7 working-tree audit. The count discrepancies trace to
  mdoc/visible copy not being updated when `experience.ts` was corrected in Phase 19.1.
- Out-of-scope pre-existing em-dashes in code/CSS comments (`globals.css`, `page.tsx:77`) and in
  `docs/CHANGELOG.md` prose are not tracked here; the no-em-dash rule targets delivered copy, not
  internal comments and changelog history.
