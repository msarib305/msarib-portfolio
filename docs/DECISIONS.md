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

## DEC-053: Zod v3 for schema validation

- **Date:** 2026-05-20
- **Status:** Accepted

**Context:** Contact form needs schema validation shared between the Server Action and the `ContactFormState` type.

**Decision:** `zod@^3` (v3.25.76 installed). Schema in `src/lib/contact-schema.ts`. `safeParse()` + `error.flatten().fieldErrors` extracts per-field error arrays.

**Alternatives rejected:** Zod v4 — different API (`z.flattenError()` vs `error.flatten().fieldErrors()`); ecosystem tooling not fully updated at time of implementation. Manual validation — boilerplate, error-prone, not reusable.

**Consequences:** Pin to `^3` to stay on v3 minor/patch updates only. Migrate to v4 as a separate step when ecosystem catches up.
