# Design System

Canonical visual spec for msarib.dev. Every value here comes from `portfolio_design_v15.html` (the single-file SPA that is the source of truth). Do not introduce values not present in v15 without explicit approval. Do not re-litigate locked decisions silently.

---

## Colour tokens

Defined in `src/app/globals.css` inside `@theme {}` under the `--color-*` namespace. Tailwind v4 generates utilities from these (e.g. `bg-bg`, `text-accent`, `border-border-faint`). The default Tailwind colour palette is reset (`--color-*: initial`) before these are defined.

### Surfaces

| CSS variable | Value | Purpose |
|---|---|---|
| `--color-bg` | `#101014` | Base background. Locked. |
| `--color-bg-low` | `#18181c` | Slightly elevated surface. Locked. |
| `--color-bg-high` | `#202024` | Further elevated surface. Locked. |
| `--color-bg-hover` | `#28282c` | Hover state surface. |

### Text

| CSS variable | Value | Purpose |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Body copy, headings. |
| `--color-text-secondary` | `rgba(255, 255, 255, 0.65)` | Secondary labels, subtitles. |
| `--color-text-muted` | `rgba(255, 255, 255, 0.35)` | Disabled text, timestamps, footnotes. |

### Accent (teal)

Primary brand colour. Locked. Never substituted with Unreal blue or any other hue.

| CSS variable | Value | Purpose |
|---|---|---|
| `--color-accent` | `#00d9c4` | Brand teal. Focus rings, pill bg, active nav underline, CTAs. |
| `--color-accent-hover` | `#4de6d3` | Teal hover state. |
| `--color-accent-press` | `#00b8a6` | Teal press/active state. |
| `--color-accent-fg` | `#00231f` | Text on teal backgrounds. Also used for `::selection` text. |

### Overlay whites

Semi-transparent white layers for surfaces, hover states, and subtle borders.

| CSS variable | Value |
|---|---|
| `--color-light-005` | `rgba(255, 255, 255, 0.05)` |
| `--color-light-010` | `rgba(255, 255, 255, 0.10)` |
| `--color-light-015` | `rgba(255, 255, 255, 0.15)` |

### Borders

| CSS variable | Value | Usage |
|---|---|---|
| `--color-border-default` | `rgba(255, 255, 255, 0.35)` | Primary borders, secondary pill outline on hover. |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.15)` | Secondary pill default border. |
| `--color-border-subdued` | `rgba(255, 255, 255, 0.10)` | Subtle dividers. |
| `--color-border-faint` | `rgba(255, 255, 255, 0.05)` | Nav bottom border, mobile menu border. |

### Per-card tints

Applied as `color` on tint overlay elements using `mix-blend-mode: color`. One tint per card.

| CSS variable | Value |
|---|---|
| `--color-tint-pink` | `#e166b6` |
| `--color-tint-blue` | `#26bbff` |
| `--color-tint-cyan` | `#44d5bf` |
| `--color-tint-purple` | `#bb6bf0` |
| `--color-tint-indigo` | `#7371ff` |
| `--color-tint-orange` | `#ff8e1f` |
| `--color-tint-lilac` | `#c7c8fe` |
| `--color-tint-magenta` | `#fe54ba` |
| `--color-tint-teal` | `#00d9c4` |

### 3D pill badge gradient pairs

Each pair provides the gradient for one style of 3D pill badge.

| CSS variable | Value |
|---|---|
| `--color-grad-1-a` | `#c7c8fe` |
| `--color-grad-1-b` | `#44d5bf` |
| `--color-grad-2-a` | `#feb4b4` |
| `--color-grad-2-b` | `#bb6bf0` |
| `--color-grad-3-a` | `#ffc6a3` |
| `--color-grad-3-b` | `#e166b6` |

---

## Typography stack

### Primary: PP Right Grotesk

Sourced from Pangram Pangram (free for personal use; commercial licence required once msarib.dev generates paid client work directly).

| Cut | Filename | Weight | Use |
|---|---|---|---|
| Wide Black | `PPRightGrotesk-WideBlack.woff2` | 900 | Hero display `<h1>` |
| Spatial Black | `PPRightGrotesk-SpatialBlack.woff2` | 800 | Section headings `<h2>` |
| Medium | `PPRightGrotesk-Medium.woff2` | 500 | Sub-headings, UI labels, nav links |

### Primary text: PP Right Grotesk Text

| Cut | Filename | Weight | Use |
|---|---|---|---|
| Regular | `PPRightGroteskText-Regular.woff2` | 400 | Body copy, card text |
| Compact Medium | `PPRightGroteskText-CompactMedium.woff2` | 500 | Compact body, UI elements |

### A/B alternative: PP Neue Montreal

Toggled via a button in the footer. Preference persists in `localStorage` under the key `sarib-font-preference`. Loaded via `@font-face` in `globals.css`; no preload link (fonts load on first use when the toggle is activated in Phase 4).

| Cut | Filename | Weight | Use when active |
|---|---|---|---|
| Extrabold | `PPNeueMontreal-Extrabold.woff2` | 800 | Hero display |
| Semibold | `PPNeueMontreal-Semibold.woff2` | 600 | Section headings, UI |
| Regular | `PPNeueMontreal-Regular.woff2` | 400 | Body copy |

### A/B alternative text: PP Neue Montreal Text

| Cut | Filename | Weight | Use when active |
|---|---|---|---|
| Book | `PPNeueMontrealText-Book.woff2` | 400 | Body copy |

### Mono: JetBrains Mono

Used for timestamps, technical data (engine version badges, performance stats), and monospace UI elements. Loaded via `next/font/google` in `src/app/layout.tsx` with `preload: false` and weights `['400', '500', '700']`. Next.js downloads the font at build time and serves it from Vercel CDN. No Google CDN call at runtime. No woff2 file in `public/fonts/`.

### Font loading

`@font-face` declarations for all nine PP font cuts live in `src/app/globals.css` before the `@theme` block. Every declaration uses `font-display: swap`.

The font A/B toggle switches `--font-display` and `--font-base` on the `body` element. In globals.css:

```css
body[data-font="montreal"] {
  --font-display: 'PP Neue Montreal', system-ui, -apple-system, sans-serif;
  --font-base: 'PP Neue Montreal Text', 'PP Neue Montreal', system-ui, sans-serif;
}
```

### Preload budget

CLAUDE.md hard limit: max 2 preload links per page.

| File | Reason for preload |
|---|---|
| `PPRightGrotesk-WideBlack.woff2` | Hero `<h1>` is above the fold, renders on first paint. |
| `PPRightGroteskText-Regular.woff2` | Body default font, used for all text above the fold. |

All other PP cuts: no preload, load on first use via `font-display: swap`. JetBrains Mono: no preload, `next/font/google` with `preload: false`. Adding a third preload link requires a deliberate change to CLAUDE.md, not just a code edit.

Preload links are `<link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous">` tags in the `<head>` block of `src/app/layout.tsx`.

### Type scale

Custom type scale additions inside `@theme {}`. Tailwind's default size scale is kept alongside.

| CSS variable | Value | Source in v15 |
|---|---|---|
| `--text-hero` | `clamp(36px, 4.5vw, 64px)` | `.hero h1` |
| `--text-h2` | `clamp(28px, 3.5vw, 44px)` | `.section-head h2` |

Tailwind utility: `text-hero`, `text-h2`.

### Line heights

| CSS variable | Value | Used on |
|---|---|---|
| `--leading-hero` | `1.05` | Hero `<h1>` |
| `--leading-heading` | `1.1` | Section `<h2>` |

### Letter spacings

| CSS variable | Value | Used on |
|---|---|---|
| `--tracking-hero` | `-0.025em` | Hero `<h1>` |
| `--tracking-h2` | `-0.02em` | Section `<h2>` |
| `--tracking-eyebrow` | `0.1em` | Eyebrow labels (`.eyebrow`) |

---

## Spacing scale

Layout spacing is defined as `:root` custom properties (not in `@theme`; no Tailwind utility generated). Tailwind's default spacing scale (4px base) is kept for utility classes.

| CSS variable | Value | Purpose |
|---|---|---|
| `--container-max` | `1600px` | Max-width for all containers and sections. |

Layout values used directly as `padding` values in component CSS (Phase 3+):

| Name | Desktop | Mobile | Used on |
|---|---|---|---|
| Section padding | `96px 32px` | `64px 20px` | Standard section top/bottom + gutter |
| Section tight | `64px 32px` | `48px 20px` | Compressed sections |
| Hero padding | `132px 32px 80px` | Responsive | Clears fixed nav |
| Nav padding | `14px 32px` | Default | Expands to fixed height |
| Nav scrolled | `10px 32px` | Compact | On scroll trigger |

---

## Radius scale

Defined in `@theme {}` under `--radius-*`. Tailwind's default radius scale is reset before defining these. Tailwind generates `rounded-8`, `rounded-12`, `rounded-full`, etc.

| CSS variable | Value | Used on |
|---|---|---|
| `--radius-8` | `8px` | Focus rings, skip link, input fields |
| `--radius-12` | `12px` | Mobile menu links, skip link focused state |
| `--radius-16` | `16px` | Standard cards |
| `--radius-24` | `24px` | Larger card surfaces |
| `--radius-32` | `32px` | Large cards, modals |
| `--radius-full` | `9999px` | Pill buttons, tags, nav links hover bg, S-logo mark |

---

## Shadow tokens

Defined in `@theme {}` under `--shadow-*`. Tailwind's default shadow scale is kept; these are added alongside.

| CSS variable | Value | Used on |
|---|---|---|
| `--shadow-pill-glow` | `0 0 0 6px rgba(0, 217, 196, 0.18), 0 8px 28px rgba(0, 217, 196, 0.35), 0 0 60px rgba(0, 217, 196, 0.25)` | Primary pill button hover state |

Additional shadow tokens (card elevations, 3D badge shadow stack, surface elevations) are defined in Phase 3 alongside the components that consume them.

---

## Easing tokens

Defined in `@theme {}` under `--ease-*`. Tailwind's default easing values are reset before defining these.

| CSS variable | Value | v15 name | Used on |
|---|---|---|---|
| `--ease-base` | `cubic-bezier(0.45, 0, 0.55, 1)` | `--ease` | Standard hover transitions, nav background, cursor dot opacity |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | `--ease-out`, `--logo-spin-easing` | Scroll reveals, page transitions, S-logo spin, mobile menu slide |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `--ease-spring` | Spring-feel micro-interactions |

---

## Animation duration tokens

Defined in `:root` (not in `@theme`; Tailwind v4 has no `--duration-*` namespace).

| CSS variable | Value | Used on |
|---|---|---|
| `--duration-fast` | `200ms` | Focus ring transitions, cursor dot fade, nav link hover |
| `--duration-base` | `300ms` | Nav padding on scroll, standard hover |
| `--duration-slow` | `600ms` | Longer transitions |
| `--duration-reveal` | `900ms` | Scroll-triggered reveal animations |
| `--duration-page` | `360ms` | Hash-route page fade (v15 SPA; Next.js routes in prod) |
| `--logo-spin-duration` | `700ms` | S-logo 720deg spin on hover |

---

## Breakpoints

Defined in `@theme {}` under `--breakpoint-*`. Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px, etc.) are reset before defining these. Tailwind generates responsive prefixes `sm:`, `md:`, `lg:`, `xl:`.

| CSS variable | Value | Layout change |
|---|---|---|
| `--breakpoint-sm` | `600px` | Mobile-optimised grid, reduced padding |
| `--breakpoint-md` | `900px` | Single-column layouts, stacked hero |
| `--breakpoint-lg` | `1200px` | Nav switches from links to hamburger |
| `--breakpoint-xl` | `1600px` | Container max (also `--container-max` value) |

---

## Accessibility requirements

Hard requirements. Not optional.

**Selection:**
```css
::selection {
  background-color: var(--color-accent);  /* #00d9c4 */
  color: var(--color-accent-fg);          /* #00231f */
}
```

**Focus ring:**
```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius-8);
}
```
Applies to all interactive elements. No `outline: none` without a visible replacement.

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```
All transforms, animations, and auto-playing video are disabled. Cursor gradient and cursor dot are hidden.

**Semantic HTML:** `<main>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<time datetime="...">`, `<h1>` through `<h6>` in correct hierarchy.

**aria attributes:** `aria-current="page"` on the active nav link. `aria-label` on icon-only controls (S-logo anchor, social links).

**Screen reader text:** `.sr-only` utility for any interactive element without visible text.

**Skip link:** First focusable element in the document. Visible only on focus. Background: `var(--color-accent)`, colour: `#000`, border-radius: `var(--radius-12)`.

---

## S-logo component

The recurring visual signature. Defined **once** in `src/app/globals.css` (Phase 3) as the `.s-logo` class. Used in nav, hero, and footer. Never duplicated, never redefined.

**CSS variable surface** (all defined in `:root` in globals.css):

| Variable | Value | Purpose |
|---|---|---|
| `--s-logo-size` | `32px` | Default mark diameter |
| `--s-logo-bg` | `var(--color-text-primary)` | Mark background |
| `--s-logo-fg` | `var(--color-bg)` | Mark foreground (S character) |
| `--s-logo-bg-hover` | `var(--color-accent)` | Mark background on hover |
| `--s-logo-fg-hover` | `#00231f` | Mark foreground on hover |
| `--logo-spin-duration` | `700ms` | Spin animation duration |
| `--logo-spin-easing` | `cubic-bezier(0.16, 1, 0.3, 1)` | Same as `--ease-out` |

Size variants: `.s-logo-lg` (36px), `.s-logo-xl` (44px).

**Spin behaviour:** 720deg rotation. JS adds `.spinning` class on `mouseenter`. Removes on `animationend`. Animation always completes even if cursor leaves mid-rotation.

**Navigation:** The S-logo is always wrapped in an `<a href="/">` anchor. Click navigates to home.

---

## Primary pill button

```css
background:    var(--color-accent)     /* #00d9c4 */
color:         var(--color-accent-fg)  /* #00231f */
font-weight:   700
border-radius: var(--radius-full)      /* 9999px */
```

**Hover:** `box-shadow: var(--shadow-pill-glow)`. No position movement (locked).

**Active:** `transform: scale(0.98)`, transition 80ms.

---

## Secondary pill button

Outlined variant. Values from v15. Defined in Phase 3.

---

## 3D pill badge

Used for "Technical depth", "Current", and category labels.

**Shadow stack:**

```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.55),
  inset 0 -1px 0 rgba(0, 0, 0, 0.18),
  inset 0 0 0 1px rgba(255, 255, 255, 0.08),
  0 1px 1px rgba(0, 0, 0, 0.X),
  0 3px 6px rgba(0, 0, 0, 0.X),
  0 6px 14px rgba(0, 0, 0, 0.X);
```

**Text shadow:** `0 1px 0 rgba(255, 255, 255, 0.35)` (emboss feel).

**Background:** gradient overlay + gradient base. Gradient pairs from `--color-grad-1-a/b`, `--color-grad-2-a/b`, `--color-grad-3-a/b`.

Exact outer shadow opacity values are sourced from v15 during Phase 3.

---

## Image-derived glow technique

Used on the showreel and feature visuals. One network request total.

- Duplicate the source image as a sibling element (or mirror the playing video via canvas at low resolution).
- Apply `filter: blur(80px) saturate(1.4)`, `transform: scale(1.05)`, `opacity: 0.7`, `z-index: 0` to the duplicate.
- The visible asset sits at `z-index: 2` on top.
- For video (the showreel): a `<canvas>` element mirrors the video at low resolution once per animation frame. No second network request.

---

## Expertise card component

Used in the "Ships fully loaded" section.

**Default state:** Grayscale image + colour tint overlay via `mix-blend-mode: color`, opacity 0.8.

**Hover state:** Tint drops to opacity 0.15. Video fades in and plays. No card lift (locked). Shadow glow: `0 24px 48px rgba(0, 0, 0, 0.3), 0 0 80px var(--card-glow)`.

**Video loading:** `preload="metadata"` until IntersectionObserver fires. Then call `.load()` and `.play()`.

---

## News card and selected work card

**Hover state:** `transform: translateY(-4px)`. Inner image: `transform: scale(1.06)`. Tint opacity: 0.4 to 0.25. Title colour shifts to `var(--color-accent)`.

---

## Three-card animated gradient section

**Background:** Three gradient blobs (teal, purple, magenta) with `filter: blur(120px)`, each drifting on its own `@keyframes` loop at 18s, 22s, and 25s.

**Container mask:**
```css
mask-image: radial-gradient(ellipse 75% 95% at center, #000 50%, transparent 100%);
```

**Cards:** `backdrop-filter: blur(20px)` on top of the moving gradient.

---

## Cursor system

Desktop hover-capable devices only. Hidden on touch and `prefers-reduced-motion: reduce`.

- Small white dot: 6px, `mix-blend-mode: difference`.
- Lerps to cursor position via `requestAnimationFrame`.
- Homepage only: site-wide radial gradient (600px circle) following cursor. Toggled via `body.on-home` class.
- No ring. No trail.

---

## Navigation

- Grid layout, three-column: `[s-logo] [nav-links] [cta]`.
- S-logo left. Nav links centred. Resume download CTA right.
- `aria-current="page"` on the active link.
- Skip-link as the first focusable element.

---

## Footer

- S-logo (links to home, same `.s-logo` singleton).
- Font A/B toggle button. State persists in `localStorage` under `sarib-font-preference`.
- Lahore PKT clock (UTC+5, live updated via `setInterval`).
- RSS link, social links (GitHub, LinkedIn, YouTube), resume PDF download link.

---

## Layout system

```css
--container-max: 1600px
```

Hero grid: `0.85fr 1.4fr`. Text column left, showreel right. Asymmetric by design.

All layouts use asymmetric editorial grids.

---

## Dark Reader safety

- `<meta name="color-scheme" content="dark">` in `<head>` (set via `metadata.other` in `layout.tsx`).
- CSS `color-scheme: dark` on `:root`.
- All background colours are explicit CSS variables, not `transparent` or `inherit` where Dark Reader could invert them.
- Test with Dark Reader extension enabled before marking any phase complete.

---

## Browser and platform support

**Browsers:** Chrome, Edge, Brave, Opera, Samsung Internet, Vivaldi, Arc, Comet, ChatGPT Atlas, Dia (all Chromium-based), Firefox, Safari (desktop and iOS), KaiOS.

**OS:** Windows, macOS, Linux, iOS, iPadOS, Android.

**Viewports:** every aspect ratio from small mobile portrait to ultrawide desktop landscape.

**Minimum requirements:** CSS Grid, CSS custom properties, `backdrop-filter`, `mix-blend-mode`, `IntersectionObserver`, `requestAnimationFrame`. All supported in evergreen browsers.
