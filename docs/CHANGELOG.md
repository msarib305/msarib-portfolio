# Changelog

Timestamped log of every meaningful change to msarib-portfolio. Newest entries at the top.

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

## 2026-05-19 21:10 PKT
### feat(scaffold): initial Next.js 16 project + dev tooling + six docs

- pnpm typecheck: pass
- pnpm lint: pass
- pnpm build: pass
- Vercel preview: pending (Sarib to connect via Vercel dashboard)
- Playwright: N/A this phase
- Manual visual check: pending Vercel preview URL
