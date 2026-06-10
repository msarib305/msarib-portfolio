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

---

## DEC-016: Client-island pattern for FontToggle and LahoreClock inside Server Component Footer

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Footer is a Server Component to avoid sending an unnecessary client bundle for content-only markup. FontToggle requires `localStorage` and LahoreClock requires `setInterval` and `Intl.DateTimeFormat` — both are browser-only APIs that cannot run in a Server Component.

**Decision:** `Footer.tsx` has no `'use client'` directive. `FontToggle.tsx` and `LahoreClock.tsx` each have `'use client'` and are imported as children. React treats them as client subtree boundaries inside an otherwise-server tree.

**Consequences:** Only the two interactive subtrees enter the client bundle. The rest of Footer renders as static HTML with no client JavaScript. This is the standard Next.js App Router island pattern.

**Alternatives considered:** Mark entire `Footer.tsx` as `'use client'` (rejected: unnecessarily inflates the client bundle for markup that has no interactivity).

---

## DEC-017: Hand-rolled focus trap for MobileMenu over focus-trap-react

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** MobileMenu requires a focus trap to comply with WAI-ARIA Modal Authoring Practices (keyboard users must not be able to Tab outside the open dialog).

**Decision:** Manual `Tab`/`Shift+Tab` keydown handler in a `useEffect`. The handler queries `FOCUSABLE` elements inside the dialog ref and wraps focus at both ends. No external dependency.

**Consequences:** Approximately 20 lines of implementation inside `MobileMenu.tsx`. No additional entry in `node_modules`. The logic is auditable inline without chasing a package.

**Alternatives considered:** `focus-trap-react` (rejected: a single-use dependency for 20 lines; adds a transitive dependency chain that is not worth it for one component); `@radix-ui/react-focus-scope` (rejected: same reasoning, plus it pulls in the broader Radix ecosystem).

---

## DEC-018: FontToggle SSR hydration via live-correction on mount

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** FontToggle cannot read `localStorage` on the server (no `window`). Two approaches: (a) render the default "Right Grotesk" state server-side and correct on mount if `localStorage` differs; (b) render nothing until mounted, then insert the button.

**Decision:** Approach (a). Server renders the button with `aria-pressed={false}` and label "Right Grotesk". `useEffect` reads `localStorage` on mount and corrects both the React state and `body.dataset.font` if "montreal" is stored.

**Consequences:** A one-frame label flash may occur for returning Montreal users. FontToggle is a footer element, below the fold, and the flash is imperceptible in practice. CLS is zero because the button occupies its space from the first render.

**Alternatives considered:** Approach (b) — render nothing until mounted. Rejected: introduces a CLS shift when the button appears, and a flash of missing content (FOMC) is worse than a flash of incorrect content for a below-fold element.

---

## DEC-019: aria-pressed added to FontToggle (improvement over v15)

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The v15 font toggle button has no `aria-pressed` attribute. It announces only as "Switch typeface — button" to screen readers.

**Decision:** Add `aria-pressed={pref === 'montreal'}` and a descriptive `aria-label` that names the current font: "Switch typeface. Current: Neue Montreal".

**Consequences:** Screen readers announce the toggle as "Switch typeface. Current: Neue Montreal — toggle button pressed" when Montreal is active. No visual change. A strict improvement over v15.

**Alternatives considered:** Match v15 exactly and omit `aria-pressed` (rejected: the v15 state is a known accessibility gap; Phase 4 is the correct time to fix it).

---

## DEC-020: generateViewport for color-scheme replaces metadata.other

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Phase 2 used `metadata.other = { 'color-scheme': 'dark' }` to emit the `<meta name="color-scheme" content="dark">` tag. This works but uses an undocumented side channel in the metadata API. Next.js 16 provides a typed `viewport` export via `export const viewport: Viewport`.

**Decision:** Replace `metadata.other['color-scheme']` with `export const viewport: Viewport = { colorScheme: 'dark' }` in `layout.tsx`. Import `type Viewport from 'next'`.

**Consequences:** The meta tag is still emitted. The `metadata` object is cleaner (no `other` field). The `Viewport` type provides compile-time safety for all viewport-related properties.

**Alternatives considered:** Keep `metadata.other` (rejected: undocumented side channel; the `viewport` export is the explicit, typed, documented API in Next.js 16).

---

## DEC-021: Pure CSS @keyframes for hero word reveal — no Motion install at Phase 5

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The hero headline and subhead needed a staggered word-by-word reveal animation on page load. Motion v12 is listed in MASTER_CONTEXT as the animation library but had not been installed. The choice was whether to install it now or use pure CSS.

**Decision:** Pure CSS `@keyframes word-reveal` with per-word `animation-delay` inline styles. Motion v12 is not installed this phase.

**Consequences:** The headline is a Server Component (no `'use client'` needed for the animation). The existing `@layer base` `prefers-reduced-motion` block already collapses `animation-duration` to `0.01ms !important`, so reduced-motion devices see words in their final state instantly with zero extra CSS. Words are rendered as `<span>` elements with `animation-fill-mode: both` so they start invisible during the delay period.

**Alternatives considered:** Motion v12 (rejected: a finite one-shot animation on a known word list is the weakest justification for a new dependency; no downstream phase through Phase 10 has a confirmed Motion requirement).

**Revisit trigger:** Phase 11 (writings page transitions) or Phase 13 (case study page transitions) if those need orchestrated sequences CSS cannot express cleanly.

---

## DEC-022: Canvas draw rate throttled to 10fps for showreel glow

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** The ShowreelGlow component uses a `requestAnimationFrame` loop to paint video frames onto a `<canvas>` that produces the image-derived glow behind the showreel. The naive approach draws every RAF tick (60fps). v15 uses a throttle.

**Decision:** The RAF loop checks `if (now - lastDraw >= 100)` before each `drawImage` call, throttling draws to approximately 10fps. The RAF itself runs at 60fps but skips all frames that arrive within the 100ms interval.

**Consequences:** `drawImage` is called roughly 10 times per second instead of 60. The canvas is 160px wide (height proportional). CSS `filter: blur(80px)` hides all temporal detail below approximately 3fps, so 10fps is indistinguishable from 60fps to the human eye. CPU cost of the glow draw is reduced by roughly 6x compared to 60fps. Two RAF loops coexist on `/` (Cursor at 60fps, ShowreelGlow throttled to 10fps).

**Alternatives considered:** 60fps draws (rejected: wasted work; the blur makes sub-10fps invisible). Static image fallback (rejected: the glow must track the video content dynamically for the effect to work on arbitrary showreels).

---

## DEC-023: prefers-reduced-motion for showreel handled via JS matchMedia

- **Date:** 2026-05-19
- **Status:** Accepted

**Context:** Users who prefer reduced motion should not see the video autoplaying or the canvas glow animating. CSS `@media (prefers-reduced-motion: reduce)` alone cannot stop `<video autoPlay>`.

**Decision:** ShowreelGlow checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` inside `useEffect`. If the preference is set: call `video.pause()` and return without starting the RAF loop. The poster image remains visible. CSS `display: none` on `.showreel-glow-canvas` is an additional guard for the canvas in case the JS check is delayed.

**Consequences:** On reduced-motion devices: the poster frame is shown, no video plays, no canvas draws, no RAF loop runs. The word reveal animation is handled separately by the existing `@layer base` `animation-duration: 0.01ms !important` override. No additional CSS is needed for the words.

**Alternatives considered:** `prefers-reduced-motion` media query on the video element via CSS (rejected: CSS cannot pause the `autoPlay` attribute; it fires at the media element level independent of CSS evaluation).

---

## DEC-024: Plain `<img>` vs `next/image` for Cloudinary URLs in Phase 6

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Phase 6 introduces static cover images for work cards, the feature showcase, and BW images for expertise cards. All images are served via Cloudinary CDN.

**Decision:** Plain `<img>` elements with Cloudinary URL transforms (`f_auto,q_auto`). `next/image` is deferred to Phase 14 when `next-cloudinary` is introduced.

**Consequences:** Cloudinary's `f_auto,q_auto` handles format negotiation (WebP/AVIF where supported) and adaptive quality at the CDN level. `loading="lazy"` on `<img>` achieves the same lazy-load benefit as `next/image`. No changes to `next.config.ts` are needed; `images.remotePatterns` is not required for plain `<img>`.

**Alternatives considered:** `next/image` with a Cloudinary custom loader (rejected: requires adding `res.cloudinary.com` to `images.remotePatterns` and configuring a loader to avoid double-transformation; added config complexity not justified until Phase 14).

---

## DEC-025: Pure-CSS duplicate-image glow for FeatureShowcase

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The feature showcase panel needs an image-derived blurred glow behind the main image frame, matching the v15 design.

**Decision:** Two `<img>` elements with the same `src`. The glow `<img>` is `aria-hidden`, absolutely positioned behind the frame, and styled with `filter: blur(80px) saturate(1.4); transform: scale(1.05); opacity: 0.55`. Cloudinary CDN sets `Cache-Control: public, max-age=31536000`, so the second element is served from memory cache with zero additional network cost.

**Consequences:** One HTTP request for the showcase image. No JavaScript overhead. CSS-only effect identical to the v15 design.

**Alternatives considered:** Canvas (rejected: correct for video sources like the showreel because frame content changes over time; for a static image, a CSS-filtered duplicate `<img>` is simpler with no JS overhead and produces identical output).

---

## DEC-026: `preload="metadata"` for expertise hover videos

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Eight expertise cards each have a hover-reveal video. The browser needs to know when to fetch video data.

**Decision:** Set `src` directly on the `<video>` element with `preload="metadata"`. The browser fetches metadata only (the moov box, approximately 5 to 30 KB per video depending on encoding) on page load; the full video streams on hover when `play()` is called.

**Cost:** With 8 expertise videos, total metadata cost is approximately 40 to 240 KB across 8 to 16 HTTP requests (single request per video if moov-at-start via faststart; two requests per video if moov-at-end). Cloudinary's `f_auto,q_auto` delivery typically applies faststart during transcoding, so expect 8 single requests. Verify with DevTools Network during local testing.

**Consequences:** Hover-to-play feels near-instant because the media element is already initialised. On reduced-motion devices, `matchMedia` in the `onHover` handler gates `play()` so no video ever starts. CSS guard also zeroes `.exp-card:hover .exp-video { opacity: 0 }` under `prefers-reduced-motion: reduce`.

**Alternatives considered:** IntersectionObserver + `data-lazy-src` (rejected: v15 uses this to delay even the metadata fetch until cards scroll into view; in React, implementing this cleanly for 8 individual cards requires either a context or ref-forwarding pattern that adds complexity not justified by the approximately 40 to 240 KB savings on a section that is below the fold but typically visible within seconds of arrival; remains available as a future optimisation in Phase 14's performance pass).

---

## DEC-027: Hardcoded data layer in `src/data/*` as Phase 10 placeholder

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Phase 6 needs project and expertise data. Phase 10 will introduce Keystatic as a CMS. The data must be structured in a way that makes Phase 10 a drop-in replacement.

**Decision:** `src/data/featured-work.ts` and `src/data/expertise.ts` export typed arrays. The TypeScript interfaces (`FeaturedWorkItem`, `ExpertiseItem`) are designed to match the Keystatic schema that Phase 10 will introduce.

**Consequences:** Phase 10 Keystatic migration becomes a change to the import source only, with no component rewrites. All Cloudinary URLs in the data files carry `// TODO: <slug>` comments so the placeholder-to-real-asset swap is mechanical and auditable.

**Alternatives considered:** Keystatic now (rejected: Phase 10 scope; installing Keystatic in Phase 6 pulls in CMS config, reader API, and a content directory that are not needed until the writing and projects pages exist).

---

## DEC-028: Transform-only animation for WhatIBring blobs

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The WhatIBring section has three ambient radial-gradient blobs that drift slowly in the background. Two CSS approaches exist: (a) animate `background-position` on a repeating gradient, or (b) animate `transform` on fixed-gradient elements.

**Decision:** Animate `transform` only (`translate` + `scale`). The radial gradient background is static. Only the element position and scale change.

**Consequences:** `transform` animations run entirely on the GPU compositor thread with zero paint and zero layout operations per frame. This is the correct performance path for long-running ambient animations on a page that already has 8 expertise cards and a canvas glow. Any future ambient background animation in this project must follow the same pattern.

**Alternatives considered:** `background-position` animation on a CSS gradient (rejected: triggers repaint on every frame, forcing the CPU to re-rasterize the gradient; expensive on low-end devices).

---

## DEC-029: `min()` for ContactCTA card width centring

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The ContactCTA card must respect the `--container-max` ceiling on wide viewports and stay inset from the viewport edge on narrow viewports, without a separate wrapper element.

**Decision:** `max-width: min(var(--container-max), calc(100% - 64px))` on `.contact-cta-card`. The outer `.contact-cta-section` provides only vertical padding.

**Consequences:** The card always has at least 32px clearance from the viewport edge (64px total inset / 2 sides) and never exceeds `--container-max`. One declaration replaces the `max-width` + horizontal `padding` pattern that would require compensating for the padding in width calculations. The outer section retains its standard `96px 32px` padding for vertical rhythm.

**Alternatives considered:** Outer section with `padding: 96px 32px`, inner card with `max-width: var(--container-max)` and no inset. Rejected because on narrow viewports the 32px section padding already provides the inset; `min()` keeps the card centred correctly without coupling the inset to the section padding value.

---

## DEC-030: `<article>` element for WhatIBringCard

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** WhatIBringCard renders a self-contained unit: PillBadge label, h3 headline, body paragraph, and a bullet detail list. A generic `<div>` would work, but a more specific semantic element is available.

**Decision:** Use `<article>` as the card wrapper.

**Consequences:** Each card is semantically self-contained, matching the HTML spec definition of `<article>` (independently distributable or reusable content). Screen readers surface `<article>` in the document outline alongside `<section>` and `<nav>`, improving navigability for assistive technology users. The element carries no visual difference; CSS targets the `.wib-card` class, not the element type.

**Alternatives considered:** `<div>` (rejected: loses semantic meaning with no benefit; `<article>` is more correct for self-contained content blocks). `<section>` (rejected: requires an accessible name; `<article>` does not).

---

## DEC-031: Discriminated-union ProjectBodyBlock for typed body content

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Case study body content needs to be authored in TypeScript for Phase 8 and migrated to Keystatic MDX in Phase 10.

**Decision:** Body content is typed as `ProjectBodyBlock[]` using a discriminated union with `type` as the discriminant: `'paragraph'`, `'heading'`, `'list'`, `'figure'`.

**Consequences:** `ProjectBody.tsx` exhaustively switches on `block.type`. Phase 10 Keystatic document field emits the same block structure; the renderer becomes a drop-in consumer with no schema migration. TypeScript exhaustiveness checking catches any new block type that lacks a renderer.

**Alternatives considered:** Plain string MDX rendered at runtime (rejected: requires a runtime MDX renderer dependency, adds bundle weight, and does not lock the schema for Phase 10).

---

## DEC-032: generateStaticParams with dynamicParams = false for case studies

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The portfolio has a small, curated set of projects with no per-user variation.

**Decision:** `/projects/[slug]/page.tsx` exports `generateStaticParams` to prebuild every slug at build time and `dynamicParams = false` to return 404 for any unrecognized slug.

**Consequences:** Every case study pre-renders as a static HTML file at build time. Unknown slugs return a hard 404 with zero server-side work. Build output lists every slug under "Generating static pages."

**Alternatives considered:** Dynamic SSR on demand (rejected: no per-user variation, no reason to defer rendering to request time for static editorial content).

---

## DEC-033: Null at nav boundaries instead of circular wrap

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The case study prev/next nav can either wrap circularly (last.next points to first) or return null at boundaries.

**Decision:** `getProjectNav` returns `null` at boundaries. CaseStudyNav handles null prev by showing a "All work" link to `/work`. Null next renders an empty grid cell.

**Consequences:** v15 behavior matched: v15 shows "Back" to the work index at the first project, not a link to the last project. Navigation is linear, not circular.

**Alternatives considered:** Circular wrap (rejected: deviates from the v15 visual source of truth; "All work" at the boundary is more useful than an unexpected jump to the last project).

---

## DEC-034: Single projects.ts source with featuredProjects derived via filter

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Phase 7 had a separate `featured-work.ts` for the four homepage cards. Phase 8 adds case study routes that need the full project data.

**Decision:** `src/data/projects.ts` is the single source of truth. `featuredProjects` is derived as `projects.filter(p => p.featured).slice(0, 4)`. `featured-work.ts` is deleted.

**Consequences:** One file to edit when adding or updating a project. The `featured` flag controls homepage visibility without data duplication. Schema is shared between the home page cards and the case study template.

**Alternatives considered:** Keeping both files in parallel (rejected: two sources of truth with no clear ownership boundary; any schema change requires touching both files).

---

## DEC-035: PlaceholderPage shared component for route placeholders

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Three routes (/about, /writings, /contact) need pages that exist and do not 404, but whose real content ships in later phases.

**Decision:** A `PlaceholderPage` server component provides the shared structure (h1, description, back link via PillButton) for all three.

**Consequences:** Three thin page files, one place to change if placeholder copy needs updating. When real content ships, each page simply stops using PlaceholderPage.

**Alternatives considered:** Inline the placeholder structure in each page (rejected: three copies of the same boilerplate with no benefit).

---

## DEC-036: No scroll-triggered reveal animations in Phase 9

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** v15 uses JS IntersectionObserver adding `.in` to `.reveal` elements on scroll. Phase 9 builds the About page without an animation library install (anti-goal).

**Decision:** No scroll animations ship in Phase 9. CSS `animation-timeline: view()` was considered but requires a client boundary or polyfill. The page content is fully readable without reveals.

**Consequences:** About page loads fully visible. Scroll-triggered reveals can be added in Phase 13 as progressive enhancement without touching the component structure.

**Alternatives considered:** Inline `useEffect` with IntersectionObserver (rejected: adds a client boundary to otherwise server-only components for a non-blocking visual effect).

---

## DEC-037: About portrait ships as CSS placeholder

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** v15 uses `background-image: var(--asset-cyberpunk)` on `.about-portrait`. No avatar asset exists yet.

**Decision:** `.about-portrait` renders as a gradient placeholder (`linear-gradient(145deg, ...)`) with the `.pwm` text overlay (SARIB / Lead UE5 Developer). When an image asset is provided, add `background-image: url(...)` to override.

**Consequences:** The two-column hero layout is preserved. The right column has visual weight even without a photo.

**Alternatives considered:** Omit the portrait column (rejected: the `about-hero-grid` two-column layout collapses without a right column; the layout is structurally dependent on both columns having content).

---

## DEC-038: AboutPillars uses module-level constants, not a data file

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The three engineering pillar cards are fixed copy. Keystatic Phase 10 manages project data, not editorial prose.

**Decision:** The three cards are defined as a `PILLARS` module-level constant in `AboutPillars.tsx`. No `src/data/engineering-pillars.ts`.

**Consequences:** No indirection for three fixed entries. Adding a fourth pillar is a design decision, not a data entry — the hardcoded array reflects that constraint.

**Alternatives considered:** Separate data file (rejected: indirection with no benefit at 3 entries; no CMS migration path for this copy).

---

## DEC-039: Timeline .now badge uses PillBadge component

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** The "Current" label on the active timeline entry in v15 uses the same 3D gradient pill style as Phase 2 PillBadge.

**Decision:** `TimelineEntry` uses `<PillBadge tone="grad-1">Current</PillBadge>` rather than a new `.now` CSS class. `tone="grad-1"` is the teal gradient, matching the v15 intent.

**Consequences:** Visual consistency with Phase 7 WhatIBring cards. One fewer CSS class to maintain.

**Alternatives considered:** CSS-only `.now` class (rejected: duplicates the 3D pill CSS already defined in @layer components).

---

## DEC-040: Keystatic storage mode is local-only

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Phase 10 migrates case study content from a hardcoded TypeScript array to Keystatic CMS. Two storage modes are available: local (content as git files, CMS UI only in dev) and GitHub (live editing on Vercel via OAuth).

**Decision:** Use `storage: { kind: 'local' }`. CMS UI accessible only in dev. Content committed to git, deployed statically.

**Consequences:** Editing requires a local dev environment. Vercel deployments use committed content files. No env vars required.

**Alternatives considered:** GitHub mode (rejected: requires OAuth app registration, KEYSTATIC_GITHUB_CLIENT_ID/SECRET, session secret, and a production /keystatic route — overhead with no benefit for a solo developer).

---

## DEC-041: fields.slug for slugField title, not fields.text

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Keystatic collection requires a `slugField`. When `fields.text` is used as the slug field, the reader returns `null` for that field at read time (the value is in `e.slug`, not `e.entry.title`). `fields.slug` returns the display name correctly.

**Decision:** Use `fields.slug({ name: { label: 'Title' } })` for the `title` field. At read time, `e.entry.title` returns the display name string ("Samurai Saga"). Content files store `title: Samurai Saga` — unchanged format from `fields.text`.

**Consequences:** Keystatic CMS title field generates slug from the name input. Display title available via `e.entry.title` without any transformation.

**Alternatives considered:** `fields.text` as slugField (rejected: returns `null` at read time, requires reading from `e.slug` which loses special characters like "TRESemmé").

---

## DEC-042: ProjectBody uses Markdoc rendering, not DocumentRenderer

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** `fields.markdoc` is Keystatic's current body field. `fields.document` (which works with `DocumentRenderer`) is deprecated and stores content in a non-readable format. `fields.markdoc` produces `.mdoc` files with readable YAML+Markdoc content.

**Decision:** Use `fields.markdoc` and render body via `Markdoc.transform()` + `Markdoc.renderers.react()` from `@markdoc/markdoc`. Custom node renderers for `list` and `item` emit `.case-list` and `.case-list-item` class names. Figure block uses a custom `Figure` tag.

**Consequences:** Body renders via the Markdoc AST pipeline. `ProjectBodyBlock` type and `groupBlocks` function are removed. CSS classes reused unchanged.

**Alternatives considered:** DocumentRenderer (rejected: only works with deprecated `fields.document`).

---

## DEC-043: Data layer exports are async functions

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** `createReader` from `@keystatic/core/reader` is async. No synchronous reader API exists.

**Decision:** Replace synchronous exports (`projects`, `featuredProjects`) with async functions (`getProjects`, `getFeaturedProjects`, `findProjectBySlug`, `getProjectNav`). Call sites become async Server Components.

**Consequences:** FeaturedWork, WorkIndex, and the case study page are now async. This is idiomatic Next.js App Router and has no performance implication.

---

## DEC-044: Writings collection added to Keystatic alongside projects

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Phase 11 adds a Writings layer (blog/notes). Content needs to live in git alongside projects.

**Decision:** Add a `writings` collection to `keystatic.config.ts` using `fields.markdoc` for the body and `fields.slug` for the slug title field. Storage path: `content/writings/*/`. Same conventions as the `projects` collection.

**Consequences:** `content/writings/` directory created. `/keystatic` admin UI now shows both Projects and Writings.

---

## DEC-045: WritingBody.tsx is separate from ProjectBody.tsx

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Case studies (`.case-body`) and posts (`.post-body`) have different typographic requirements. Posts need code blocks and blockquotes as first-class elements; case studies use ordered list groups.

**Decision:** Create `WritingBody.tsx` with its own Markdoc config that includes `fence` (code blocks) and `blockquote` node overrides. Wrapper class is `.post-body`. `ProjectBody.tsx` unchanged.

**Consequences:** Two files instead of one. Each can evolve independently.

---

## DEC-046: Reading time computed inline in the data layer

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Writing cards and post headers need an estimated reading time. Options: (1) add a reading-time npm package, (2) compute inline.

**Decision:** Walk the Markdoc AST recursively to extract `{ type: 'text', attributes: { content } }` leaf nodes and count words. Divide by 200 wpm, minimum 1 minute. No dependency added.

**Consequences:** `countWords` function in `writings.ts` is ~15 lines. Reading time is computed at read time and stored on `WritingItem`.

---

## DEC-047: RSS feed is a Next.js App Router route handler at /feed.xml

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Footer links `/feed.xml`. Options: (1) static file in `/public`, (2) route handler that generates fresh XML on each request.

**Decision:** Route handler at `src/app/feed.xml/route.ts`. Generates RSS 2.0 from published writings at request time. Returns `application/rss+xml; charset=utf-8`. Dots in directory names work in Next.js 16 with no special config.

**Consequences:** `/feed.xml` is dynamic (ƒ in build output). Cache-Control header set to 1 hour with stale-while-revalidate. Vercel edge caches the response.

---

## DEC-048: Draft writings are not publicly routable

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Writers draft posts before publishing. Status field has `published` and `draft` values.

**Decision:** `generateStaticParams` only includes slugs where `status === 'published'`. `dynamicParams = false` means any other slug returns 404. `/writings` index only shows published posts. RSS feed only includes published posts.

**Consequences:** Draft posts exist in `content/writings/` and are visible in the Keystatic admin UI but are not accessible via any public URL.

---

## DEC-049: Resend for email delivery

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form needs to deliver submissions to msarib.contact@gmail.com.

**Decision:** Use Resend (`resend` npm package, v6) as the email delivery provider. Domain `msarib.dev` verified via DKIM and SPF DNS records. Sender: `hello@msarib.dev`. `replyTo` set to submitter's email.

**Alternatives rejected:** AWS SES — requires IAM key management and more complex domain verification; overkill for portfolio volume. Nodemailer with SMTP — credential exposure risk; deliverability inconsistent without a dedicated sending service.

**Consequences:** Free tier (3000 emails/month) covers portfolio volume indefinitely. Email sending logic is isolated in `src/lib/email.ts` — swap to another provider by changing that file alone.

---

## DEC-050: Cloudflare Turnstile for bot protection

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form is publicly accessible and needs protection from automated submissions.

**Decision:** `@marsidev/react-turnstile` widget rendered in `ContactForm.tsx`. Token verified server-side in the Server Action via Cloudflare's siteverify endpoint. Widget uses `options={{ theme: 'dark', refreshExpired: 'auto' }}`. Ref-based `reset()` called on token verification failure so the widget refreshes without a page reload.

**Alternatives rejected:** Google reCAPTCHA v3 — fingerprints users across domains, conflicts with privacy posture. hCaptcha — less widely trusted widget; similar privacy trade-offs.

**Consequences:** No-JS submissions are blocked because Turnstile cannot render its widget without JavaScript. This is acceptable and documented. Turnstile is free with no monthly limit.

---

## DEC-051: Server Action over API route for contact form

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form submission needs server-side validation, rate limiting, Turnstile verification, and email delivery.

**Decision:** Form submission handled by a `'use server'` Server Action in `src/app/contact/actions.ts`. `useActionState` wires the action to the form in `ContactForm.tsx`.

**Alternatives rejected:** API route handler — requires a client-side `fetch` in `ContactForm.tsx`, losing progressive enhancement and splitting error handling across client and server.

**Consequences:** Progressive enhancement is native; the form submits as a standard HTML POST without client-side JavaScript (Turnstile blocks it, which is acceptable). No client-side fetch required.

---

## DEC-052: In-memory rate limiting — soft signal, not hard prevention

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form needs protection from casual repeat submissions.

**Decision:** `src/lib/rate-limit.ts` uses a `Map<string, number>` keyed by client IP. Checks before Turnstile verification. Records only on successful email delivery to avoid locking out users after service failures.

**Honest framing:** This is a soft signal, not hard abuse prevention. Vercel's serverless infrastructure starts new function instances on cold starts, resetting the Map. A determined attacker can bypass it by triggering many cold starts. Hard prevention comes from Turnstile (blocks automated submissions) plus manual monitoring of Resend dashboard email volume.

**Upgrade path:** Swap the body of `checkRateLimit` and `recordSubmission` to `@upstash/ratelimit` without changing call sites in the Server Action.

**Consequences:** Catches casual repeat submissions from the same IP within a 5-minute window. Adds no external dependency or account requirement.

---

## DEC-054: next-cloudinary CldImage for Cloudinary-hosted images

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** Phase 14 performance pass. All project thumbnails, covers, and gallery images are hosted on Cloudinary (`res.cloudinary.com/ddgwzcrim`). Using raw URLs with `next/image` serves images through the Next.js optimization proxy without f_auto or q_auto, delivering full-size PNG/JPG regardless of browser capabilities.

**Decision:** `next-cloudinary@6.17.5` installed. CldImage wrapper (`src/components/CldImageClient.tsx`) adds the `'use client'` boundary that next-cloudinary's package omits from its ESM bundle. All three image-rendering components migrated: `WorkCard.tsx` (thumbnails), `CaseStudyCover.tsx` (cover image branch), `CaseStudyGallery.tsx` (gallery image items). Public ID extracted via `cloudinaryPublicId()` in `src/lib/cloudinary.ts`.

**Alternatives rejected:** `getCldImageUrl` + `next/image` loader prop — functional but more verbose; loses CldImage's error-recovery hooks. Raw `next/image` with transformation segments in URL — fragile; transformations baked into stored URLs rather than applied at render time.

**Consequences:** f_auto delivers WebP/AVIF to supporting browsers. q_auto sizes quality to the rendered dimensions. `/projects/anime-stylized-action-tgs2024` LCP improved from 3.3s to 1.6s in local Lighthouse, reaching 100 mobile score. Production scores expected to be equal or better due to Cloudinary edge CDN co-location.

---

## DEC-055: CldImage requires 'use client' wrapper in Next.js App Router

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** `next-cloudinary`'s ESM bundle uses `useState` internally but does not include a `'use client'` directive. Next.js App Router treats it as a Server Component, causing `TypeError: useState is not a function` during SSG prerendering.

**Decision:** `src/components/CldImageClient.tsx` re-exports `CldImage` from a file that has `'use client'` at the top. All components that render CldImage import from this wrapper. The pattern is: Server Component renders the wrapper's exported component, which establishes the client boundary, and CldImage hydrates normally.

**Consequences:** CldImage is a client component boundary. WorkCard, CaseStudyCover, and CaseStudyGallery remain Server Components but render CldImage as a client subtree. No performance impact beyond the client JS chunk for CldImage itself (~27 KB, included once in the shared bundle).

---

## DEC-056: Font Cache-Control headers added for /fonts/*

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** Production curl revealed `cache-control: public, max-age=0, must-revalidate` on `/fonts/PPRightGrotesk-WideBlack.woff2` and `/fonts/PPRightGroteskText-Regular.woff2`. Vercel sets long-lived cache only on `/_next/static/` paths; files in `/public/` get `max-age=0` by default.

**Decision:** Added `headers()` function to `next.config.ts` setting `public, max-age=31536000` for `/fonts/:path*`. Omits `immutable` because font filenames are not content-hashed (they are manually uploaded to `/public/fonts/`). A year-long cache is appropriate for font files that change only during design-system overhauls.

**Consequences:** Browsers cache fonts for 1 year on first visit. Repeat visits load fonts instantly from disk. CLS from font-swap eliminated on repeat visits. If fonts are replaced, the URL must change (e.g., append version suffix) to bust the cache.

---

## DEC-057: @next/bundle-analyzer webpack mode incompatible with Next.js 16 + React Compiler

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** Bundle audit planned for Phase 14. `@next/bundle-analyzer` requires webpack mode (`ANALYZE=true TURBOPACK=0 pnpm build`). Next.js 16.2.6 has React Compiler on by default via Turbopack; webpack mode does not apply the same compiler pipeline, causing `TypeError: useState is not a function` during SSG with React Compiler's output.

**Decision:** `@next/bundle-analyzer` installed as a dev dependency and wired into `next.config.ts` (dormant unless `ANALYZE=true`). Webpack mode bundle generation is blocked by the React Compiler incompatibility. Bundle audit conducted via Turbopack build manifest inspection instead: public route JS is 446 KB uncompressed (~130 KB gzipped, estimated). Large 2.7 MB chunk (`markdown-it`, `entities`) is Keystatic admin only, not loaded on any public route.

**Consequences:** The ANALYZE=true build will fail until Next.js or @next/bundle-analyzer resolves webpack-mode React Compiler compatibility. The config wrapper is harmless in all normal builds and Vercel deployments.

---

## DEC-058: Lighthouse local scores are unrepresentative for CldImage CDN-served images

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** Post-CldImage Lighthouse runs against `localhost:3000` showed `/work` mobile at 81-86 (variable), down from baseline 90. Investigation revealed that CldImage URLs go directly to Cloudinary CDN (external internet request) while the prior `next/image` proxy served images from local disk. Under Lighthouse's Slow 4G simulation, the WSL2 → internet → Cloudinary path adds real-world latency on top of the simulated throttling. The baseline 90 score was architecturally privileged by the local proxy.

**Decision:** Accepted the local score discrepancy as a testing artifact. Authoritative scores come from running Lighthouse against the production Vercel URL (`node scripts/lighthouse.mjs https://msarib.dev`). The `/projects/anime-stylized-action-tgs2024` route reaching 100 mobile in local Lighthouse confirms CldImage performs correctly under production-realistic conditions (no prior next/image cache for those gallery images).

**Consequences:** Production Lighthouse runs required after each deploy to verify real-world scores. Local Lighthouse remains useful for regression detection on non-CDN metrics (TBT, CLS, accessibility, SEO) but should not be used as the sole gate for CDN-served image performance.

---

## DEC-059: Lighthouse local script + post-deploy production runs; CI integration deferred

- **Date:** 2026-06-05
- **Status:** Accepted

**Context:** Phase 14 adds `scripts/lighthouse.mjs` for measuring performance. Two options: local script only, or wire into CI (GitHub Actions + `lighthouserc.js`) to run on every PR.

**Decision:** Local script for Phase 14. CI integration deferred to a post-build-phases roadmap item. The local script covers the primary use case (pre-deploy verification and post-deploy production measurement). CI integration adds complexity without clear ROI at the current project stage.

**Consequences:** Lighthouse must be run manually before and after deploys. See "Future work" in AGENTS.md.

---

## DEC-053: Zod v3 for schema validation

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form needs schema validation shared between the Server Action and the `ContactFormState` type.

**Decision:** `zod@^3` (v3.25.76 installed). Schema in `src/lib/contact-schema.ts`. `safeParse()` + `error.flatten().fieldErrors` extracts per-field error arrays.

**Alternatives rejected:** Zod v4 — different API (`z.flattenError()` vs `error.flatten().fieldErrors()`); ecosystem tooling not fully updated at time of implementation. Manual validation — boilerplate, error-prone, not reusable.

**Consequences:** Pin to `^3` to stay on v3 minor/patch updates only. Migrate to v4 as a separate step when ecosystem catches up.

---

## DEC-060: Security headers via next.config.ts, CSP shipped in report-only mode

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Phase 16 production hardening. The site had no CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy headers. Only Vercel's default HSTS was present.

**Decision:** Security headers added via the `headers()` function in `next.config.ts` on the `source: '/(.*)'` matcher. CSP shipped with key `Content-Security-Policy-Report-Only` for the first week post-launch so violations are logged to the browser console without blocking resources. After one week of clean logs, the key flips to `Content-Security-Policy` (enforcing) in a follow-up commit.

**Alternatives rejected:** CSP enforcing on day one — too much risk of blocking Turnstile, Cloudinary, or YouTube embeds before violations are audited. Middleware (`proxy.ts`) — headers() in next.config.ts is simpler and sufficient.

**Consequences:** Browsers log CSP violations in the console during report-only week. After flip to enforcing, any unlisted source will be blocked client-side. Review violation logs before enforcing.

---

## DEC-061: Styled error pages replace Next.js defaults

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Visiting any non-existent URL served the Next.js default white 404 page, breaking the site's visual identity. No `error.tsx` or `global-error.tsx` existed.

**Decision:** Three error pages created: `src/app/not-found.tsx` (Server Component, 404), `src/app/error.tsx` (Client Component, segment errors), `src/app/global-error.tsx` (Client Component, root layout crash — imports `globals.css` directly since it bypasses the root layout). All use existing `.error-page*` CSS classes and the `PillButton` component.

**Consequences:** `global-error.tsx` must import `globals.css` itself. If the font or token CSS ever moves out of `globals.css`, `global-error.tsx` needs updating.

---

## DEC-062: Contact form 30-second timeout warning with fallback email CTA

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** The contact form Server Action has no client-side timeout. If the Resend API or Turnstile verification hangs, the user sees a spinning "Sending..." button indefinitely with no escape.

**Decision:** `ContactForm.tsx` tracks a 30-second `setTimeout` that activates when `isPending` becomes true. If still pending after 30 seconds, a `.form-warning-banner` renders below the error area with a direct mailto link as fallback. Timer clears on every `isPending` state change.

**Consequences:** The warning appears only under failure — not in the visual baseline. Offline detection and Turnstile-not-ready guards added as client-side submit interceptors using `navigator.onLine` and a `turnstileReady` state flag.

---

## DEC-063: Sitemap image:image entries for case study thumbnails

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** The sitemap omitted image data for project routes, reducing discoverability in Google Image Search.

**Decision:** Project routes in `sitemap.ts` include an `images` array with the cover image URL (or thumbnail URL if the cover is a video). Project `date` fields are human-readable quarter strings ("Q4 2022") so all project `lastModified` values use a pinned site-launch date (`2025-04-01`) rather than attempting to parse the display date.

**Consequences:** Sitemap image entries link to Cloudinary CDN URLs which are already listed in the CSP `img-src` directive.

---

## DEC-064: Bundle baseline committed as docs/BUNDLE_BASELINE.md

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** No baseline existed for bundle size regression detection. Next.js 16 + Turbopack does not output per-route "First Load JS" in the CLI build table (see DEC-057).

**Decision:** `docs/BUNDLE_BASELINE.md` records total `.next/static/` sizes and the top 8 largest JS chunks as of Phase 16. Alert threshold set at 5 MB for `.next/static/chunks/`. Per-route interactive analysis available via `pnpm next experimental-analyze`.

**Consequences:** Manual process — must be updated when bundle sizes shift materially.

---

## DEC-065: Pre-launch checklist as docs/PRE_LAUNCH_CHECKLIST.md

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Verification steps before public launch were informal and not written down. Multiple launch-critical checks (DNS, env vars, security headers, 404 page, contact form delivery) needed a repeatable format.

**Decision:** `docs/PRE_LAUNCH_CHECKLIST.md` created with Markdown checkboxes, grouped into infrastructure, smoke tests, performance, CSP monitoring, and optional sections. Includes full env var reference table.

**Consequences:** Needs manual updating if new env vars are added or launch criteria change.

---

## DEC-066: DNSSEC enabled on msarib.dev

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** msarib.dev had no DNSSEC. Without it, an attacker with access to the DNS path can return forged A records and redirect visitors to a malicious server. The .dev TLD (Google Registry) supports DNSSEC. Cloudflare had already enabled signing on their side (DNSKEY records were present) but the DS record had never been submitted to the registrar, leaving the chain incomplete.

**Decision:** Submit the DS record (Key Tag 2371, Algorithm 13, Digest Type 2) to Namecheap → Advanced DNS → DNSSEC. Full chain now verified: root → .dev TLD (DS=60074) → msarib.dev (DS=2371).

**Consequences:** If DNSSEC ever gets into a broken state (Cloudflare signing disabled but DS record still at Namecheap, or vice versa), the domain returns SERVFAIL for all resolvers doing DNSSEC validation. Rollback: remove DS record at Namecheap first, then disable at Cloudflare. See DNS_CONFIGURATION.md for the full rollback procedure.

**Alternatives considered:** Leave incomplete (rejected: half-enabled DNSSEC is worse than no DNSSEC because it fails validation but provides no security benefit).

---

## DEC-067: CAA records added with Cloudflare auto-injection accepted

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** No CAA records existed on msarib.dev, meaning any CA could issue a certificate for the domain. Three manual CAA records were added: `issue "letsencrypt.org"`, `issuewild ";"`, and `iodef "mailto:contact@msarib.dev"`. However, Cloudflare's free plan automatically injects additional CAA entries for DigiCert, Google Trust Services, SSL.com, and Comodo. These cannot be disabled without the Cloudflare Advanced Certificate Manager add-on (~$10/month).

**Decision:** Accept Cloudflare's auto-injected CAA entries. All 6 authorized CAs (Let's Encrypt, DigiCert, Google Trust Services, SSL.com, Comodo/Sectigo) are Tier-1, operate CT log compliance, and follow proper validation procedures. The `iodef` record routes unauthorized issuance reports to `contact@msarib.dev` regardless of which CA is involved.

**Consequences:** The manual `issuewild ";"` entry is superseded by Cloudflare's auto-injected wildcard entries. Restricting to Let's Encrypt only requires Cloudflare ACM (~$10/month). Documented as a future consideration in AGENTS.md.

**Alternatives considered:** Cloudflare ACM (deferred: $10/month is not justified for a personal portfolio at this stage).

---

## DEC-068: Cloudflare Email Routing for inbound mail on msarib.dev

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Inbound mail to `hello@msarib.dev` and `contact@msarib.dev` bounced — no MX records existed. Any recruiter replying to outbound email from Resend received a bounce. Cloudflare Email Routing provides free forwarding from custom domain addresses to a real inbox.

**Decision:** Enable Cloudflare Email Routing. Three rules forward `hello@`, `contact@`, and catch-all `@msarib.dev` to `msarib.contact@gmail.com`. Cloudflare auto-adds MX records and an SPF TXT record at the root domain. A Gmail filter on the destination inbox whitelists forwarded mail to bypass spam heuristics.

**Consequences:** The root domain SPF (`v=spf1 include:_spf.mx.cloudflare.net ~all`) is separate from Resend's SPF on `send.msarib.dev` (`v=spf1 include:amazonses.com ~all`). Both records coexist without conflict because they apply to different hostnames. Resend's DMARC alignment relies on DKIM, not SPF, so the separate SPF records do not affect deliverability.

**Alternatives considered:** Zoho Mail free tier (rejected: requires MX configuration and account management overhead; Cloudflare's free forwarding is simpler for a portfolio with no need for inbox features). Google Workspace (rejected: cost).

---

## DEC-069: DMARC p=none baseline policy

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** A bare `v=DMARC1; p=none;` record existed without a `rua` reporting address. No aggregate reports were being collected. The policy was monitor-only but provided no visibility.

**Decision:** Edit the existing record to `v=DMARC1; p=none; rua=mailto:contact@msarib.dev; aspf=r; adkim=r`. Aggregate reports now route to `contact@msarib.dev` (forwarded to Gmail). `aspf=r` (relaxed SPF alignment) accommodates Resend's `send.msarib.dev` MAIL FROM subdomain. `adkim=r` (relaxed DKIM alignment) is standard.

**Consequences:** `p=none` is monitor-only. No mail is rejected or quarantined. Upgrade path: after one to two weeks of clean aggregate reports confirming no legitimate senders are failing, change to `p=quarantine`, then `p=reject`. This is a one-line edit to the TXT record value in Cloudflare DNS.

**Alternatives considered:** `p=quarantine` from day one (rejected: risk of legitimate Resend mail being quarantined before confirming alignment works end-to-end).

---

## DEC-070: docs/DNS_CONFIGURATION.md as single source of truth for DNS state

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** No document captured the DNS configuration. Every record existed only in the Cloudflare dashboard. Making a change required either remembering the current state or inspecting the dashboard before acting, with no audit trail.

**Decision:** `docs/DNS_CONFIGURATION.md` records every DNS record, its value, its purpose, DNSSEC status, CAA state, email configuration, and the change procedure. Updated whenever a DNS change is made. Committed to the repo alongside the change that prompted it.

**Consequences:** The file can become stale if DNS changes are made without updating it. The change procedure in the file itself documents this requirement. DNS exports to `~/dns-backups/` (outside the repo) supplement the file for emergency rollback.

---

## DEC-071: CSP enforcement deferred until site is feature-complete

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Phase 16 shipped the Content Security Policy in `Content-Security-Policy-Report-Only` mode. Phase 18 console sweep across all 7 routes (including 404) found zero actual CSP violations (no "Refused to load" messages, no blocked resources). The only console noise was the browser's structural warning that `upgrade-insecure-requests` is ignored in report-only mode, which is per-spec behavior. The CSP is technically ready to enforce.

**Decision:** Keep CSP in `Content-Security-Policy-Report-Only` mode and defer enforcing until the site is feature-complete. Pending items that could introduce new external sources requiring CSP updates: real ExpertiseCard videos (8 clips, uploaded to Cloudinary), resume PDF regeneration, and any Phase 19 additions. Flipping to enforcing mid-feature-work risks breaking new features that need directive updates.

**Consequences:** Resources are not blocked during this window. The report-only mode is the intended pre-launch state. When ready to flip: change `key: 'Content-Security-Policy-Report-Only'` to `key: 'Content-Security-Policy'` in `next.config.ts` (identify by content match, not line number). Re-sweep all routes after the flip. See `docs/CSP_VIOLATION_LOG.md` for the flip checklist.

**Alternatives considered:** Flip to enforcing in Phase 18 (rejected: Future Work items may add new external sources that would be silently blocked in enforcing mode, discovered only when a recruiter hits the live site).

---

## DEC-072: Resume PDF retained as-is for v1.0.0 launch

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Phase 18 resume audit extracted link annotations from `public/resume.pdf` (76 KB, created 2026-05-18). GitHub link confirmed absent (correct — Perforce is games industry VCS standard). LinkedIn, YouTube, portfolio, and project links present. One code fix applied: `download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf"` attribute added to all three resume link components (`Footer.tsx`, `ContactCTA.tsx`, `Timeline.tsx`) so the browser saves the file with the full descriptive name rather than `resume.pdf`. Body text could not be verified programmatically (no pdftotext available); five pending manual checks are documented in `docs/RESUME_FOLLOWUP.md` (searchable text, displayed date, SwiftNine role, email in body, all links resolve).

**Decision:** Ship the PDF as-is for v1.0.0. The pending manual checks are low-risk (the PDF was generated intentionally three weeks before launch and used in the Resend test email without reported issues). Regeneration from source DOCX is deferred until a role or detail changes, or a pending check fails.

**Consequences:** `docs/RESUME_FOLLOWUP.md` tracks the open items. When the real ExpertiseCard videos ship or a new role is added, regenerate and replace `public/resume.pdf`.

**Alternatives considered:** Regenerate from DOCX before launch (deferred: no issues found that warrant regeneration; DOCX round-trip introduces formatting risk).

---

## DEC-073: v1.0.0 annotated git tag marks production launch state

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** The site is shipping publicly after Phase 18. A stable reference point is needed so that any future regression investigation, rollback, or "what was live at launch" question has a precise answer in git history.

**Decision:** Create an annotated tag `v1.0.0` on the Phase 18 commit. Annotated (not lightweight) so the tag carries a message and is preserved as a first-class git object. SemVer 1.0.0 signals the site is production-complete with no known blocking issues.

**Consequences:** Future feature releases will be tagged `v1.1.0`, `v1.2.0`, etc. Bug fixes to production will be `v1.0.1`, etc. The tag is pushed to `origin` so it is visible in the GitHub remote.

**Alternatives considered:** `v1.0.0-launch` suffix (rejected: redundant; the tag message carries the launch context); no tagging (rejected: no rollback anchor).

---

## DEC-074: Full device matrix testing deferred to post-Phase 19 polish phase

- **Date:** 2026-06-06
- **Status:** Accepted

**Context:** Phase 18 planned systematic testing across 8 device/browser combinations (Win Desktop x2 with Chrome/Edge/Firefox, HP G4 laptop Chrome, Pixel 8 Pro Chrome, iPhone X iOS 18 Safari, iPhone 14 Plus iOS 26 Safari, MacBook Pro M1 macOS Tahoe Safari). At launch, testing was completed on 1 mobile device and 1 desktop (Chrome), which confirmed the site functions. Full matrix coverage was not completed within the Phase 18 window.

**Decision:** Ship at v1.0.0 with partial device coverage. The 1 mobile + 1 desktop baseline confirms core functionality. Full matrix testing is scheduled for the post-Phase 19 polish phase. The 8-device inventory is documented and the test plan is in the Phase 18 plan file.

**Consequences:** Undiscovered device-specific rendering issues (iOS Safari backdrop-filter, low-spec Chrome performance, Edge-specific layout quirks) may exist. Any issues found during ad-hoc use before the systematic test phase should be filed as bugs and fixed before the next outreach push.

**Alternatives considered:** Block launch until all 8 devices are tested (rejected: core functionality confirmed; marginal risk of undiscovered layout bugs does not outweigh the cost of delaying a time-sensitive outreach window).

## DEC-075 -- Phase 19.1 content corrections, Convai removal, and BuiltWith investigation
**Date:** 2026-06-08
**Context:** Three experience data errors survived the v1.0.0 launch: Vmmersion role title
  showed "Unreal Engine Developer" (correct: "Lead Software Developer"), both Exarta
  location entries showed "Lahore (Remote)" (correct: on-site). PROFESSIONAL_HISTORY.md had
  matching stale data. BuiltWith reported GitHub references (source: Convai case study SDK
  link) and a German Commercial Register Number (false positive). The Convai NPC Integration
  case study had no images and no video; it weakened the /work grid as an incomplete
  placeholder.

**Decision:** Apply three field corrections to src/data/experience.ts. Replace both stale
  PROFESSIONAL_HISTORY.md copies (root and docs/) with a new authoritative version at
  docs/PROFESSIONAL_HISTORY.md (kept gitignored). Remove Convai NPC Integration case study
  entirely (content/projects/convai-npc-integration/ and _staging-content version). Remove
  Convai slug from E2E test suites. Document BuiltWith findings in
  docs/EXTERNAL_TOOL_FALSE_POSITIVES.md. Add phased-rewrite notice to README.md and fix
  all em-dashes.

**Consequences:** About page timeline is accurate. PROFESSIONAL_HISTORY.md is the confirmed
  canonical source with no known mismatches against experience.ts. /work grid shows 8 case
  studies. BuiltWith GitHub detection resolves after next crawl. German Commercial Register
  false positive documented for reference. README has zero em-dashes.

**Alternatives considered:** Remove only the Convai SDK GitHub link, keep the case study.
  Rejected because the case study had no visual assets and weakened the /work grid quality.

---

## DEC-076 -- Phase 19.2 CSS layout and spacing fixes
**Date:** 2026-06-08

**Context:** Four post-launch visual defects found on msarib.dev:
  1. Footer brand column: SLogo and LahoreClock flowed side-by-side because both are
     inline-flex in a block container; "Lead UE5 Developer" appeared inline after "SARIB"
     because .s-logo-text .sub was display:inline-block.
  2. Case study link pills: .case-links had no container constraint (no max-width,
     padding, or margin-inline:auto), causing pills to span edge-to-edge while all
     adjacent sections (.case-hero, .case-media, .case-body) had container bounds.
  3. About Experience timeline: .exp-row.current background used
     radial-gradient(ellipse 70% 110% ...). The 70% horizontal extent is narrower than
     the element, producing a visible hard edge at left and right of the current row.
  4. Home expertise grid: on card hover, .exp-card:hover applies
     box-shadow: 0 0 80px var(--card-glow). With only 32px of section horizontal padding,
     the 80px glow on edge cards extends 48px past the section boundary and is hard-clipped
     by body { overflow-x: clip }, producing a sharp cutoff at the viewport edge.
     (Investigation in Phase 19.2 Step E confirmed: not a CSS background gradient --
     a box-shadow glow clipped by the body overflow rule.)

**Decision:**
  D1. Footer: add .footer-brand wrapper (display:flex; flex-direction:column). Scope
      .s-logo alignment and .sub display:block override to .footer-brand to avoid
      affecting the Nav SLogo.
  D2. Case links: add max-width:var(--container-max), margin-inline:auto,
      padding-inline:32px to .case-links. Mobile breakpoint: padding-inline:20px.
  D3. About gradient: widen .exp-row.current ellipse from 70% to 120%. At 120% the
      gradient extends past element bounds and the transition to transparent occurs
      outside the visible area, eliminating the hard edge. Also update the
      @supports not (color-mix) fallback at same percentage.
  D4. Home expertise glow: add horizontal mask-image to .expertise-section. Both
      -webkit-mask-image and mask-image with linear-gradient(to right, transparent 0%,
      #000 3%, #000 97%, transparent 100%). The 3% fade zone is ~48px on a 1600px
      container, matching the glow overhang. Matches the .wib-bg vertical masking
      pattern already in the codebase.

**Consequences:** No new dependencies. Single commit. Footer brand renders as three-line
  hierarchy. Case link pills are bounded within the container. Experience and expertise
  glows/gradients fade smoothly at section edges.

**Alternatives considered:**
  D3: Use a ::before pseudo-element with z-index for the gradient. Rejected -- ellipse
  widening is simpler and requires no z-index or position changes.
  D4: Increase .expertise-section horizontal padding from 32px to 96px (Option B).
  Rejected -- smuggles a layout change into a glow fix, shrinks all cards, creates visual
  inconsistency with other home sections. Mask is the minimal-change approach.

**Future reference:** When investigating gradient or glow cutoff at section edges,
  determine which mechanism applies before choosing the fix:
  - CSS background radial-gradient with limited horizontal extent: widen the ellipse axis.
  - box-shadow glow clipped by ancestor overflow rule: add horizontal mask-image to the
    section container.

## DEC-077 -- Phase 19.3 atmospheric SVG gradient replaces radial-gradient blobs
**Date:** 2026-06-09

**Context:** The home "What I bring to your team" and about "How I think about the work"
sections used an animated radial-gradient blob mechanism (Phase 7). Three blobs used
mix-blend-mode: screen with teal, purple, and indigo colors. The mechanism was functional
but produced a multi-color glow that diverged from the single-teal brand palette.

**Decision:** Replace both instances with a new reusable AtmosphericGradient component:
  - 5 SVG circles in teal only (rgba(0,217,196) at 0.35, 0.25, 0.20, 0.15, 0.12 opacity),
    positioned asymmetrically across a 1200x600 viewBox.
  - CSS keyframe animations on each circle using translate3d() (GPU compositor path, no
    layout-triggering properties). Durations 20s, 25s, 30s, 35s, 28s -- non-integer
    multiples so the pattern never perfectly repeats.
  - filter: blur(100px) on the SVG element itself converts the circles into a diffuse
    atmospheric wash. Note: backdrop-filter on a sibling was tried first but excludes
    elements in the same stacking context from its backdrop, making it ineffective here.
    filter: blur() as an output filter on the SVG is the correct pattern.
  - Vertical mask-image on the wrapper fades the wash into the page background at top
    (0% to 8%) and bottom (92% to 100%).
  - Cards (.wib-card, .t-card) gain backdrop-filter: blur(20px) to produce frosted-glass
    panels above the wash.
  - Responsive blur reductions: 60px at max-width 900px, 40px at max-width 600px.
    Two smallest circles hidden at 600px. Mitigates integrated GPU cost on low-spec devices.
  - prefers-reduced-motion: animations stopped; circles remain visible and static.

**Why all-teal:** The prior multi-color (teal + purple + indigo) mechanism diluted brand
  signal. A single-hue teal wash produces a cohesive atmospheric effect. If the all-teal
  result reads as too monotone after live review, a warm complement can be introduced in
  a follow-up phase at low opacity.

**Consequences:** Old .wib-bg, .wib-blob3, .three-card-bg/.blob3 CSS and keyframes
  (wib-drift1/2/3, about-blob-drift) removed. Component is a Server Component (no
  "use client"). Reused identically on both home and about pages.

**Alternatives considered:**
  Using backdrop-filter on a sibling div (as in the UE reference pattern). Rejected --
  the stacking context boundary between the SVG and the blur sibling means the
  backdrop-filter sees only the parent section background, not the SVG circles.
  filter: blur() on the SVG is functionally equivalent and simpler.

## DEC-078 -- Phase 19.5 cursor scope expansion: root layout + CursorMount
**Date:** 2026-06-09

**Context:** The custom cursor (Cursor.tsx) was mounted only in src/app/page.tsx (home page).
Issue #15 required it on all portfolio pages except /keystatic. Two approaches evaluated:
(A) root layout + thin CursorMount client component using usePathname to exclude /keystatic;
(B) create a (site) route group wrapping all non-keystatic routes with a layout that mounts
the cursor directly.

**Decision:** Option A. Create CursorMount.tsx ("use client"), use usePathname() to return
null when the path starts with /keystatic, otherwise render <Cursor />. Mount CursorMount
as the first child of <body> in src/app/layout.tsx. Remove cursor mount from page.tsx.

**Rationale:** No route groups currently exist in src/app/. Creating (site)/ would require
moving every route directory (work, about, contact, writings, projects, etc.) into the group.
High restructuring cost for a decorative cursor with no functional benefit over the conditional
render. The usePathname check is explicit, low-risk, and easy to extend if additional routes
need exclusion in future.

**Consequences:** Cursor mounts once per session and persists across soft navigations (no
flicker between routes). The rAF loop runs on all portfolio pages instead of just the home
page -- the existing (hover: hover) and (pointer: fine) and prefers-reduced-motion guards
already cover touch devices and accessibility.

**Alternatives considered:**
  Route group approach (B) rejected due to restructuring cost.
  Mounting cursor in every page.tsx individually rejected -- duplicates logic and would
  miss any new pages added in future.

## DEC-079 -- Phase 19.6.1 interactive Gallery component and Keystatic authoring
**Date:** 2026-06-09

**Context:** Case studies rendered media through `CaseStudyGallery.tsx`, a static CSS grid
handling three types (image, YouTube, Instagram-as-external-link) with no fullscreen, no
keyboard support, and no real Instagram embed. Phase 19.6.1 builds a new interactive Gallery
supporting six media types, authorable inline via Keystatic, and proves it end to end on one
case study (anime-stylized-action-tgs2024). The other seven stay on the legacy component until
19.6.2; Exarta UEFN is reserved for 19.6.3.

**Decision:**
  - Authoring mechanism: a new inline Keystatic markdoc component block (`Gallery`) in
    `projects.body.components`, not a new top-level frontmatter field. The block schema is
    `fields.array(fields.conditional(fields.select, { ...six types }))` using the repo's
    positional Keystatic API (0.5.50), mirroring the existing top-level `gallery` field.
  - Serialization (verified empirically via the live editor before migrating real content):
    Keystatic writes the block as a self-closing markdoc tag
    `{% Gallery items=[{discriminant: "image", value: {...}}, ...] /%}`. `ProjectBody` declares
    the tag with `attributes: { items: { type: Array } }` and a server `GalleryBlock` wrapper
    normalizes the raw `{ discriminant, value }` array into the typed `MediaItem` union
    (`src/components/Gallery/normalize.ts`) before handing off to the client `Gallery`.
  - Fallback (held in reserve, not used): if the nested-conditional markdoc serialization had
    proven fragile, galleries would have rendered from the top-level frontmatter field instead.
    The empirical round-trip passed, so the inline block is the shipped path.
  - Component boundary: `Gallery` is a client component (state, portal, listeners). The
    `GalleryBlock` wrapper in `ProjectBody` is server. Images use the existing `CldImage`
    client wrapper; video/gif use raw `<video>` with Cloudinary `f_auto,q_auto`.
  - Six types: image, video (Cloudinary MP4), gif (Cloudinary, delivered as autoplay-loop MP4),
    youtube (privacy-enhanced youtube-nocookie, click-to-activate), instagram-reel,
    instagram-post (both lazy-load `embed.js` only on first activation).
  - Focus trap: custom `useFocusTrap` hook mirroring the proven MobileMenu pattern (no new
    dependency). MobileMenu keeps its own inline copy for now; consolidation is a future option.
  - `--z-overlay: 200` token for the fullscreen modal: above nav (100), below the site cursor
    (9999) so the cursor still floats over the modal.
  - Platform icon overlays on thumbnails (Addition A): YouTube and Instagram thumbnails get the
    respective Simple Icons glyph (CC0) in a dark chip bottom-right; Cloudinary video/gif get a
    generic play triangle; static images get none. Instagram items with no `thumbnailUrl` show a
    brand-neutral gradient tile with a REEL/POST label plus the icon overlay.
  - Performance: thumbnails lazy except current +/- 1; current main image eager via
    `loading="eager"` (not `priority`, which emits an unused preload link since the gallery is
    below the fold and never the LCP element); neighbor image prefetch via hidden CldImage that
    matches the main request URL; iframes `loading="lazy"`; Instagram script injected once on
    first activation only.
  - All-six-type verification surface: the internal `/design-system` page (already noindex and
    already disallowed in `robots.ts`) carries a six-item demo matrix plus a debug table.

**Consequences:** The new Gallery and the legacy `CaseStudyGallery` coexist during 19.6.1. After
19.6.2 migrates the remaining case studies, the legacy component and the top-level `gallery`
field can be retired.

**CSP note (for the future report-only to enforce flip, DEC-071):** Instagram embeds load
`https://www.instagram.com/embed.js` and frame `https://www.instagram.com/...`. Under the current
report-only CSP this logs a `frame-src` violation (and a `script-src`/`connect-src`/`img-src`
need) without blocking, so the embed works today. Before flipping CSP to enforce, add
`www.instagram.com` (and `*.cdninstagram.com` for media) to `script-src`, `frame-src`,
`connect-src`, and `img-src`. Logged here and in `docs/CSP_VIOLATION_LOG.md`.

**Known minor item (pre-existing, not introduced here):** the site's fixed nav overlaps the
Keystatic admin toolbar's Create/Save button because `/keystatic` renders inside the site layout.
Workable (scroll or submit), out of scope for 19.6.1.

## DEC-080 -- Phase 19.6.2 Gallery rollout and ImageGrid (prose-image grid)
**Date:** 2026-06-10

**Context:** Phase 19.6.1 (DEC-079) proved the interactive `Gallery` block on one case study. Phase
19.6.2 rolls it out to six more (xandar, character-creator-system, nvidia-ai-assistant,
exarta-metaverse, samurai-saga, tresemme-tresverse), leaving Exarta UEFN for 19.6.3. tresemme also
carried four inline press-coverage images in its body that are prose illustrations, not gallery
media. They needed a static grid in place, not migration into the carousel.

**Decision:**
  - New `ImageGrid` component (`src/components/ImageGrid.tsx`): a Server Component (no `"use client"`)
    that renders an array of images as a CSS Grid (`repeat(2, 1fr)`, stacking to one column below
    600px). It is the prose-image counterpart to `Gallery`. The distinction is deliberate:
    `Gallery` is interactive (stateful carousel, thumbnail strip, fullscreen modal, keyboard nav, six
    media types including embeds); `ImageGrid` is static layout only (no state, no carousel, no
    fullscreen, images only). Use `Gallery` for an ordered media set the visitor browses; use
    `ImageGrid` for fixed-position body illustrations.
  - Authoring: a new `ImageGrid` Keystatic markdoc block in `projects.body.components`, alongside
    Figure, YouTubeEmbed, InstagramEmbed, and Gallery. Schema is a flat
    `fields.array(fields.object({ src, alt, caption }))`, not a conditional. Because it is a plain
    object array (not `fields.conditional` like Gallery), it serializes as bare
    `{src, alt, caption}` objects, with no `{discriminant, value}` wrapper. Verified empirically in
    the live editor before authoring real content: a hand-authored block parsed into the field-level
    editor (item rows labelled by alt), rendered as a 2-column grid, and round-tripped through Save.
    `ProjectBody` registers the tag (`items: { type: Array }`) with a server `ImageGridBlock` wrapper
    that runs raw items through `normalizeImageGridItems` (drops rows with empty `src`).
  - Image rendering reuses the proven `CldImage` + `cloudinaryPublicId` path from the Gallery's
    `MediaRenderer`. No new dependencies.
  - Migration mechanics (per case study): empty the top-level `gallery:` frontmatter array to
    `gallery: []`, then add one `{% Gallery items=[...] /%}` block in the body after `## Results`,
    before `## Tech stack` (the anime reference placement). Legacy `image`/`video`/`instagram`
    discriminants remap to the block's `image`/`youtube`/`instagram-reel`. All legacy YouTube IDs were
    already bare 11-char strings (including `-r0T5lvrP2o`, preserved verbatim); all legacy Instagram
    permalinks were `/reel/` URLs mapping to `instagram-reel`.
  - Instagram reels carry `aspectRatio: "9/16"` (confirmed with Sarib) so the gallery main frame and
    the loaded embed render in portrait, not 16/9 letterboxed. Verified: the `gallery-main-frame`
    computes `9 / 16` for reel items and the activated `instagram.com/.../embed/` iframe sits inside
    that portrait frame.
  - YouTube embeds at scale (exarta-metaverse, 7 items): the Gallery mounts only the current item in
    the main display, so navigating away unmounts the prior iframe. Maximum one embed iframe exists at
    any time, which makes simultaneous audio playback impossible. No mitigation needed beyond the
    existing single-main-item architecture.
  - Safety net (confirmed with Sarib): the top-level `gallery:` schema field and
    `CaseStudyGallery.tsx` stay defined but unused on the migrated studies (each now `gallery: []`).
    Both are retired in a post-19.6.3 cleanup once all eight studies, including the UEFN restructure,
    are verified clean.
  - `/design-system` gains a permanent four-image ImageGrid demo (one captioned) for regression
    coverage, mirroring the Gallery demo matrix.

**Count correction (vs the 19.6.2 plan):** the plan labelled character-creator-system "1 youtube + 6
image"; the source frontmatter actually held 1 video + 7 images (Character_Creator_1 through _7). All
seven images were migrated (no image dropped); the accurate count is 1 youtube + 7 images.

**Pre-existing state noted:** exarta-uefn-portfolio already carried `gallery: []` before this phase
(it does not use the legacy gallery field). It was left untouched, reserved for 19.6.3.

**Consequences:** Seven of eight case studies now render media through the interactive `Gallery`;
tresemme additionally renders its press images through `ImageGrid`. Legacy `CaseStudyGallery` is now
unused on those seven. CSP note from DEC-079 still applies: Instagram embeds log report-only
`frame-src`/`script-src` violations without blocking; account for `www.instagram.com` and
`*.cdninstagram.com` before flipping CSP to enforce.

## DEC-081 -- Phase 19.6.3 Exarta UEFN media migration and multi-gallery-per-page policy
**Date:** 2026-06-10

**Context:** Phase 19.6.3 closes the 19.6 trilogy by migrating the last case study,
exarta-uefn-portfolio, off inline `{% YouTubeEmbed %}` tags and raw `![](url)` markdown images. Unlike
the seven studies in DEC-080, UEFN groups its media under six sub-projects (Enigmara, Clumsy Champions,
Exarta HQ, Sands of Glory, Frightmare, CR-ICE-IS), with a tournament teaser nested inside Enigmara. It
is the first production page to mount multiple `Gallery` instances (seven), which raised three
multi-gallery concerns: keyboard scoping, performance, and state isolation.

**Decision:**
  - Per-sub-project in-place migration, not one consolidated block. Each sub-project keeps its media at
    its existing position: one `{% Gallery %}` block replaces the inline media between the sub-project
    description and its "Play on Fortnite" island-code line. The Enigmara tournament teaser is its own
    separate single-item Gallery inside the `#### The tournament` subsection, so it stays in narrative
    context rather than folding into the main Enigmara gallery. Seven blocks total, 35 items: Enigmara
    main (4 youtube + 10 image), Enigmara tournament (1 youtube), Clumsy Champions (7 image), Exarta HQ
    (5 image), Sands of Glory (6 image), Frightmare (1 image), CR-ICE-IS (1 image). This differs from
    DEC-080's single-block-after-Results placement because UEFN's media is meaningfully grouped, not one
    set the visitor browses end to end.
  - Cover/trailer duplication is intentional. The cover (`youtubeId: o8NW4gXP_Cc`) also appears as the
    first item of the Enigmara main gallery. The cover serves the `/work` card; the gallery item serves
    in-page browsing. Confirmed with Sarib; not a bug.
  - Single-item galleries over Figure for Frightmare, CR-ICE-IS, and the tournament teaser, for
    consistency across all sub-projects. A single-item Gallery hides the thumbnail strip and chevrons
    (`GalleryThumbnails` returns null at `count <= 1`), rendering just the main frame and the fullscreen
    expand control. Verified in the live DOM.
  - Multi-gallery keyboard scoping (CONCERN 1): no code change needed, the architecture already handles
    it. The `useGalleryKeyboard` handler (Arrow/Home/End/Escape) is attached only to the fullscreen
    modal container (`GalleryFullscreen`), never to the inline gallery root. Inline strips have zero
    arrow-key listeners, so N inline galleries in the viewport at once cannot cross-fire on arrow keys;
    they navigate only by click and swipe. Arrow navigation is live only inside an open fullscreen
    modal, and fullscreen is one-at-a-time (focus trap, scrim, body scroll lock prevent a second modal
    opening before the first closes). This is option (c) from the 19.6.3 plan, in place since 19.6.1.
    The misleading comment in `useGalleryKeyboard.ts` (which claimed the handler attaches to "the inline
    gallery root and the fullscreen modal") was corrected to prevent a future reader from wiring it onto
    the inline root and reintroducing the conflict.
  - State isolation (CONCERN 3): confirmed correct. Each `Gallery` owns its `useReducer`, provider,
    `useInViewport` observer, and `createPortal` target, so there is no shared state across instances.
    Body scroll lock lives in the fullscreen mount/unmount effect; with one fullscreen at a time there is
    no nested lock. Instagram's `window.instgrm` lazy-load does not apply (UEFN is all youtube and
    Cloudinary images). Verified on `/design-system`: opening one gallery's fullscreen, arrowing, and
    closing leaves the other galleries' inline state untouched and restores body scroll each time.
  - Policy: the `Gallery` component supports N instances per page, verified on UEFN (7 instances, 35
    items). `/design-system` gains a permanent two-gallery regression surface (Gallery X and Gallery Y,
    two items each, both in viewport) so this property has ongoing coverage.

**Performance note (CONCERN 2):** with 7 galleries, each gallery's main-frame image and eager-neighbor
thumbnails preload, and the 6 below-fold galleries' preloads trigger browser "preloaded but not used
within a few seconds" advisories (non-blocking, not errors). The single console error on the page is the
pre-existing site-wide CSP `upgrade-insecure-requests` report-only notice, unrelated to this phase.
Lighthouse Mobile target is > 86 (a 5-point regression budget from tresemme's 91). If a real budget
violation shows up, mitigation options are lazy-mounting below-fold galleries, reducing neighbor
prefetch from current +/- 1 to current only, or a more aggressive Cloudinary thumbnail quality tier; do
not pre-apply.

**Safety net unchanged:** `gallery:` frontmatter stays `[]` and `CaseStudyGallery.tsx` stays defined but
unused, per DEC-080. With all eight studies now migrated, the post-19.6.3 cleanup that removes both can
proceed in a later phase (not 19.6.3 scope).

**Consequences:** All eight case studies now render media through the interactive `Gallery`. The 19.6
Gallery trilogy is complete.
