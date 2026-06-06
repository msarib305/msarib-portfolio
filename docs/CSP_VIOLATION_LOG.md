# CSP Violation Log

Tracks Content Security Policy violations observed during browser sweeps. Currently CSP is in `Content-Security-Policy-Report-Only` mode (see DEC-071). Violations appear as console warnings/errors but do not block resources.

When CSP flips to enforcing mode, any unresolved violations here will block real resources. Resolve all entries before flipping.

---

## Phase 18 sweep (2026-06-06)

Routes swept: `/`, `/work`, `/about`, `/writings`, `/contact`, `/projects/anime-stylized-action-tgs2024`, `/this-does-not-exist` (404)

**Production code errors: zero. Hydration warnings: zero.**

### CSP entries

| Route | Message | Classification | Action |
|-------|---------|---------------|--------|
| All routes | `The Content Security Policy directive 'upgrade-insecure-requests' is ignored when delivered in a report-only policy.` | Structural — this is a browser behavior, not a violation. `upgrade-insecure-requests` is silently ignored in report-only mode by all browsers (per CSP spec). | Resolves automatically when CSP flips from `Content-Security-Policy-Report-Only` to `Content-Security-Policy`. No directive change needed. |

**Zero actual violations (no "Refused to load" messages, no blocked resources).**

### Third-party noise (not violations)

| Source | Message | Classification |
|--------|---------|---------------|
| `challenges.cloudflare.com` (Turnstile) | WebGL GPU stall, preload warning, 401 on PAT endpoint, obfuscation markers | Internal to Cloudflare's challenge iframe. Not actionable. Turnstile completes successfully in real browser use. |
| MXToolbox / Verisign DNSSEC Analyzer | `ERR_NETWORK_CHANGED` errors | Stale from earlier in the same Playwright session during Phase 17/18 DNS verification. Not from msarib.dev. |

### Minor warnings

| Route | Message | Classification | Action |
|-------|---------|---------------|--------|
| `/this-does-not-exist` (404) | Showreel poster preload (`ddgwzcrim/video/upload/…/portfolio-showreel`) not used within a few seconds | The root layout preloads the showreel poster on every route including 404, which has no showreel. No user-facing impact (no image flash, no layout shift, LH CLS=0). | Consider scoping the preload link to the home page route only in a future polish pass. Not blocking. |

---

## Flip checklist (fill in before enforcing)

Before changing `Content-Security-Policy-Report-Only` to `Content-Security-Policy` in `next.config.ts`:

- [ ] Real ExpertiseCard videos uploaded and wired (Future Work) — verify Cloudinary video src domains still covered by existing `media-src` directive.
- [ ] Resume PDF regenerated (if URL changes) — PDF is served from `/resume.pdf`, no CSP impact.
- [ ] Phase 19 complete — no new external script/frame/font sources added without updating CSP.
- [ ] Re-run this sweep after each addition and confirm zero violations.
- [ ] When clean: change `key: 'Content-Security-Policy-Report-Only'` to `key: 'Content-Security-Policy'` in `next.config.ts` (identify by content match, not line number).
- [ ] After deploy: verify `content-security-policy` header present via `curl -I https://msarib.dev/`.
- [ ] Re-sweep all routes in Chrome DevTools. Any newly blocked resource = error (not warning). Fix immediately.

See DEC-071 for the enforcement deferral decision.
