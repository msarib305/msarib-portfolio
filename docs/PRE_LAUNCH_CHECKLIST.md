# Pre-launch Checklist

Walk this list top to bottom before sharing msarib.dev publicly or doing recruiter outreach. Tick each item as done or note the waiver reason.

---

## Infrastructure

- [x] **DNS: Cloudflare grey cloud on all Vercel records.**
  All A/AAAA/CNAME records pointing at Vercel must use DNS-only mode (grey cloud icon). Orange cloud (proxy) breaks Vercel SSL provisioning and will cause certificate errors.
  *Confirmed Phase 17. All 6 records grey-cloud.*

- [x] **All required env vars set in Vercel Production.**
  See the env var table below. Run `vercel env ls production` after linking (`vercel link`) and compare against the table.
  *Confirmed Phase 18 Step 3. All 6 required vars present in Production.*

- [x] **`RESEND_MOCK` is absent in Vercel Production.**
  This flag mocks email delivery. If set in Production, no messages will actually send. Confirm it is not present.
  *Confirmed Phase 18 Step 3. Variable absent.*

- [x] **`RATE_LIMIT_TEST_MODE` is absent in Vercel Production.**
  This flag disables rate limiting. Must be absent in Production.
  *Confirmed Phase 18 Step 3. Variable absent.*

---

## Smoke tests (run against the live msarib.dev URL)

- [x] **Security headers present.**
  Run: `curl -I https://msarib.dev/`
  Confirm all six headers are in the response:
  - `content-security-policy-report-only`
  - `strict-transport-security`
  - `x-frame-options`
  - `x-content-type-options`
  - `referrer-policy`
  - `permissions-policy`
  *Confirmed Phase 18 Step 3. All 6 headers present.*

- [x] **404 page renders correctly.**
  Visit `https://msarib.dev/this-does-not-exist`.
  Confirm the styled 404 page renders with site fonts and palette — "404" code, "Page not found" heading, "Back to home" button. Not the Next.js default white page.
  *Confirmed Phase 18 Step 3 via Playwright screenshot.*

- [x] **Contact form delivers email.**
  Submit the form at `https://msarib.dev/contact` with real content. Verify the email arrives at `msarib.contact@gmail.com`. Check that Turnstile widget loads and validates correctly (not the test widget).
  *Confirmed Phase 18. Tier 1 (valid submission) delivered to Gmail. Tier 2 (empty form) blocked client-side. Tier 3 (curl POST bypass) returned HTTP 405 — Server Action RPC mechanism rejects direct POST before Turnstile layer. Resend dashboard shows delivered status.*

- [x] **Sitemap is reachable and correct.**
  Visit `https://msarib.dev/sitemap.xml`. Confirm it returns 200 and lists all expected routes including project slugs.
  *Confirmed Phase 18 Step 3. 14 URLs, all 9 project slugs present.*

- [x] **Robots.txt is correct.**
  Visit `https://msarib.dev/robots.txt`. Confirm `Disallow: /keystatic/` is present and `Allow: /` is present.
  *Confirmed Phase 18 Step 3.*

- [x] **OG image renders.**
  Paste `https://msarib.dev` into the LinkedIn Post Inspector. Confirm the OG image renders and the title/description are correct.
  *Confirmed Phase 18. LinkedIn Post Inspector: /, /work, /projects/anime-stylized-action-tgs2024 all render at correct 1.91:1 aspect ratio with brand title formatting. Details in docs/OG_PREVIEW_MATRIX.md.*

---

## Performance

- [x] **Lighthouse mobile score >= 85.**
  Run Lighthouse in Chrome DevTools on `https://msarib.dev` (mobile preset). If below 85, investigate before announcing publicly.
  *Confirmed Phase 18. All 6 routes pass. Scores: / 98, /work 93, /about 85, /writings 98, /contact 100, /projects/anime-... 100. Note: /about is at exactly 85 (LCP 4449ms due to portrait placeholder). Target of 90+ met on 5/6 routes; /about will improve when real portrait ships.*

- [x] **Lighthouse desktop score >= 95.**
  Same as above with desktop preset.
  *Confirmed Phase 18. All 6 routes score 100 desktop.*

---

## CSP monitoring

- [DEFERRED: DEC-071] **CSP enforcement flip.**
  Phase 18 console sweep found zero actual CSP violations across all 7 routes. CSP is clean and technically ready to enforce. Enforcement deferred until site is feature-complete (post real ExpertiseCard videos, post Phase 19). When ready: change header key in `next.config.ts` from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. See docs/CSP_VIOLATION_LOG.md for flip checklist.

---

## Real device testing

- [DEFERRED: DEC-074] **Full device matrix.**
  Phase 18 covered 1 mobile + 1 desktop (Chrome). Full 8-device matrix deferred to post-Phase 19 polish phase. Inventory: Win Desktop x2 (Chrome/Edge/Firefox), HP G4 laptop (Chrome, low-spec), Pixel 8 Pro (Chrome), iPhone X (iOS 18 Safari), iPhone 14 Plus (iOS 26 Safari), MacBook Pro M1 (macOS Tahoe Safari). Run systematically before next outreach push after Phase 19.

---

## Optional (decide before launch)

- [DEFERRED: No analytics by default] **Vercel Analytics enabled.** (Sarib decides if/when — no action required for launch.)

---

## Environment variable reference

All variables that must be configured in Vercel before launch.

| Variable | Required in | Value / Notes |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Production + Preview | `ddgwzcrim` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production + Preview | Real Cloudflare site key for `msarib.dev`; test key (`1x00000000000000000000AA`) is fine for Preview |
| `TURNSTILE_SECRET_KEY` | Production + Preview | Real Cloudflare secret; test secret (`1x0000000000000000000000000000000AA`) is fine for Preview |
| `RESEND_API_KEY` | Production + Preview | Real Resend API key |
| `RESEND_FROM_EMAIL` | Production + Preview | `hello@msarib.dev` |
| `RESEND_TO_EMAIL` | Production + Preview | `msarib.contact@gmail.com` |
| `NEXT_GOOGLE_SITE_VERIFICATION` | Production (if applicable) | Not needed — Search Console uses Domain Property (DNS TXT), not meta tag. See DEC-072. |
| `RESEND_MOCK` | **Must be absent** in Production | Only set in local `.env.local` for dev/test. Must not appear in Vercel Production env. |
| `RATE_LIMIT_TEST_MODE` | **Must be absent** in Production | Same as above. |
