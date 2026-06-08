# External Tool False Positives

Records of external tool detections on msarib.dev that were investigated and found to be
inaccurate or out of scope. Maintained so future investigations have a reference point.

---

## BuiltWith: German Commercial Register Number
**Date investigated:** 2026-06-08
**BuiltWith claim:** Site contains a Handelsregisternummer (HRB/HRA pattern).
**Search performed:** codebase grep for HRB, HRA, Handelsregister, Handelsregisternummer
  (excluding node_modules, .next, .git)
**Matches found:** zero
**Verdict:** False positive. BuiltWith detection pattern likely matched an unrelated number
  sequence via an over-broad regex.
**Action:** None. No Handelsregisternummer exists on msarib.dev.

---

## BuiltWith: GitHub References
**Date investigated:** 2026-06-08
**BuiltWith claim:** Site has GitHub references.
**Search performed:** codebase grep for "github" case-insensitive (excluding node_modules, .next, .git)
**Matches found:** 48 total; 1 user-visible
**User-visible match:** Convai UE SDK link in content/projects/convai-npc-integration/index.mdoc
  (third-party library reference rendered on the case study page)
**Verdict:** True positive. The Convai NPC Integration case study was removed in Phase 19.1
  (DEC-075). After removal, zero user-visible GitHub references remain on msarib.dev.
**Residual:** BuiltWith may also detect via the GitHub repo homepage metadata backlink
  (repo homepage field points to msarib.dev). That is out of scope; cannot be fixed from
  the msarib.dev codebase.
