# AGENTS.md

AI agent contract for msarib-portfolio. Applies to Claude, Cursor, Copilot, and any other AI tool working in this repo. Read this file before writing any code or content.

---

## Required context

Before starting any non-trivial task, load these two files from the Claude project context:

- **MASTER_CONTEXT.md**: visual identity, design tokens, component patterns, layout system, writing rules, locked decisions, iteration history, pending items.
- **PROFESSIONAL_HISTORY.md**: career timeline, per-role engineering scope, selected project details, verification links, framing decisions (NSFW title policy, Web3 framing, name usage).

These files are in the Claude project context, not in this repo. They are the source of truth for all design decisions, copy decisions, and professional framing. Do not invent facts or design values that are not in those files.

---

## Hard writing rules

Non-negotiable. Apply to every word authored in this repo, including markdown files, code comments, and UI copy.

- No em-dashes, ever. Use commas, parentheses, semicolons, or separate sentences.
- No en-dashes in date ranges. Write "2024 to 2025" or "2024-25" with a hyphen.
- No AI tells: "I'd be happy to", "feel free to", "it's worth noting", "great question", "let me know if", "I hope this helps", hedging ("perhaps", "might want to", "you may wish to"), triplet adjective lists ("clean, modern, and beautiful"), unnecessary disclaimers, sycophancy in any form.
- Second editing pass on every piece of copy to strip AI tells before delivery.
- Direct, specific, opinionated voice. The narrator is an engineer who has shipped things, not a brand account.
- Specificity over abstraction. "Reduced bandwidth per client by 38%" beats "improved performance significantly."

---

## Plan-mode discipline

- Always plan before writing code for any phase or feature work. Produce a plan file, present it, then stop and wait.
- Ask before running `pnpm install` or `pnpm add` with any new packages. State what will be added and why.
- Never commit without explicit confirmation from Sarib. List staged files and commit message, wait for yes.
- Never push without a yes.
- Never delete files without listing them and waiting for a yes.
- Default to plan mode for all multi-step work.

---

## MCP usage protocol

- **Context7** first for any question about Next.js, React, TypeScript, Tailwind, Motion, Lenis, Keystatic, Cloudinary, or any npm package. Next.js 16 has breaking changes from training data. Never rely on memory for Next.js 16 specifics.
- **Playwright** after any change that touches an interactive flow (contact form, mobile menu, nav, font A/B toggle, expertise card hover, S-logo hover and click). Run at the end of the phase.
- **GitHub MCP** for all commit and push operations.
- **Vercel MCP** for deployment status, build logs, and environment variable management.

---

## Allowed commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm typecheck
pnpm format
pnpm format:check
```

Plus `gh` CLI for repo operations. Any command outside this list requires explicit confirmation before running.

---

## Content schema for project case studies

Keystatic MDX frontmatter fields. Each field maps directly to the Keystatic collection schema defined in Phase 10.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Display name of the project |
| `summary` | string | yes | One to two sentences. No AI tells. |
| `date` | date (YYYY-MM-DD) | yes | Ship date or most recent significant milestone |
| `status` | enum | yes | `"shipped"`, `"in-production"`, `"prototype"`, `"cancelled"` |
| `role` | string | yes | e.g. "Lead Developer", "Sole Developer" |
| `engine` | string | yes | e.g. "UE5.5", "UE4.27" |
| `tags` | string[] | yes | From the tag taxonomy below |
| `client` | string | no | Studio or client name if applicable |
| `cover` | string | yes | Cloudinary public ID (e.g. `msarib/custom-fps/cover`) |
| `coverAlt` | string | yes | Descriptive alt text for the cover image |
| `gallery` | string[] | no | Array of Cloudinary public IDs |
| `video` | string | no | YouTube video ID, exactly 11 characters |
| `featured` | boolean | no | Defaults to false. Featured projects appear in the hero section. |
| `links` | {label: string, url: string}[] | no | External links (Steam page, trailer, press) |

---

## Tag taxonomy

Use only these tags. Do not invent new tags without updating this list.

**Engine versions:**
`UE4.22`, `UE4.23`, `UE4.24`, `UE4.25`, `UE4.26`, `UE4.27`, `UE5.0`, `UE5.1`, `UE5.2`, `UE5.3`, `UE5.4`, `UE5.5`, `UE5.6`, `UE5.7`

**Technology:**
`Niagara`, `GAS`, `replication`, `VR`, `pixel-streaming`, `UEFN`, `Verse`, `Blueprints`, `C++`, `AI-integration`, `Sequencer`, `MetaQuest`, `mobile-Android`, `mobile-iOS`, `Web3-Solana`, `Web3-Ethereum`

**Role:**
`Lead`, `Senior`, `Developer`, `Solo`

---

## Cloudinary workflow

All project media is stored in Cloudinary (free tier, 25 credits per month).

Folder convention: `msarib/<project-slug>/<asset-name>`

Examples:
- `msarib/custom-fps/cover.webp`
- `msarib/character-creator/gallery-01.webp`

Do not store media files in the repo. Reference Cloudinary public IDs in MDX frontmatter. The `next-cloudinary` package (added Phase 14) handles image rendering and transformation.

---

## YouTube workflow

Videos are uploaded as unlisted to youtube.com/@msarib305. The 11-character video ID goes in the MDX frontmatter `video` field. The `react-lite-youtube-embed` component (added Phase 10) handles the embed. Do not use full YouTube URLs in frontmatter.

---

## Testing protocol

Run in this order after every meaningful change. All steps must pass before the change is considered done.

1. `pnpm typecheck` must exit 0 with no type errors
2. `pnpm lint` must exit 0 with zero errors and zero warnings
3. `pnpm build` must succeed
4. Vercel preview deploy on push must succeed
5. Playwright test for any interactive flow touched in this change
6. Manual visual confirmation from Sarib via the preview URL

Log all results in `docs/CHANGELOG.md` using the format defined there.

Console errors are a hard fail. No change ships with red text in DevTools. Hydration warnings count as console errors.
