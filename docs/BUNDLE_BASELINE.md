# Bundle Baseline

Recorded at Phase 16 launch. Update this file when bundle sizes change materially (>5% delta for any route or the shared chunk total).

**Note:** Next.js 16 + Turbopack does not output per-route "First Load JS" in the CLI build table (per DEC-057). Sizes below are taken from `.next/static/` and `.next/server/app/` after `pnpm build`. For interactive chunk-level analysis, run `pnpm next experimental-analyze` which opens the Turbopack visualizer in a browser.

**Last updated:** 2026-06-06 (Phase 16)

---

## Static output totals

| Directory                    | Uncompressed size |
|------------------------------|-------------------|
| `.next/static/` (all)        | 3.8 MB            |
| `.next/static/chunks/` (JS)  | 3.6 MB            |
| `.next/static/media/` (fonts)| 96 KB             |

---

## Largest JS chunks (uncompressed)

| Chunk file                      | Size   | Notes                                |
|---------------------------------|--------|--------------------------------------|
| `0lyct-b3xfyr3.js`              | 2.7 MB | Dominant shared chunk (React, Motion, Lenis, etc.) |
| `0syhs4-~8.v-..js`             | 228 KB |                                      |
| `162w5iupvw0qc.js`             | 148 KB |                                      |
| `12-27a9mioizp.js`             | 140 KB |                                      |
| `03~yq9q893hmn.js`             | 112 KB |                                      |
| `0jkoan1x1tkod.js`             |  56 KB |                                      |
| `0w-v6-v6.o5o7.js`             |  44 KB |                                      |
| `0-_vmg4ged1x6.js`             |  40 KB |                                      |

The 2.7 MB shared chunk is gzip-compressed in transit — actual wire size is substantially smaller. Cloudflare/Vercel edge serves all JS with `Content-Encoding: gzip` or `br`.

---

## HTML output per route (pre-rendered, uncompressed)

| Route              | HTML size | Route type |
|--------------------|-----------|------------|
| `/` (home)         | 92 KB     | Static     |
| `/work`            | 68 KB     | Static     |
| `/about`           | 56 KB     | Static     |
| `/contact`         | 32 KB     | Static     |
| `/writings`        | 24 KB     | Static     |
| `/_not-found`      | 24 KB     | Static     |
| `/projects/[slug]` | varies    | SSG        |

---

## Alert threshold

If `.next/static/chunks/` grows past **5 MB uncompressed**, investigate before merging. The shared chunk at 2.7 MB is the main candidate — likely Motion or Lenis. Per DEC-057, webpack mode is not available to drill into this further; use `next experimental-analyze`.
