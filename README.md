# msarib-portfolio

Production source for [msarib.dev](https://msarib.dev). Lead Unreal Engine 5 developer portfolio targeting German and Japanese AAA studios.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack, React Compiler)
- **UI:** React 19
- **Styling:** Tailwind v4 (CSS-first `@theme` in `globals.css`, no `tailwind.config.js`)
- **Language:** TypeScript 5 (strict + `noUncheckedIndexedAccess`)
- **Package manager:** pnpm 10
- **Animation:** Motion v12 (added Phase 3+)
- **Smooth scroll:** Lenis (added Phase 4+)
- **Content:** Keystatic (git-based MDX, browser UI, added Phase 10)
- **Media CDN:** Cloudinary (added Phase 14)
- **Hosting:** Vercel Hobby plan
- **DNS:** Cloudflare (proxy OFF on all Vercel records)

## Prerequisites

- Node 22+ (see `.nvmrc`)
- pnpm 10+

Install pnpm if missing:

```bash
corepack enable
corepack use pnpm@latest
```

## Quick start

```bash
git clone git@github.com:msarib305/msarib-portfolio.git
cd msarib-portfolio
pnpm install
pnpm dev
```

Dev server runs at [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | Command | What it does |
|---|---|---|
| `dev` | `next dev` | Start dev server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve the production build locally |
| `lint` | `eslint src` | Run ESLint against `src/` |
| `lint:fix` | `eslint src --fix` | Auto-fix lint errors |
| `typecheck` | `tsc --noEmit` | Run TypeScript compiler without emitting |
| `format` | `prettier --write .` | Format all files |
| `format:check` | `prettier --check .` | Check formatting without writing |

## Directory structure

```
msarib-portfolio/
├── src/app/            App Router pages and layouts
├── public/             Static assets served at /
├── docs/               Engineering documentation
│   ├── DESIGN_SYSTEM.md  Canonical visual spec (tokens, components, interactions)
│   ├── DECISIONS.md      Architectural decision records
│   └── CHANGELOG.md      Timestamped change log
├── AGENTS.md           AI agent contract (writing rules, MCP protocol, content schema)
├── CLAUDE.md           Claude Code CLI overrides and guard rails
└── README.md           This file
```

Content collections (`content/projects/`) and the Keystatic admin route (`/keystatic`) are added in Phase 10.

## Deployment

Every push to `main` triggers a Vercel preview deployment automatically. There is no manual deploy step. The production domain (`msarib.dev`) is mapped in the Vercel dashboard.

Vercel environment variables required at Phase 1: none. Cloudinary keys are added in Phase 14 via `vercel env add`.

## Content schema

Project case study schema (Keystatic MDX frontmatter) is documented in `AGENTS.md` under the "Content schema" section. Content lives in `content/projects/` as MDX files once Phase 10 is complete.

## Contact

- Portfolio: [msarib.dev](https://msarib.dev)
- Email: contact@msarib.dev
- GitHub: [msarib305](https://github.com/msarib305)
- LinkedIn: [msarib305](https://linkedin.com/in/msarib305)
