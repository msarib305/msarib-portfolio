# Changelog

Timestamped log of every meaningful change to msarib-portfolio. Newest entries at the top.

## 2026-06-09
### feat(motion): Phase 19.5 hero char reveal, portrait blur glow, site-wide cursor
- src/components/Hero.tsx: heading animation upgraded from word-level to character-level
  mask reveal. Each character slides up through an overflow:hidden word-wrapper span
  (true mask, not clip-path). 10ms stagger per character, 400ms per character,
  var(--ease-out) easing. Total heading animation: ~860ms. Issue #1.
- src/components/Hero.tsx: subheading replaced from word-by-word (35+ word spans) to
  a single block fade-up animation (hero-block-fade, 600ms, 450ms delay). SUBHEAD_WORDS
  constant and word-split map removed. Issue #1.
- src/app/globals.css: word-reveal keyframe and .hero-subhead-word class removed.
  New keyframes: hero-char-up (translateY 110% to 0) and hero-block-fade (opacity + Y16px).
  New class: .hero-char. .hero-headline-word updated to mask wrapper (overflow:hidden,
  vertical-align:bottom). .hero-subhead gets animation declaration.
- src/components/AboutHero.tsx: portrait wrapped in .about-portrait-outer div. Duplicate
  <img> with .about-portrait-glow class added as absolutely positioned sibling behind the
  portrait. Cloudinary source at w_200,q_auto:low (~3-5 KB). Issue #14.
- src/app/globals.css: .about-portrait-outer (position:relative) and .about-portrait-glow
  (position:absolute, inset:-10%, filter:blur(80px) saturate(1.4), opacity:0.7) added.
  .about-portrait gains z-index:1. @media print hides .about-portrait-glow. Issue #14.
- src/components/CursorMount.tsx: new thin client component. Uses usePathname() to
  exclude /keystatic routes; renders <Cursor /> on all portfolio pages. Issue #15.
- src/app/layout.tsx: <CursorMount /> added as first child of <body>. Issue #15.
- src/app/page.tsx: cursor dynamic() import and <Cursor /> render removed. Issue #15.
- docs/DECISIONS.md: DEC-078 added (cursor mount strategy: root layout + CursorMount
  vs route groups; route groups rejected due to restructuring cost).

## 2026-06-09
### feat(ui): Phase 19.4 component consistency for badges, cards, and credits
- src/components/AboutPillars.tsx: replaced flat mono-font .t-pill badges with PillBadge
  component (grad-1/grad-2/grad-3 tones), matching the 3D gradient pill style used on the
  home "What I bring" section. Removed tint field from Pillar type; tone field used
  directly. t1/t2/t3 tint classes removed from article elements. Issue #11.
- src/components/TimelineEntry.tsx: confirmed already uses PillBadge tone="grad-1" for the
  Current badge on the About Experience timeline. No code change needed. Issue #12.
- src/app/globals.css: .t-card now has position: relative, z-index: 1, and identical
  hover behavior to .wib-card (background, border-color, translateY(-4px), same transition
  timings). prefers-reduced-motion disables the transform. Issue #13.
- src/app/globals.css: .t-pill, .t-card.t1/.t2/.t3 .t-pill rules removed (now dead after
  PillBadge swap). .t-card.t1 .t-pill rule removed from @supports not (color-mix) fallback
  block; .exp-row.current fallback in same block is preserved.
- content/projects/*/index.mdoc: credits sections restructured across 6 case studies.
  Anime-stylized-action-tgs2024 (5), character-creator-system (2), tresemme-tresverse (4),
  exarta-metaverse (2), nvidia-ai-assistant (1), exarta-uefn-portfolio (5 across 3 sections).
  Each credit entry now renders as 3 lines: bold name and role on line 1, contribution on
  line 2, "Check out their LinkedIn" link on line 3. Backslash hard line breaks (CommonMark
  spec 6.12) used to produce the visual layout within the single list item paragraph.
  Parentheses removed from role text. Issue #8.
- src/app/globals.css: ul.case-list .case-list-item p a rule added: credits LinkedIn links
  colored in var(--color-accent) teal. Scoped to ul (unordered) only; ol.case-list "What I
  built" sections remain unaffected.

## 2026-06-09
### fix(gradient): Phase 19.3.1 atmospheric blob sizing tuned to UE reference
- src/components/AtmosphericGradient.tsx: circle radii reduced from 340-180 range to
  110-60 range. Each circle is now 5-9% of viewBox width, matching UE reference proportion
  (4-6.5%). Previous sizing (15-28% of viewBox width) produced discrete identifiable blobs
  rather than an atmospheric wash; the blur could not fully dissolve circles that large.
- Circle opacities increased from 0.35-0.12 to 0.40-0.18 to compensate: smaller circles
  need higher opacity to register as glow through the blur rather than disappear.
- Circle positions shifted by 10-40 units (cx/cy) for better distribution at smaller scale.
- All other Phase 19.3 properties unchanged: blur, mask, keyframes, card backdrop-filter,
  prefers-reduced-motion, integration in WhatIBring and AboutPillars.

## 2026-06-09
### feat(gradient): Phase 19.3 atmospheric SVG color-wash replaces radial-gradient blobs
- src/components/AtmosphericGradient.tsx: new Server Component; 5 teal SVG circles with
  staggered CSS keyframe animations (20s/25s/30s/35s/28s), filter: blur(100px) on the SVG
  for atmospheric diffusion, vertical mask-image on the wrapper for edge fades
- src/components/WhatIBring.tsx: removed old .wib-bg block, added AtmosphericGradient
- src/components/AboutPillars.tsx: removed old .three-card-bg block, added AtmosphericGradient
- globals.css: removed .wib-bg, .wib-bg::before/after, .wib-blob3 rules
- globals.css: removed .three-card-bg, .three-card-bg .blob3 rules
- globals.css: removed @keyframes wib-drift1/2/3 and about-blob-drift
- globals.css: added .atm-wrapper, .atm-blobs, .atm-b1 through .atm-b5 rules
- globals.css: added @keyframes atm-drift1 through atm-drift5
- globals.css: added prefers-reduced-motion block stopping blob animations (static wash remains)
- globals.css: responsive blur reductions: 60px at 900px, 40px + 2 circles hidden at 600px
- globals.css: .wib-card and .t-card gain backdrop-filter: blur(20px) for frosted-glass
  treatment above the wash; @supports fallback raises background opacity to 0.09
- globals.css: print styles updated (.atm-wrapper replaces .wib-bg/.three-card-bg in hide list)
- docs/DECISIONS.md: DEC-077 appended documenting the atmospheric SVG technique and the
  backdrop-filter stacking context constraint discovered during implementation
- Note: backdrop-filter on a sibling div was tried first (per UE reference pattern) but
  fails in this stacking context structure; filter: blur() on the SVG is the correct fix

## 2026-06-08
### fix(css): Phase 19.2 footer brand hierarchy, case-links padding, gradient edge fades
- Footer.tsx: .footer-brand wrapper added; SLogo and LahoreClock now stack vertically
- globals.css: .footer-brand CSS rules give three-line brand hierarchy ([S] SARIB / role / clock)
- globals.css: .case-links gains max-width + margin-inline:auto + padding-inline:32px,
  matching .case-media container bounds; mobile breakpoint at 600px uses padding-inline:20px
- globals.css: .exp-row.current ellipse widened from 70% to 120%, eliminating hard gradient
  edge cutoff on the About Experience current-role row
- globals.css: @supports not (color-mix) fallback for .exp-row.current updated to match
- globals.css: .expertise-section gains horizontal mask-image (transparent 0%, #000 3%,
  #000 97%, transparent 100%) to soften box-shadow glow clipping on edge expertise cards
- docs/DECISIONS.md: DEC-076 appended (investigation notes: two different fix mechanisms
  for gradient/glow edge cutoff documented for future reference)

## 2026-06-08
### fix(content): Phase 19.1 experience corrections, Convai removal, BuiltWith investigation
- src/data/experience.ts: Vmmersion role corrected to "Lead Software Developer"
- src/data/experience.ts: Exarta Senior location corrected to "Lahore (on-site)"
- src/data/experience.ts: Exarta First location corrected to "Lahore (on-site)"
- PROFESSIONAL_HISTORY.md: stale root and docs/ copies deleted; new authoritative version
  placed at docs/PROFESSIONAL_HISTORY.md (gitignored per Sarib's decision)
- content/projects/convai-npc-integration/: deleted (incomplete assets, no images or video)
- _staging-content/projects/convai-npc-integration.mdx: deleted
- tests/e2e/sitemap.spec.ts, cases.spec.ts, smoke.spec.ts: Convai slug entries removed
- /work now shows 8 case studies; sitemap regenerates automatically
- docs/EXTERNAL_TOOL_FALSE_POSITIVES.md: new file; BuiltWith GitHub detection (resolved)
  and German Commercial Register Number (false positive) documented
- docs/DECISIONS.md: DEC-075 appended
- README.md: phased-rewrite notice added at top; all em-dashes corrected (6 total)

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

## 2026-06-06 PKT
### chore(launch): Phase 18 - production cutover verification and v1.0.0 launch

**Summary:** Pre-launch checklist walked end-to-end. Recruiter simulation clean. Resend dashboard verified. Google Search Console set up. Lighthouse production scores confirmed. OG previews verified. CSP sweep clean (zero violations, enforcement deferred per DEC-071). Resume download filename fixed. v1.0.0 tag marks launch state.

- pnpm typecheck: pass
- pnpm lint: N/A this phase
- pnpm build: N/A this phase (production deployment unchanged)
- Vercel preview: N/A this phase
- Playwright: console sweep across 7 routes, 404 page screenshot, sitemap and robots.txt verification
- Manual visual check: confirmed by Sarib (recruiter simulation, real device partial, contact form Tier 1 delivery, OG previews, Resend dashboard, Google Search Console)

**Lighthouse production scores (Phase 18 baseline):**

| Route | Mobile perf | Desktop perf | Mobile LCP | Mobile CLS |
|-------|-------------|--------------|------------|------------|
| / | 98 | 100 | 2292ms | 0.000 |
| /work | 93 | 100 | 3161ms | 0.000 |
| /about | 85 | 100 | 4449ms | 0.000 |
| /writings | 98 | 100 | 2406ms | 0.000 |
| /contact | 100 | 100 | 1601ms | 0.000 |
| /projects/anime-stylized-action-tgs2024 | 100 | 100 | 1900ms | 0.000 |

All accessibility 98-100. All SEO 100. All best-practices 96. CLS zero on every route.
/about mobile at 85 (LCP bottleneck is portrait placeholder; target >= 90 when real portrait ships).
Home mobile 98 — showreel video bandwidth concern from Phase 14 Future Work is not a live issue.

**Changes:**

Code:
- `src/components/PillButton.tsx`: added `download?: string` prop, forwarded to `<Link>`.
- `src/components/Footer.tsx`: `download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf"` on resume link.
- `src/components/ContactCTA.tsx`: same `download` attribute on resume PillButton.
- `src/components/Timeline.tsx`: same `download` attribute on resume PillButton.

Documentation:
- `docs/PRE_LAUNCH_CHECKLIST.md`: all items ticked or marked [DEFERRED] with reasons.
- `docs/DECISIONS.md`: DEC-071 (CSP deferral), DEC-072 (resume PDF retained), DEC-073 (v1.0.0 tag), DEC-074 (device matrix deferred).
- `docs/DNS_CONFIGURATION.md`: Google Search Console TXT record added under Ownership verification.
- `docs/CSP_VIOLATION_LOG.md`: new file. Zero violations found. Flip checklist documented.
- `docs/OG_PREVIEW_MATRIX.md`: new file. LinkedIn results for 3 URLs documented.
- `docs/RESUME_FOLLOWUP.md`: new file. 5 pending manual checks, download filename fix noted as resolved.

Infrastructure (Cloudflare/Vercel, no code):
- Google Search Console: Domain Property verified via DNS TXT, sitemap submitted, 14 pages discovered.

Deferred (not blocking v1.0.0):
- CSP flip to enforcing: post real videos and Phase 19. See DEC-071.
- Full 8-device matrix testing: post-Phase 19. See DEC-074.
- Resume body text manual checks: 5 items in docs/RESUME_FOLLOWUP.md.
- /about LCP improvement: blocked on real portrait asset.
- OG preview matrix completion: Twitter/X, Slack, WhatsApp, Discord pending Sarib manual check.

---

## 2026-06-06 15:55 PKT
### chore(dns): Phase 17 - DNSSEC, CAA, email routing, SPF/DKIM/DMARC, DNS documentation

**Summary:** DNS infrastructure locked down before public launch. All work is configuration and documentation; no production code changes.

- pnpm typecheck: N/A this phase
- pnpm lint: N/A this phase
- pnpm build: N/A this phase
- Vercel preview: N/A this phase
- Playwright: N/A this phase
- Manual visual check: N/A this phase

**Changes:**

DNS records (all changes in Cloudflare dashboard):
- DNSSEC: DS record (Key Tag 2371, Algorithm 13 ECDSA/SHA-256) submitted to Namecheap. Full chain verified root → .dev TLD → msarib.dev via Verisign DNSSEC Debugger. Cloudflare signing was already active; only the DS record at Namecheap was missing.
- CAA records: 3 manual entries added (issue letsencrypt.org, issuewild blocked, iodef contact@msarib.dev). Cloudflare free plan auto-injects 9 additional CAA entries for 5 Tier-1 CAs. Accepted as-is (ACM add-on required to restrict further).
- MX records: Cloudflare Email Routing enabled. 3 MX entries auto-added (route1/2/3.mx.cloudflare.net). Inbound routing rules forward hello@, contact@, and catch-all @msarib.dev to msarib.contact@gmail.com. Both test emails confirmed delivered.
- SPF (root): v=spf1 include:_spf.mx.cloudflare.net ~all auto-added by Cloudflare Email Routing. No merge required with Resend's SPF (which is scoped to send.msarib.dev, not root).
- DMARC: existing bare record (v=DMARC1; p=none;) edited to add rua=mailto:contact@msarib.dev; aspf=r; adkim=r. Aggregate reports now route to Gmail.

Vercel domain configuration:
- msarib.dev: confirmed Production primary (main branch), SSL active.
- www.msarib.dev: changed from co-primary to 308 redirect to apex. Canonical is now msarib.dev, aligning with Phase 13 JSON-LD, sitemap, and OG metadata.

Recipient-side:
- Gmail filter on msarib.contact@gmail.com whitelists *@msarib.dev forwarded mail to bypass spam heuristics.

Documentation committed:
- docs/DNS_CONFIGURATION.md: new file, full DNS state, verification commands, change procedure.
- docs/DECISIONS.md: DEC-066 (DNSSEC), DEC-067 (CAA), DEC-068 (Email Routing), DEC-069 (DMARC p=none), DEC-070 (DNS_CONFIGURATION.md as source of truth).

---

## 2026-06-06 PKT
### feat(prod): Phase 16 — production hardening before public launch

**Summary:** Security headers, error pages, contact form failure modes, robots/sitemap fortification, bundle baseline, pre-launch checklist, README rewrite.

**Changes:**

- `next.config.ts`: Security headers added to all routes via `headers()`. Six headers: `Content-Security-Policy-Report-Only` (shipped report-only per DEC-060 — flip key to `Content-Security-Policy` after one week of clean violation logs), `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, interest-cohort all disabled).
- `src/app/not-found.tsx`: Custom 404 page with site fonts and palette. Title separator corrected to middle dot per Phase 13 brand convention.
- `src/app/error.tsx`: Custom error boundary page (segment-level). Logs to console, offers Try again + Back to home.
- `src/app/global-error.tsx`: Custom root-level error boundary. Imports `globals.css` directly (bypasses root layout). Logs to console, offers Reload.
- `src/app/globals.css`: Added `.error-page*` CSS classes and `.form-warning-banner` style.
- `src/components/ContactForm.tsx`: Added offline detection (`navigator.onLine`), Turnstile readiness guard, and 30-second timeout warning banner with `contact@msarib.dev` fallback mailto link.
- `src/components/TurnstileWidget.tsx`: Extended to accept `onSuccess`, `onError`, `onExpire` callbacks.
- `src/app/robots.ts`: Added `/_next/` and `/og` to disallow list.
- `src/app/sitemap.ts`: Static route `lastModified` pinned to `2025-04-01` (was `new Date()` — regenerated stale on every build). Project routes include `images` array for Google Image indexing. Writings `changeFrequency` corrected from `weekly` to `monthly`.
- `docs/BUNDLE_BASELINE.md`: Bundle size baseline committed. See file for details. Total `.next/static/chunks/`: 3.6 MB uncompressed; largest chunk 2.7 MB (shared React/Motion/Lenis).
- `docs/PRE_LAUNCH_CHECKLIST.md`: 10-item checklist with Markdown checkboxes. Covers DNS, env vars, security headers, 404, contact form, sitemap, robots, OG image, Lighthouse, CSP monitoring.
- `README.md`: Rewritten with full stack, dev setup, content management, testing commands, deployment, and docs table.
- `docs/DECISIONS.md`: DEC-060 through DEC-065 appended.

**Vercel env audit status:** Vercel CLI not linked locally (no `.vercel/project.json`). Audit must be done via Vercel dashboard or after running `vercel link`. See `docs/PRE_LAUNCH_CHECKLIST.md` env var table.

**CSP scheduled enforcement:** After one week of monitoring violation reports on the live site, change `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.ts`.

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push
- Playwright: full suite pending (run before final commit approval)
- Manual visual check: pending

---

## 2026-06-05 PKT
### perf(images): Phase 14 — next-cloudinary, bundle audit, Lighthouse baseline, font cache headers

**Summary:** Performance pass targeting Lighthouse 90+ on all four axes (Performance, Accessibility, Best Practices, SEO) across Mobile and Desktop on six primary routes.

**New files:**
- `src/lib/cloudinary.ts` — `cloudinaryPublicId(url)` utility. Strips extension, version segment, transformation segments, preserves folder paths. 8/8 edge-case tests pass.
- `src/components/CldImageClient.tsx` — `'use client'` re-export of `CldImage`. Required because next-cloudinary ships without a client directive but uses hooks internally.
- `scripts/lighthouse.mjs` — Headless Lighthouse runner. Iterates 6 routes (Desktop + Mobile), writes JSON reports to `lighthouse-reports/`, prints a colour-coded score table. Uses Playwright's bundled Chromium. `pnpm lighthouse` or `node scripts/lighthouse.mjs [baseUrl]`.

**Modified files:**
- `src/components/WorkCard.tsx` — `next/image` → `CldImage`. f_auto + q_auto applied by default. `priority` and `fetchPriority` forwarded.
- `src/components/CaseStudyCover.tsx` — image branch: `next/image` → `CldImage`.
- `src/components/CaseStudyGallery.tsx` — image items: `next/image` → `CldImage`.
- `src/app/layout.tsx` — Added `dns-prefetch` for `img.youtube.com` and `www.youtube-nocookie.com`.
- `next.config.ts` — `@next/bundle-analyzer` wrapper (gated by `ANALYZE=true`). `qualities` reduced from `[70, 75]` to `[75]`. Added `headers()` setting 1-year cache on `/fonts/:path*`.
- `package.json` — Added `"lighthouse"` script. Added `next-cloudinary@6.17.5` dependency. Added `@next/bundle-analyzer` dev dependency.
- `.gitignore` — Added `lighthouse-report/` entry.
- `.env.example` — Added `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` placeholder.

**Packages added:** `next-cloudinary@6.17.5`, `@next/bundle-analyzer` (dev)

**Lighthouse scores — before and after (local, production server `pnpm build && pnpm start`)**

| Route | Profile | Before | After | Delta |
|---|---|---|---|---|
| `/` | Mobile | 82 | ~81 | 0 (noise) |
| `/` | Desktop | 98 | 99 | +1 |
| `/work` | Mobile | 90 | 81-86 | see note |
| `/work` | Desktop | 99 | 100 | +1 |
| `/about` | Mobile | 89 | 90 | +1 |
| `/about` | Desktop | 100 | 100 | 0 |
| `/writings` | Mobile | 89 | 93 | +4 |
| `/writings` | Desktop | 100 | 100 | 0 |
| `/contact` | Mobile | 88 | 96 | +8 |
| `/contact` | Desktop | 100 | 100 | 0 |
| `/projects/anime-...` | Mobile | 91 | **100** | +9 |
| `/projects/anime-...` | Desktop | 100 | **100** | 0 |

All Accessibility, Best Practices, SEO: 96-100 on all routes and profiles.

**Bundle audit findings**

Conducted via Turbopack build manifest (webpack mode blocked by React Compiler incompatibility — see DEC-057).

| | Size |
|---|---|
| Public route JS total (uncompressed) | 446 KB |
| Public route JS estimated gzipped | ~130 KB |
| Largest non-public chunk | 2.7 MB (Keystatic admin: `markdown-it`, `entities`) |

No server-only code found in the client bundle. No duplicate dependencies. The 2.7 MB Keystatic chunk is not loaded on any public route.

**Known issue: home page showreel bandwidth on slow connections**

The home page mobile Performance score was 82 before Phase 14 and is ~80-82 after. This is not a Phase 14 regression. Root cause: the showreel video (`portfolio-showreel`, H.264, w=960) downloads 3.2 MB during page load because `preload="metadata"` is ignored by Chrome when `autoPlay` is also set on the video element. At Lighthouse's simulated Slow 4G (1.6 Mbps), this saturates bandwidth and delays all other resources including the LCP image. The issue is unchanged by the CldImage migration.

Mitigation deferred. Options: Cloudinary `f_auto` on the video source (WebM/AV1 smaller derivatives), poster-first-then-video-on-idle pattern, reduced source video bitrate.

**Note on `/work` local score variability**

Local Lighthouse shows 81-86 for `/work` mobile (high variance). This is an artifact of CldImage making direct Cloudinary CDN requests instead of the `next/image` local proxy used in baseline. Under Lighthouse Slow 4G simulation, the WSL2 → internet → Cloudinary path adds real-world latency on top of the simulated throttling. The baseline 90 was architecturally privileged by serving from localhost disk. Production scores expected to be 90+ (Cloudinary edge CDN co-located with users). Authoritative scores from `node scripts/lighthouse.mjs https://msarib.dev` after deployment.

**Build status:**
- `pnpm typecheck`: pass
- `pnpm lint`: pass
- `pnpm build`: pass
- Vercel preview: pending

**Env var required (add to Vercel dashboard before next deploy):**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddgwzcrim` (Production + Preview environments)

---

## 2026-05-20 PKT
### feat(contact): Phase 12 — contact form, Resend email, Cloudflare Turnstile

**New routes:** `/contact` (full contact page replacing Phase 8 placeholder)

**New files:**
- `src/app/contact/actions.ts` — Server Action: Zod validation, rate-limit check, Turnstile verify, Resend send, record on success
- `src/lib/contact-schema.ts` — Zod v3 schema and `ContactFormState` type
- `src/lib/email.ts` — Resend wrapper, dark-themed HTML email, `escapeHtml` helper
- `src/lib/rate-limit.ts` — In-memory IP rate limiter. Soft signal: catches casual repeats; resets on cold start. Hard prevention from Turnstile + Resend dashboard monitoring.
- `src/components/ContactForm.tsx` — Client Component, `useActionState`, field errors via `aria-describedby`, Turnstile reset on token failure
- `src/components/ContactInfo.tsx` — Sidebar: LinkedIn, YouTube, Upwork, Fiverr (confirmed URLs)
- `src/components/ContactSuccess.tsx` — Personalised success state with submitter's name
- `src/components/TurnstileWidget.tsx` — Cloudflare Turnstile, dark theme, `refreshExpired: 'auto'`, `forwardRef` for reset

**Modified files:**
- `src/app/contact/page.tsx` — Rewritten from PlaceholderPage to Server Component with hero, form, sidebar
- `src/app/globals.css` — Added `--color-error: #ff4545` token; appended contact CSS block
- `.env.example` — Added 5 env var placeholders for Resend and Turnstile
- `docs/DECISIONS.md` — DEC-049 through DEC-053

**Packages added:** `resend@^6`, `zod@^3`, `@marsidev/react-turnstile@^1`

**Key corrections applied during implementation:**
1. FormData values coerced to strings before Zod parse (user-facing error messages fire correctly)
2. Rate limit records only on successful email delivery (no lockout after service failures)
3. Turnstile widget resets via ref after server-side token rejection
4. Dark theme enforced on Turnstile widget
5. PillButton already supported button mode — no extension needed
6. Resend v6 confirmed: `replyTo` camelCase, `from` display-name format, `to` array, `error.message` path

**Env vars required (add to Vercel dashboard):**
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass (/contact static)
- Vercel preview: pending (requires env vars)
- Playwright: N/A this phase
- Manual visual check: pending

---

## 2026-05-20 PKT
### feat(writings): Phase 11 — writings collection, index, post template, RSS feed

**New routes:** `/writings` (index, empty state), `/writings/[slug]` (per-post template), `/feed.xml` (RSS 2.0 route handler)

**New files:**
- `keystatic.config.ts` — `writings` collection added alongside `projects`
- `src/data/writings.ts` — `WritingItem` interface, async helpers, inline reading time (Markdoc AST walk)
- `src/components/WritingCard.tsx` — index card, `.write-card` + `.is-featured` layouts
- `src/components/WritingMeta.tsx` — date, read time, tags row in mono font
- `src/components/WritingsEmpty.tsx` — empty state with RSS pill CTA
- `src/components/WritingNav.tsx` — prev/next post navigation
- `src/components/WritingBody.tsx` — Markdoc pipeline, `.post-body` wrapper, fence + blockquote overrides
- `src/app/writings/page.tsx` — replaces Phase 8 PlaceholderPage
- `src/app/writings/[slug]/page.tsx` — per-post route, `dynamicParams = false`
- `src/app/feed.xml/route.ts` — RSS 2.0 with CDATA and XML escaping

**Architecture:** Decision A (fields.markdoc, same as projects). Server Component rendering throughout (no `'use client'`). Only `status === 'published'` writings are publicly routable. DEC-044 through DEC-048 added.

- pnpm typecheck: pass
- pnpm lint: pending
- pnpm build: pass
- Vercel preview: pending
- Playwright: N/A this phase
- Manual visual check: pending

---

## 2026-05-20 PKT
### feat(cms): Keystatic Phase 10 — projects migrated to MDX content files

**Packages added:** `@keystatic/core@0.5.50`, `@keystatic/next@5.0.4`, `@markdoc/markdoc@0.5.7`

**New files:**
- `keystatic.config.ts` — collection schema with all ProjectItem fields; `fields.slug` for title, `fields.markdoc` for body, `block()` Figure component
- `content/projects/samurai-saga/index.mdoc`
- `content/projects/nvidia-ai-assistant/index.mdoc`
- `content/projects/character-creator/index.mdoc`
- `content/projects/tresemme-metaverse/index.mdoc`
- `src/app/keystatic/keystatic.ts` — Keystatic admin page (Client Component)
- `src/app/keystatic/layout.tsx` — admin layout
- `src/app/keystatic/[[...params]]/page.tsx` — admin page slot
- `src/app/api/keystatic/[...params]/route.ts` — API route handler
- `.env.example` — documents local vs. GitHub mode vars

**Modified files:**
- `src/data/projects.ts` — rewritten to `createReader`; async exports (`getProjects`, `getFeaturedProjects`, `findProjectBySlug`, `getProjectNav`); `ProjectBodyBlock` type removed
- `src/components/ProjectBody.tsx` — rewritten to Markdoc rendering; custom list/figure renderers; `.case-body` wrapper
- `src/components/FeaturedWork.tsx` — async Server Component, awaits `getFeaturedProjects()`
- `src/components/WorkIndex.tsx` — async Server Component, awaits `getProjects()`
- `src/app/projects/[slug]/page.tsx` — async data with `Promise.all`, async `generateStaticParams`
- `src/components/CaseStudyHeader.tsx` — tags prop widened to `readonly string[]`
- `src/app/globals.css` — added `.case-body` layout and typography block

**Rollback:** `git revert HEAD && git push origin main`

---

## 2026-05-20 PKT
### feat(about): hero, narrative, pillars, timeline, skills, CTA

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/data/experience.ts`: new file. ExperienceItem interface (slug, years, role,
  company, location, summary, bullets, tags, current). Six entries newest-first:
  SwiftNine (current), Vmmersion, Exarta Senior, Ideofuzion, Exarta first, HashTech.
  Dates confirmed against PROFESSIONAL_HISTORY.md by Sarib.
- `src/data/skills.ts`: new file. SkillCategoryItem interface (slug, label, items).
  Four categories verbatim from v15: Engines & Languages, Systems & Frameworks,
  Platforms & Tools, Practice.
- `src/components/AboutHero.tsx`: new. Server Component. Two-column hero with eyebrow,
  h1 "Lead UE5 developer from Lahore.", lede, stats (07/10/06), CSS-only portrait
  placeholder with .pwm text overlay.
- `src/components/AboutNarrative.tsx`: new. Server Component. h2 "The short version."
  plus four paragraphs verbatim from v15. Bold lead-ins on paragraphs 2 through 4.
- `src/components/AboutPillars.tsx`: new. Server Component. Three engineering pillar
  cards with module-level PILLARS constant. .three-card/.three-grid/.t-card layout
  from v15. Blob reuses wib-drift1 keyframe. t1 card has teal .t-pill chip.
- `src/components/Timeline.tsx`: new. Server Component. Timeline header with h2
  "Experience." and secondary PillButton resume link. Maps experience[] to TimelineEntry.
- `src/components/TimelineEntry.tsx`: new. Server Component. .exp-row 3-column grid
  (200px / 1fr / 280px). Current entry gets teal radial gradient and PillBadge
  tone="grad-1" "Current" label. .deets uses .deets-summary paragraph + ul structure.
- `src/components/SkillsGrid.tsx`: new. Server Component. Skills section with h2
  "Skills.", maps skills[] to SkillCategory.
- `src/components/SkillCategory.tsx`: new. Server Component. .skill-cat card with
  accent-colored h4 and list of items.
- `src/app/about/page.tsx`: replaced PlaceholderPage with full About composition.
  Imports: AboutHero, AboutNarrative, AboutPillars, Timeline, SkillsGrid, ContactCTA.
  Updated metadata description.
- `src/app/globals.css`: appended Phase 9 CSS inside @layer components. Classes:
  about-hero, about-hero-grid, about-h1, about-lede, about-stats, about-stat (.num,
  .lbl), about-portrait (.pwm, .nm, .ro), about-narrative, three-card, three-card-bg
  (.blob3), three-card-head (.lede), three-grid, t-card (.t1/.t2/.t3), t-pill, t-desc,
  timeline, timeline-head, exp-row, exp-row.current, now-wrap, role (.role-title,
  .company, .deets, .deets-summary), tags (.tag), skills-section (.skills-section-head),
  skills-grid, skill-cat. Responsive breakpoints at 1200px, 900px, 600px. 1200px block
  includes .exp-row.current .tags { border-top-color: transparent } to prevent the
  border cutting through the teal gradient. prefers-reduced-motion guard on blob3.
- `docs/DECISIONS.md`: DEC-036 through DEC-039.
- `docs/DESIGN_SYSTEM.md`: Phase 9 component entries.

## 2026-05-20 PKT
### feat(routing): /work index, case study template, route placeholders

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending push
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL

Changes:
- `src/data/projects.ts`: new file. Replaces `src/data/featured-work.ts`. Full `ProjectItem` interface and `ProjectBodyBlock` discriminated union. Four projects (Samurai Saga, NVIDIA AI Assistant, Character Creator System, TRESemmé Metaverse), all `featured: true`. Helper exports: `featuredProjects`, `findProjectBySlug`, `getProjectNav`. TRESemmé year corrected from '2025' to '2022 to 2023'. TRESemmé client corrected from 'TRESemmé · HCL' to 'TRESemmé · Unilever'.
- `src/data/featured-work.ts`: deleted. Fully migrated to `projects.ts`.
- `src/components/WorkCard.tsx`: import updated to `ProjectItem` from `projects.ts`. `prefetch={false}` removed from Link (default prefetch restored).
- `src/components/FeaturedWork.tsx`: import updated to `featuredProjects` from `projects.ts`.
- `src/app/work/page.tsx`: new. Server Component. Metadata + WorkIndex.
- `src/components/WorkIndex.tsx`: new. Server Component. Work index hero and cards grid (all projects).
- `src/app/projects/[slug]/page.tsx`: new. Server Component. `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, `notFound()` guard, full case study layout with chips, title, summary+specs grid, cover image, body blocks, prev/next nav.
- `src/components/CaseStudyHeader.tsx`: new. Chips row and h1.
- `src/components/CaseStudySpecs.tsx`: new. `<dl>`/`<dt>`/`<dd>` spec block (Year, Client, Role, Engine, Status).
- `src/components/ProjectBody.tsx`: new. `ProjectBodyBlock[]` renderer with c2 grouping reducer. Heading blocks start new `.case-section` groups.
- `src/components/CaseStudyNav.tsx`: new. Prev/next nav. Null prev shows `/work` link.
- `src/components/PlaceholderPage.tsx`: new. Shared placeholder layout used by three route pages.
- `src/app/about/page.tsx`: new. Placeholder page.
- `src/app/writings/page.tsx`: new. Placeholder page.
- `src/app/contact/page.tsx`: new. Placeholder page.
- `src/app/globals.css`: appended Phase 8 CSS inside `@layer components`. New classes: `.work-index-hero`, `.work-index-hero-grid`, `.work-index-meta`, `.work-index-meta-row`, `.work-index-cards`, `.case-hero`, `.case-meta-row`, `.case-chip`, `.case-title`, `.case-summary`, `.case-summary-text`, `.case-specs`, `.case-spec-row`, `.case-spec-key`, `.case-spec-val`, `.case-media`, `.case-media-frame`, `.case-section`, `.case-list`, `.case-list-item`, `.case-figure`, `.case-nav`, `.case-nav-link`, `.case-nav-dir`, `.case-nav-title`, `.case-nav-empty`, `.case-nav-link.is-next`, `.placeholder-page`. Responsive breakpoints at 1200px, 900px, 600px.
- `docs/DECISIONS.md`: DEC-031 through DEC-035.
- `docs/DESIGN_SYSTEM.md`: Phase 8 component entries (CaseStudyHeader, CaseStudySpecs, ProjectBody, CaseStudyNav, WorkIndex, PlaceholderPage).

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
