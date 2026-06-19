# RESILIENCE.md

> Living document. Updated after each phase that affects resilience, or after each real-device test cycle.
> Source of truth for the `/resilience` public page content (Phase 25.8).

---

## 1. Purpose and scope

msarib.dev is hardened to work across a realistic Tier 1 user base: current browsers and OSes, common
browser extensions (ad-blockers, password managers, Dark Reader, page-translate, Grammarly), and the
accessibility system settings people actually use (reduced-motion, high-contrast, forced-colors). This
document records what is supported, what defensive patterns ship that support, how each was verified, and
where the known limits are.

Background:

- **DEC-088 (Phase 24)** established the architectural learning that drives this whole effort: a green
  local Linux Playwright Chromium run is necessary but not sufficient. It masks Windows-specific behavior,
  browser-extension behavior, and real mobile/tablet rendering. The uBlock filter-list collision that hid
  the back-to-top button on Windows Edge was invisible locally and only surfaced on a real device.
- **DEC-089 (Phase 25, ships in 25.9)** is the full Cross-Environment Resilience Pass writeup: the strategy,
  the three-tier model rationale, and the per-pillar decisions. This document is the operational companion
  to that decision record.

---

## 2. Three-tier support model

This is the canonical written record of the support model. Other docs reference this section; they do not
restate it.

### Tier 1: Fully supported (must work, will be tested)

- **OS:** Windows 10/11, macOS 12+, current Linux distros, iOS 16+, iPadOS 16+, Android 12+
- **Browsers:** Chrome, Firefox, Safari, Edge (current plus 2 previous majors), and their mobile equivalents
- **Hardware:** desktops, laptops, modern smartphones (iPhone 8+), modern tablets (iPad 6th gen+)
- **Screen sizes:** 360px to 3840px wide; aspect ratios 16:9, 16:10, 21:9 ultrawide, 9:16 to 9:21 portrait,
  4:3 to 3:4 tablets
- **Extensions:** uBlock Origin, AdBlock Plus, AdGuard, Dark Reader, 1Password, LastPass, Bitwarden,
  Google Translate, Grammarly
- **System settings:** reduced-motion, high-contrast, prefers-reduced-data, forced-colors

### Tier 2: Graceful degradation

- Browsers 3 to 5 majors behind current
- Older mobile devices (Android 8-11, iOS 13-15)
- Less common browsers (Brave, Vivaldi, Opera, Samsung Internet, Yandex) via Chromium compatibility
- 32:9 super-ultrawide
- Slow connections

### Tier 3: Explicit non-goals (will NOT be tested or guaranteed)

- Internet Explorer
- KaiOS
- UC Browser
- Browsers older than 5 majors behind current
- Text-mode browsers
- Screen sizes below 320px wide

---

## 3. Defensive patterns shipped (Phase 25)

| Pillar | Pattern | Commit |
|---|---|---|
| Filter-list immunity | Back-to-top reads as interactive without the `aria-label` uBlock matched; accessible name preserved via `.msarib-sr-only` text | `9d9b2b7` (25.1) |
| Filter-list immunity | Full audit of 343 selectors / 18 aria-labels / ~22 ids against ~63k cosmetic-filter rules; zero new matches, no migration needed | 25.2 (audit, no code) |
| Translate hardening | `translate="no"` on identity-critical visible text (name, email, studio names, case titles, Engine/Client spec values, tag chips) | `932d979` (25.4.a) |
| Translate hardening | Layout overflow defenses for long translated text: `overflow-wrap` on `.pill-btn` / `.case-link-pill`, `hyphens` on spec values | `3825683` (25.4.b) |
| Password manager defensive | `data-bwignore` (Bitwarden) joining the existing `data-lpignore` (LastPass) + `data-1p-ignore` (1Password) + `data-form-type` on non-credential fields | `50ee668` (25.5.a) |
| Privacy extension defensive | Turnstile error/timeout email fallback so a blocked challenge does not dead-end the form; plus a real `.pill-btn:disabled` affordance | `de1782a` (25.5.b) |
| No-JS graceful degradation | `<noscript>` hides the JS-dependent contact form and surfaces an email fallback | `e764943` (25.6.a) |
| Forced Colors mode | `@media (forced-colors: active)` border on `.pill-btn` (via `ButtonText`) so buttons keep their affordance when backgrounds are stripped | `d31002c` (25.6.b) |
| Dark Reader opt-out | `<meta name="darkreader-lock">` (official mechanism); site is dark-native, so DR is fully bypassed. Added in the 2026-05-21 QA audit (`2932904`), cross-referenced in 25.3 | `f59d723` (25.3) |
| Real-device hotfix (25.7) | Hero per-line reveal: replaces the per-character inline-block split that jumbled on iOS 18 Safari after a client-side route return; animation is opt-in under `prefers-reduced-motion: no-preference` | `5837af0` (25.7.a) |
| Real-device hotfix (25.7) | About hero mobile overflow guard (`overflow-x: clip` at <=900px) for the `.about-portrait-glow` bleed that zoomed `/about` on mobile | `ed88f38` (25.7.b) |
| Real-device hotfix (25.7) | Instagram reel inline height cap: portrait/square frames bounded to <=70vh and centered via the `.msarib-gallery-portrait` modifier | `793cf5a` (25.7.c) |
| Real-device hotfix (25.7) | Nav drawer single X (removed the redundant in-drawer close button) + slide-close via delayed `visibility` transition | `4611270` (25.7.d) |
| Real-device hotfix (25.7) | Footer 44px touch targets under `@media (pointer: coarse)` (WCAG 2.5.5), fixing the Resume/RSS mistap | `e492e57` (25.7.e) |
| Real-device hotfix (25.7) | Safari card/glow cosmetics: time-boxed investigation, deferred to known limitations (Section 6) | 25.7.f (no code) |

---

## 4. Verification log

Honest distinction: "Simulated" means Playwright code-level checks or DevTools media emulation on local Linux
Chromium. "Verified" means observed on a real device with the real browser/extension/OS. Per DEC-088,
Simulated is necessary but not sufficient; real-device Verified is the closing step.

| Sub-phase | Method | Status | Date | Result |
|---|---|---|---|---|
| 25.1 back-to-top (uBlock) | Real device, Windows Edge + uBlock (Sarib) | Verified | 2026-06-18 | Pass: button visible after fix |
| 25.2 filter-list audit | Static corpus cross-reference | Complete | 2026-06-18 | Zero new matches |
| 25.3 Dark Reader lock | Code present (meta lock) | PENDING | (real device: Win Edge + Chrome, 4 DR modes) | PENDING |
| 25.4.a translate identity | Playwright prerendered-DOM check | Simulated | 2026-06-18 | Pass (attribute in output) |
| 25.4.b layout hardening | Playwright German injection (393 / 1512) | Simulated | 2026-06-18 | Pass (no overflow) |
| 25.5.a Bitwarden attribute | Static (attribute presence + vendor-doc verify) | Simulated | 2026-06-18 | PENDING real PM extensions |
| 25.5.b Turnstile fallback | Playwright route-abort | Simulated | 2026-06-18 | Pass (fallback shown) |
| 25.6.a no-JS noscript | Playwright `javaScriptEnabled: false` | Simulated | 2026-06-18 | Pass (form hidden, notice shown) |
| 25.6.b Forced Colors | Playwright `forced-colors: active` emulation | Simulated | 2026-06-18 | PENDING real Windows High Contrast |
| 25.7.a hero per-line reveal | Playwright (Chromium): no per-char DOM, route-return integrity, reduced-motion opt-in | Simulated | 2026-06-19 | Pass; real-device PENDING (iPhone XR route-return) |
| 25.7.b about overflow guard | Playwright scrollWidth + offender audit 360-430px; clip active <=900, desktop unaffected | Simulated | 2026-06-19 | Pass; DEC-088 no local repro; real-device PENDING |
| 25.7.c reel height cap | Playwright on samurai-saga + nvidia: reel <=70vh centered; landscape + no-reel studies unchanged | Simulated | 2026-06-19 | Pass; real-device PENDING |
| 25.7.d nav drawer | Playwright 393px: single X, slide-close visibility timing, focus trap, ESC / backdrop, scroll-lock | Simulated | 2026-06-19 | Pass; real-device PENDING |
| 25.7.e footer touch targets | Playwright coarse-pointer context (393 + 1000): >=44px targets, no Resume/RSS overlap; fine-pointer unchanged | Simulated | 2026-06-19 | Pass; real-device PENDING |

---

## 5. Device test matrix

Device inventory from DEC-074. Each cell is unchecked until verified on the real device; datestamp on
verification. Run the full matrix as one ~2 hour session.

### Windows Desktop (Chrome / Edge / Firefox)

- [ ] 25.1 back-to-top visible with uBlock active (Edge)
- [ ] 25.3 Dark Reader all 4 modes, site renders as authored, no blank page (Edge + Chrome)
- [ ] 25.6.b Forced Colors / High Contrast: pill buttons keep borders, focus rings visible
- [ ] 25.5.a password managers (1Password / LastPass / Bitwarden): no prompts on company/message; name/email fillable
- [ ] 25.4 Google Translate to German: proper nouns hold, no layout overflow
- [ ] Firefox: backdrop-filter `@supports` fallbacks render cleanly

### HP G4 laptop (Chrome, low-spec)

- [ ] General layout + performance sanity pass
- [ ] Showreel video plays / poster fallback acceptable on low-spec

### Pixel 8 Pro (Android Chrome)

- [ ] 25.1 back-to-top sizing (24.1 Android fix)
- [ ] General responsive layout, 360px+ widths
- [ ] German translate spot-check
- [ ] 25.7.b `/about` loads unzoomed (no pinch-to-zoom-out)
- [ ] 25.7.c Instagram reel gallery item is capped/centered (not towering)
- [ ] 25.7.d nav drawer shows a single X and slides closed (no snap)
- [ ] 25.7.e footer "Resume (PDF)" tap opens the resume, not the RSS feed

### iPhone X (iOS 18 Safari): covers iPhone XR (iOS 18.7), the device Sarib tested

- [ ] safe-area insets (nav, back-to-top) correct on notched device
- [ ] dvh viewport units, no 100vh jump
- [ ] sticky nav + back-to-top behavior
- [ ] home / contact / case study render pass
- [ ] 25.7.a hero headline renders two clean lines after S-logo return (no per-character jumble)
- [ ] 25.7.b `/about` loads unzoomed (no pinch-to-zoom-out)
- [ ] 25.7.c Instagram reel gallery item is capped/centered (not towering)
- [ ] 25.7.d nav drawer shows a single X and slides closed (no snap)
- [ ] 25.7.e footer "Resume (PDF)" tap opens the resume, not the RSS feed

### iPhone 14 Plus (iOS 26 Safari)

- [ ] Same iOS Safari checks as iPhone X on a newer OS
- [ ] Contact form + Turnstile on mobile Safari
- [ ] 25.7.a hero headline renders two clean lines after S-logo return (no per-character jumble)
- [ ] 25.7.b `/about` loads unzoomed (no pinch-to-zoom-out)
- [ ] 25.7.c Instagram reel gallery item is capped/centered (not towering)
- [ ] 25.7.d nav drawer shows a single X and slides closed (no snap)
- [ ] 25.7.e footer touch targets comfortable (no adjacent-link mistap)

### MacBook Pro M1 (macOS Safari)

- [ ] General desktop Safari pass (layout, fonts, video)
- [ ] reduced-motion honored (System Settings)
- [ ] 25.7.f documented cosmetics (expertise-card corners on hover, WIB top-border on hover, gradient/glow edge): confirm acceptable, no regression. No fix expected (see Section 6)

---

## 6. Known limitations

### Failure handling protocol

When real-device testing reveals a regression, handle by severity:

- **Critical** (page unrenderable, form unsubmittable, content inaccessible): pause RESILIENCE.md updates,
  ship a hotfix sub-phase (e.g., 25.7.x) to address the breakage, then resume verification updates after the
  fix lands.
- **Minor cosmetic** (slight layout shift, non-blocking visual quirk): document in this section's "Known
  limitations" entries below with the affected configuration. Ship the verification update with the
  limitation recorded.
- **Browser-specific in Tier 2/3 only** (Tier 1 unaffected): document in known limitations. No fix required,
  since Tier 2/3 is graceful degradation by design, not full support.

This protocol applies to all real-device test cycles, not just Phase 25.

### Limitations

- **prefers-reduced-data: deferred.** Poor browser support (Chrome data-saver only; Firefox and Safari do
  not ship it). Revisit when support broadens. See DEFERRED_FIXES.md.
- **prefers-contrast: more: deferred.** Forced Colors already covers the strongest high-contrast case;
  this would be marginal. See DEFERRED_FIXES.md.
- **Dark Reader is fully bypassed by design.** The site is dark-native, so the DR lock preserves the
  authored design. Users who rely on bespoke DR contrast/hue settings (light sensitivity, migraine) get the
  site as authored; the alternative is OS or browser accessibility settings. Native contrast is
  WCAG-compliant.
- **Tier 3 configurations are explicit non-goals:** Internet Explorer, KaiOS, UC Browser, browsers more
  than 5 majors behind, text-mode browsers, and screens below 320px wide are not tested or guaranteed.

#### Safari cosmetics (Phase 25.7.f, investigated and deferred)

- **Expertise card rounded corners flatten on hover (Safari only).** `.exp-card` (`overflow: hidden` +
  `border-radius`) with a child `.exp-img` `transform: scale(1.06)` hits Safari's clip-during-child-transform
  bug. The 25.7.f time-boxed investigation found a single-rule candidate (`transform: translateZ(0)` on
  `.exp-card` to force a compositing layer), but it is not shipped: it cannot be verified without a real iOS
  and macOS Safari, and it risks a `mix-blend-mode` regression on `.exp-tint`. Future real-device experiment:
  apply the `translateZ(0)` candidate, confirm the corners clip AND the `.exp-tint` color blend is unchanged
  on both Safari engines; ship in a future polish phase only if both hold.
- **WIB card top border crops on hover (Safari only).** `.wib-card` (`backdrop-filter: blur(20px)` + `border`
  + `border-radius`) with hover `transform: translateY(-4px)` causes Safari to mis-repaint the top border
  edge. 25.7.f: no clean single-rule fix (the element is already layer-promoted by `backdrop-filter`;
  remedies are multi-property hacks or change non-Safari rendering). Deferred.
- **Gradient / showreel-glow edge cutoff (macOS Safari, Retina).** Large `filter: blur` (80-100px) +
  `mask-image` + `overflow` on `.atm-wrapper` and `.showreel-glow-canvas` show a hard edge where the blur
  kernel meets the mask boundary. 25.7.f: subtle, not screenshot-capturable, no local verification path, and
  remedies are finicky and ratio-sensitive. Deferred.

#### Performance and platform realities (Phase 25.7 real-device pass)

- **iPhone XR (A12, 3GB) general slowness on this animation-heavy site.** Older-hardware platform reality,
  not a fix candidate.
- **"Site feels laggy after sustained use" across browsers.** Needs profiling; deferred to a future
  investigation phase. Working hypothesis (from the 25.7 diagnostic pass): cumulative cost of multiple
  always-running `requestAnimationFrame` loops (Cursor, ShowreelGlow canvas, Nav scroll) plus
  `content-visibility` re-render on scroll plus the always-on atmospheric-gradient animations.
- **Showreel autoplay requires a user gesture on iOS.** iOS power / autoplay policy; degrades gracefully
  (poster + play button). Not a bug.
- **Resume PDF 404.** Managed separately by Sarib; resolves when the new resume ships.
- **Console preload-not-used warnings.** Cosmetic dev-tools output, not user-facing.
- **Edge tracking-prevention console messages.** Edge-specific behavior, not breakage.
- **CSP report-only warnings.** Expected until the end-of-arc CSP enforcement flip.

- _(Real-device findings appended here as the matrix in section 5 is completed.)_

---

## 7. Methodology

- **Playwright (local Linux Chromium):** code-level verification. DOM presence, computed styles, interaction
  simulation (form submit, blocked-request routing, keyboard focus). Fast, deterministic, runs every
  sub-phase.
- **DevTools / Playwright media emulation:** for media-query-gated behavior (`forced-colors: active`,
  `prefers-reduced-motion`, `prefers-reduced-data`). Approximates the feature but is not identical to the
  real OS mode.
- **Real-device testing (Sarib's domain):** the load-bearing step for anything visual, UX, extension, or
  OS-specific. Covers the DEC-074 device inventory.
- **The DEC-088 rule:** a green Playwright run is necessary but not sufficient. Linux Playwright Chromium
  masks Windows-specific bugs, browser-extension behavior, and real mobile rendering. No resilience
  sub-phase is considered fully closed on a simulation alone if a real-device path exists.
- **Update cadence:** real-device tests refreshed at each major phase milestone, and whenever a change
  touches an interactive flow, an extension-facing surface, or a media-query-gated style.

---

## 8. Last verified

- **Document scaffolded:** 2026-06-19, at commit `d31002c` (Phase 25.6.b).
- **Real-device hotfix arc (25.7.a-e):** shipped 2026-06-19 (`5837af0`, `ed88f38`, `793cf5a`, `4611270`,
  `e492e57`). 25.7.f investigated and deferred to Section 6.
- **Real-device matrix (section 5):** Playwright-simulated 2026-06-19; real-device verification PENDING
  (Sarib's session within 24 hours of this commit). Datestamps land per-cell as the session completes; a
  follow-up living-document maintenance commit flips the Section 4 status to Verified.
- **Last verified:** 2026-06-19 (simulated). Phase 25.7 closed procedurally at the 25.7.g doc commit.
