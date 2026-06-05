# Pre-launch Checklist

Walk this list top to bottom before sharing msarib.dev publicly or doing recruiter outreach. Tick each item as done or note the waiver reason.

---

## Infrastructure

- [ ] **DNS: Cloudflare grey cloud on all Vercel records.**
  All A/AAAA/CNAME records pointing at Vercel must use DNS-only mode (grey cloud icon). Orange cloud (proxy) breaks Vercel SSL provisioning and will cause certificate errors.

- [ ] **All required env vars set in Vercel Production.**
  See the env var table below. Run `vercel env ls production` after linking (`vercel link`) and compare against the table.

- [ ] **`RESEND_MOCK` is absent in Vercel Production.**
  This flag mocks email delivery. If set in Production, no messages will actually send. Confirm it is not present.

- [ ] **`RATE_LIMIT_TEST_MODE` is absent in Vercel Production.**
  This flag disables rate limiting. Must be absent in Production.

---

## Smoke tests (run against the live msarib.dev URL)

- [ ] **Security headers present.**
  Run: `curl -I https://msarib.dev/`
  Confirm all six headers are in the response:
  - `content-security-policy-report-only`
  - `strict-transport-security`
  - `x-frame-options`
  - `x-content-type-options`
  - `referrer-policy`
  - `permissions-policy`

- [ ] **404 page renders correctly.**
  Visit `https://msarib.dev/this-does-not-exist`.
  Confirm the styled 404 page renders with site fonts and palette — "404" code, "Page not found" heading, "Back to home" button. Not the Next.js default white page.

- [ ] **Contact form delivers email.**
  Submit the form at `https://msarib.dev/contact` with real content. Verify the email arrives at `msarib.contact@gmail.com`. Check that Turnstile widget loads and validates correctly (not the test widget).

- [ ] **Sitemap is reachable and correct.**
  Visit `https://msarib.dev/sitemap.xml`. Confirm it returns 200 and lists all expected routes including project slugs.

- [ ] **Robots.txt is correct.**
  Visit `https://msarib.dev/robots.txt`. Confirm `Disallow: /keystatic/` is present and `Allow: /` is present.

- [ ] **OG image renders.**
  Paste `https://msarib.dev` into the Twitter Card Validator (`https://cards-dev.twitter.com/validator`) or LinkedIn post inspector. Confirm the OG image renders and the title/description are correct.

---

## Performance

- [ ] **Lighthouse mobile score >= 85.**
  Run Lighthouse in Chrome DevTools on `https://msarib.dev` (mobile preset). If below 85, investigate before announcing publicly.

- [ ] **Lighthouse desktop score >= 95.**
  Same as above with desktop preset.

---

## CSP monitoring

- [ ] **Check CSP violation reports in browser console.**
  Open `https://msarib.dev` in Chrome DevTools > Console. CSP is currently in report-only mode (`Content-Security-Policy-Report-Only`). Any violations will appear as console warnings without blocking resources. Document any violations found — they become input for flipping CSP to enforcing mode.
  - Scheduled enforcement date: approximately 1 week post-launch (per DEC-060).
  - If no violations after 1 week: change header key in `next.config.ts` from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.

---

## Optional (decide before launch)

- [ ] **Vercel Analytics enabled.** (Sarib decides if/when — no action required for launch.)

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
| `NEXT_GOOGLE_SITE_VERIFICATION` | Production (if applicable) | Add only if Google Search Console was verified. Check with Sarib. |
| `RESEND_MOCK` | **Must be absent** in Production | Only set in local `.env.local` for dev/test. Must not appear in Vercel Production env. |
| `RATE_LIMIT_TEST_MODE` | **Must be absent** in Production | Same as above. |
