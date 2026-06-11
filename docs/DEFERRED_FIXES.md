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

## Notes

- These items were surfaced during the Phase 19.7 working-tree audit. The count discrepancies trace to
  mdoc/visible copy not being updated when `experience.ts` was corrected in Phase 19.1.
- Out-of-scope pre-existing em-dashes in code/CSS comments (`globals.css`, `page.tsx:77`) and in
  `docs/CHANGELOG.md` prose are not tracked here; the no-em-dash rule targets delivered copy, not
  internal comments and changelog history.
