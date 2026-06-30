> This README is undergoing a phased rewrite. Current state is accurate for stack and rules; design system description is a placeholder pending full rewrite after Phase 19.

# msarib.dev

Production source for [msarib.dev](https://msarib.dev). Portfolio for Muhammad Sarib. Lead Unreal Engine 5 developer targeting AAA and mid-tier studios.

## Stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript 5 (strict)
- **Styling:** Tailwind v4, CSS-first `@theme` in `globals.css`, no `tailwind.config.js`
- **Animation:** Motion v12, Lenis smooth scroll
- **CMS:** Keystatic (git-based, local mode, browser UI at `/keystatic`)
- **Media:** Cloudinary (image CDN, video delivery)
- **Email:** Resend
- **Bot protection:** Cloudflare Turnstile
- **Tests:** Playwright (5 browsers, visual regression, a11y)
- **Hosting:** Vercel
- **DNS:** Cloudflare, DNS-only (proxy OFF on all Vercel records)
- **Package manager:** pnpm 10

## Local development

**Prerequisites:** Node 22+, pnpm 10+

```bash
git clone git@github.com:msarib305/msarib-portfolio.git
cd msarib-portfolio
pnpm install
```

Copy the env example and fill in values:

```bash
cp .env.example .env.local
```

Required values for local dev are in `.env.example`. Test-mode keys for Turnstile are already provided there. They work without a real Cloudflare account.

```bash
pnpm dev
```

Dev server runs at `http://localhost:3000`.

## Content management

Keystatic admin runs at `http://localhost:3000/keystatic` in dev mode. Content files live in:

- `content/projects/*/index.mdoc` (case study pages)
- `content/writings/*/index.mdoc` (writing posts)

Edit via the browser UI or directly in the MDoc files. Changes are picked up on save with no restart needed.

## Testing

```bash
# Full suite: all 5 browser projects (~6 minutes)
pnpm test:e2e

# Single browser (faster iteration)
pnpm test:e2e --project=chromium-desktop

# Accessibility tests only
pnpm test:a11y

# Regenerate visual baselines after intentional UI changes
pnpm test:e2e:update
```

Tests require a running dev server. If one is already running on port 3000, Playwright reuses it. If not, it starts one automatically.

## Deployment

Push to `main` triggers a Vercel auto-deploy. Preview builds are generated for pull requests. No manual deploy step.

Custom domain `msarib.dev` is configured via the Vercel dashboard. SSL is provisioned by Vercel; Cloudflare must stay in DNS-only mode (grey cloud) on all records pointed at Vercel.

Required environment variables in Vercel Production:

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Value: `ddgwzcrim` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Real Cloudflare site key for `msarib.dev` |
| `TURNSTILE_SECRET_KEY` | Real Cloudflare secret |
| `RESEND_API_KEY` | Real Resend API key |
| `RESEND_FROM_EMAIL` | `hello@msarib.dev` |
| `RESEND_TO_EMAIL` | `contact@msarib.dev` (Zoho mailbox; see DEC-090) |

`RESEND_MOCK` and `RATE_LIMIT_TEST_MODE` must NOT be set in Production.

## Documentation

| File | Contents |
|---|---|
| `docs/MASTER_CONTEXT.md` | Full architecture, phases, decisions narrative |
| `docs/DECISIONS.md` | Architectural decision records (DEC-001 onward) |
| `docs/CHANGELOG.md` | Timestamped change log by phase |
| `docs/BUNDLE_BASELINE.md` | JS bundle size baseline (Phase 16) |
| `docs/PRE_LAUNCH_CHECKLIST.md` | Pre-launch verification checklist |
| `AGENTS.md` | AI agent contract, content schema, writing rules |
| `CLAUDE.md` | Claude Code CLI guard rails and MCP protocol |

## License

All rights reserved. Source is public for reference; do not reuse for your own portfolio without permission.
