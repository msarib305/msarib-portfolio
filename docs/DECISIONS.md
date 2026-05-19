# Architectural Decisions

Decision log for msarib-portfolio. One entry per non-obvious choice. Enables future contributors to understand the why without re-litigating settled questions.

Each entry follows the ADR (Architectural Decision Record) pattern.

---

## DEC-001: Tailwind v4 over v3

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The project needed a utility CSS framework. Tailwind v3 and v4 were both available. v4 introduced a CSS-first configuration model that eliminates `tailwind.config.js`.

**Decision:** Use Tailwind v4 with the CSS-first `@theme` approach. Design tokens live in `globals.css` inside `@theme {}`. No `tailwind.config.js`.

**Consequences:** One fewer config file. Tokens live where they are used (in CSS). PostCSS config uses `@tailwindcss/postcss` instead of `tailwindcss`. Autoprefixing is handled internally; `autoprefixer` is not installed.

**Alternatives considered:** Tailwind v3 (rejected: extra config file, v4 is the current stable release and create-next-app 16 scaffolds it natively).

---

## DEC-002: Keystatic over Velite

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The portfolio needs a way to manage project case study content as MDX files in the repo. Two options were evaluated: Velite (compile-time MDX processing) and Keystatic (git-based CMS with browser UI).

**Decision:** Use Keystatic. Added in Phase 10.

**Consequences:** Content is edited via a browser UI at `/keystatic` (no need to hand-write frontmatter). Schema is defined in TypeScript and catches errors before commit. MDX files live in `content/projects/` and are committed to git. No backend or database dependency.

**Alternatives considered:** Velite (rejected: compile-time only, no browser UI, editing means hand-writing YAML frontmatter in a text editor).

---

## DEC-003: Server Actions over API routes for contact form

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The contact form (Phase 12) needs to submit data to a server. Two options: a dedicated API route handler at `/api/contact`, or a Next.js Server Action colocated with the form component.

**Decision:** Use a Server Action.

**Consequences:** Form logic is colocated with the component. No separate route file to maintain. Server Actions are production-ready in Next.js 16. Progressive enhancement works without client-side JavaScript.

**Alternatives considered:** API route at `/api/contact` (rejected: requires a separate file, adds indirection, no advantage over Server Actions for a single-form use case).

---

## DEC-004: Cloudflare proxy OFF for Vercel records

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The domain (`msarib.dev`) uses Cloudflare for DNS (nameservers delegated from Namecheap). Cloudflare can proxy traffic (orange cloud) or pass DNS records through without proxying (grey cloud). The site is hosted on Vercel.

**Decision:** Proxy OFF (grey cloud, DNS-only) on all records pointing at Vercel.

**Consequences:** Vercel can provision and renew SSL certificates for the domain. No redirect loops. Cloudflare's layer-7 protections (WAF, DDoS proxy) are not applied to this traffic, but Vercel handles its own DDoS mitigation at the edge.

**Alternatives considered:** Proxy ON (orange cloud) was rejected because it breaks Vercel's SSL provisioning and causes redirect loops. The Cloudflare and Vercel proxies cannot coexist in the same request path.

---

## DEC-005: Cloudinary free tier for media CDN

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The portfolio needs a media CDN for project cover images, gallery images, and any other static media. Options included storing files in the repo (rejected for size reasons), self-hosted S3/R2, or a managed CDN.

**Decision:** Cloudinary free tier (25 credits per month).

**Consequences:** 25 credits per month is sufficient for a portfolio with 10 to 30 projects. Transformation API handles all resizing and format conversion. No backend infrastructure to maintain. Folder convention: `msarib/<project-slug>/<asset-name>`.

**Alternatives considered:** Vercel Blob (available, but adds cost at scale and lacks a transformation API); GitHub-hosted images via raw.githubusercontent.com (rejected: no transformation, bandwidth constraints, not a CDN).

---

## DEC-006: pnpm over npm and yarn

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Package manager choice for the project.

**Decision:** pnpm 10.

**Consequences:** Faster installs via content-addressable storage. Strict dependency graph prevents phantom dependencies. Lockfile is deterministic. `pnpm-workspace.yaml` is emitted by create-next-app.

**Alternatives considered:** npm (rejected: slower installs, less strict), yarn (rejected: no advantage over pnpm for a single-package repo).

---

## DEC-007: PP Right Grotesk over Inter Tight

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The portfolio needed a primary typeface. Inter Tight was the previous choice. PP Right Grotesk was evaluated across 15 design iterations.

**Decision:** PP Right Grotesk as the primary typeface, with PP Neue Montreal as an A/B alternative toggled in the footer.

**Consequences:** PP Right Grotesk Wide Black is the only cut with the right tension for the hero display. The wide Black cut creates visual weight that Inter Tight cannot match at the same weight. Free for personal use from Pangram Pangram.

**Alternatives considered:** Inter Tight (rejected: too neutral for the persona, does not hold the hero at display sizes).

---

## DEC-008: Teal #00d9c4 over Unreal blue #26bbff

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The portfolio needed an accent color. Early versions used Unreal's `#26bbff` blue. The design was perceived as an Unreal Engine fan site rather than an independent identity.

**Decision:** Teal `#00d9c4` as the locked accent.

**Consequences:** Clear identity distance from the Unreal Engine brand. The teal stays in the tech-adjacent palette without copying Epic's marketing colors. All hover states, glow effects, pill button fills, and active indicators use this value.

**Alternatives considered:** Unreal blue `#26bbff` (rejected: too closely associated with Epic's own marketing; reads as brand loyalty rather than independent identity).

---

## DEC-009: No analytics by default

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Decide whether to add analytics to the portfolio.

**Decision:** No analytics installed. Privacy-respecting default.

**Consequences:** No cookie banner needed. No GDPR consent flow. No tracking payload in the page. Plausible may be added later if traffic data becomes useful for job application strategy.

**Alternatives considered:** Plausible (deferred, not rejected); Google Analytics (rejected outright: too invasive for a personal portfolio).

---

## DEC-010: TypeScript strict + noUncheckedIndexedAccess

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** TypeScript compiler strictness level.

**Decision:** Enable `strict: true` plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedLocals`, `noUnusedParameters`.

**Consequences:** Array index access returns `T | undefined` instead of `T`. Prevents an entire class of runtime errors that `strict: true` alone does not catch. More type annotations required upfront; pays back in fewer runtime surprises.

**Alternatives considered:** `strict: true` only (rejected: leaves `noUncheckedIndexedAccess` off, which is the most impactful additional flag for runtime safety).

---

## DEC-011: S-logo as singular brand signature

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The portfolio needed a recurring visual signature. Options included coordinate display, initials text, a geometric mark, or the S-logo.

**Decision:** S-logo. Defined once in CSS as `.s-logo`. Used in nav, hero, and footer. The 720deg spin on hover is non-negotiable.

**Consequences:** Single definition point. Size and color controlled via CSS variables. The spin always completes even if the cursor leaves mid-rotation (JS removes `.spinning` on `animationend`).

**Alternatives considered:** Coordinates display (rejected: overused in portfolio design); initials text (rejected: too generic); geometric mark (rejected: no connection to the name or identity).

---

## DEC-012: Hash-routed SPA in v15 converted to App Router routes in production

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The design source of truth is `portfolio_design_v15.html`, a single-file hash-routed SPA. The production site runs on Next.js 16 with App Router.

**Decision:** Keep the SPA for design iteration speed. Convert to App Router routes in the production build. The two formats coexist; the SPA is the spec, Next.js is the deliverable.

**Consequences:** No code is shared between the SPA and the Next.js build. The SPA exists only as a reference. Any design change is first validated in the SPA, then ported to the Next.js component.

**Alternatives considered:** Using the SPA as-is for production (rejected: no SSR, no SEO, no streaming, no App Router data patterns).

---

## DEC-013: Six markdown files only

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The repo needed documentation. Previous versions had scattered markdown files that fell out of sync.

**Decision:** Exactly six markdown files: `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`. No additional markdown files without an explicit decision to add one.

**Consequences:** Each file has a single clear domain. No overlap. Maintenance cost is bounded. AI agents have a predictable set of files to load for context.

**Alternatives considered:** Per-component documentation files (rejected: maintenance tax, drift, hallucination surface); a wiki (rejected: outside the repo, harder to keep in sync with code).

---

## DEC-014: PP Right Grotesk personal vs commercial licence

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** PP Right Grotesk and PP Neue Montreal are available free for personal use from Pangram Pangram. Commercial use requires a paid licence.

**Decision:** Use the personal-use licence now. Purchase commercial when msarib.dev starts generating paid client work directly.

**Consequences:** No licence cost during the job search and portfolio phases. A future obligation exists: buy the commercial licence before monetizing the domain. This is noted here so it is not forgotten.

**Alternatives considered:** Buy commercial licence now (deferred: unnecessary cost before the site generates revenue); use a different typeface (rejected: no alternative matches PP Right Grotesk Wide Black for this specific design).

---

## DEC-015: Phase 3 token additions to Phase 2 @theme

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Phase 3 component implementation surfaced one missing semantic token. The pill badge needed a foreground colour (`#1a1a1f`) that was not present in the Phase 2 @theme block. `--color-accent-fg` (`#00231f`) was already present for primary pill button text; badge foreground is a distinct value and warranted its own token.

**Decision:** Added `--color-badge-fg: #1a1a1f` to the `@theme` block alongside the other `--color-*` tokens. The pill badge CSS rule uses `var(--color-badge-fg)` rather than a hardcoded hex literal.

**Consequences:** Tailwind utility `text-badge-fg` is now available. Badge foreground is a single source of truth. Any future badge variant that needs the same dark foreground references the token instead of duplicating the hex.

**Alternatives considered:** Hardcoded `#1a1a1f` hex in `@layer components` (rejected: inconsistent with the rest of the system where every colour value is a `var()` reference; makes future palette changes require hunting for literals).

Also noted: the `space-y-20` utility (Tailwind default spacing, 80px) used on the `/design-system` page is intentional. The design-system page is internal-only (`robots: noindex`) and does not ship in any user-facing template. An arbitrary token-derived value here adds complexity with no design benefit; 80px vertical rhythm is correct for a wide-spaced component showcase.
