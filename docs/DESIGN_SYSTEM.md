# Design System

Canonical visual spec for msarib.dev. Every value here comes from `portfolio_design_v15.html` (the single-file SPA that is the source of truth). Do not introduce values not present in v15 without explicit approval. Do not re-litigate locked decisions silently.

---

## Color tokens

All colors defined as CSS custom properties on `:root`. Defined in `src/app/globals.css` inside the `@theme` block (Phase 2).

```css
--bg:                  #101014   /* near-black base */
--bg-low:              #18181c   /* slightly elevated surface */
--bg-high:             #202024   /* further elevated surface */
--fill-primary:        #00d9c4   /* TEAL — locked accent */
--fill-primary-hover:  #4de6d3
--fill-primary-press:  #00b8a6
--text-primary:        #ffffff
--text-secondary:      rgba(255, 255, 255, 0.65)
```

Per-card tint tokens (used on expertise cards, news cards, three-card section):

```css
--tint-pink:     /* value from v15 */
--tint-blue:     /* value from v15 */
--tint-cyan:     /* value from v15 */
--tint-purple:   /* value from v15 */
--tint-indigo:   /* value from v15 */
--tint-orange:   /* value from v15 */
--tint-lilac:    /* value from v15 */
--tint-magenta:  /* value from v15 */
--tint-teal:     /* value from v15 */
```

Tint values are sourced from v15 during Phase 2. The primary accent stays teal across the entire system. Do not propose a blue accent.

---

## Typography stack

### Primary: PP Right Grotesk

Sourced from Pangram Pangram (free for personal use; commercial licence required once msarib.dev generates paid client work directly).

| Cut | Weight | Use |
|---|---|---|
| Wide Black | 900 | Hero display `<h1>` |
| Spatial Black | 900 | Section headings `<h2>` |
| Medium | 500 | Sub-headings, UI labels, nav links |
| Text Regular | 400 | Body copy, card text |

### A/B alternative: PP Neue Montreal

Toggled via a button in the footer. Preference persists in `localStorage` under the key `sarib-font-preference`.

| Cut | Weight | Use |
|---|---|---|
| Extrabold | 800 | Hero display |
| Semibold | 600 | Section headings, UI |
| Regular | 400 | Body copy |

### Mono: JetBrains Mono

Used for timestamps, technical data (engine version badges, performance stats), and monospace UI elements.

### @font-face rules

All fonts loaded via `@font-face` in `globals.css` (Phase 2). Required: `font-display: swap` on every declaration. Preload the Wide Black cut and the Text Regular cut only (maximum 2 preload links per page).

---

## Spacing scale

```css
--container-max:      1600px
--section-padding-lg: 96px    /* desktop */
--section-padding-sm: 64px    /* mobile */
--gutter-lg:          32px    /* desktop */
--gutter-sm:          20px    /* mobile */
```

---

## Radius scale

Values sourced from v15 and defined in `@theme` (Phase 2). Used consistently per component type (pill buttons use fully rounded; cards use a moderate radius; badges use pill).

---

## Easing tokens

Named easing curves defined in `@theme` as `--ease-*` variables (Phase 2). Used across hover transitions, spin animation, gradient drift, and scroll-linked effects.

---

## Animation duration tokens

```css
--logo-spin-duration:  700ms
```

Additional durations defined in Phase 2 from v15 values. Used for card hover transitions, gradient blob drift, cursor lerp.

---

## S-logo component

The recurring visual signature. Defined **once** in `src/app/globals.css` (Phase 3) as the `.s-logo` class. Used in nav, hero, and footer. Never duplicated, never redefined.

**CSS variable surface:**

```css
--s-logo-size:      32px   /* default */
/* modifier classes: .s-logo-lg → 36px, .s-logo-xl → 44px */
--s-logo-bg:        /* background fill */
--s-logo-fg:        /* foreground fill */
--s-logo-bg-hover:  /* background on hover */
--s-logo-fg-hover:  /* foreground on hover */
```

**Spin behavior:** 720deg rotation. JS adds `.spinning` class on `mouseenter`. Removes on `animationend`. The animation always completes even if the cursor leaves mid-rotation. Duration: `var(--logo-spin-duration)`.

**Navigation:** The S-logo is always wrapped in an `<a href="/">` anchor. Click navigates to home.

---

## Primary pill button

```css
background:   var(--fill-primary)   /* #00d9c4 */
color:        #00231f               /* dark teal */
font-weight:  700
border-radius: 9999px
```

**Hover:** glow expands via `box-shadow`. No position movement. Three-layer shadow at 6px, 28px, 60px spread.

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
  inset 0 1px 0 rgba(255, 255, 255, 0.55),   /* top highlight */
  inset 0 -1px 0 rgba(0, 0, 0, 0.18),         /* bottom shadow */
  inset 0 0 0 1px rgba(255, 255, 255, 0.08),  /* 1px inner border */
  0 1px 1px rgba(0, 0, 0, 0.X),               /* outer drop 1 */
  0 3px 6px rgba(0, 0, 0, 0.X),               /* outer drop 2 */
  0 6px 14px rgba(0, 0, 0, 0.X);              /* outer drop 3 */
```

**Text shadow:** `0 1px 0 rgba(255, 255, 255, 0.35)` (emboss feel).

**Background:** gradient overlay + gradient base. Gradient pairs: `--grad-1-a` / `--grad-1-b`, `--grad-2-a` / `--grad-2-b`, `--grad-3-a` / `--grad-3-b`. Values from v15.

Exact shadow opacity values (the `X` placeholders above) are sourced from v15 during Phase 3.

---

## Image-derived glow technique

Used on the showreel and feature visuals. One network request total.

- Duplicate the source image as a sibling element (or mirror the playing video via canvas at low resolution).
- Apply `filter: blur(80px) saturate(1.4)`, `transform: scale(1.05)`, `opacity: 0.7`, `z-index: 0` to the duplicate.
- The visible asset sits at `z-index: 2` on top.
- Glow color derives automatically from the source. No JS color sampling needed.
- For video (the showreel): a `<canvas>` element mirrors the video at low resolution once per animation frame. This avoids a second network request for the video file.

---

## Expertise card component

Used in the "Ships fully loaded" section.

**Default state:**
- Source image with `filter: grayscale(1) brightness(0.5)`.
- Colored tint overlay via `mix-blend-mode: color`, opacity 0.8.
- Per-card color via `--card-tint` CSS variable.

**Hover state:**
- Tint drops to opacity 0.15.
- Video fades in and plays.
- No card lift on hover (locked). The card stays in place.
- `box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3), 0 0 80px var(--card-glow)`.

**Video loading:** `preload="metadata"` until IntersectionObserver fires. Then call `.load()` and `.play()`.

---

## News card and selected work card

**Hover state:**
- `transform: translateY(-4px)`.
- Inner image: `transform: scale(1.06)`.
- Tint overlay opacity: 0.4 (default) to 0.25 (hover).
- Title color shifts to `var(--fill-primary)` on hover.

---

## Three-card animated gradient section

Used in "What I bring" and "How I think about the work".

**Background:**
- Three gradient blobs (teal, purple, magenta) with `filter: blur(120px)`.
- Each blob drifts on its own `@keyframes` loop at a different duration.

**Container mask:**
```css
mask-image: radial-gradient(ellipse 75% 95% at center, #000 50%, transparent 100%);
```
This fades the gradient at the container edges. No hard cuts.

**Cards:** `backdrop-filter: blur(20px)` on top of the moving gradient.

---

## Cursor system

Desktop hover-capable devices only. Hidden on touch and `prefers-reduced-motion: reduce`.

- Small white dot: 6px, `mix-blend-mode: difference`.
- Lerps to cursor position via `requestAnimationFrame`.
- **Homepage only:** site-wide radial gradient (600px circle) following cursor. Toggled via `body.on-home` class. Not active on inner pages.
- No ring. No trail. Both were tried and removed in v13.

---

## Navigation

- Grid layout, not flexbox. Three-column: `[s-logo] [nav-links] [cta]`.
- S-logo left. Nav links centered. Resume download CTA right.
- `aria-current="page"` on the active link.
- Skip-link as the first focusable element in the document.

---

## Footer

- S-logo (links to home, same `.s-logo` singleton).
- Font A/B toggle button (PP Right Grotesk default, PP Neue Montreal alternative). State persists in `localStorage` under `sarib-font-preference`.
- Lahore PKT clock (UTC+5, live updated via `setInterval`).
- RSS link.
- Social links: GitHub, LinkedIn, YouTube.
- Resume PDF download link.

---

## Layout system

```css
--container-max: 1600px
```

Section padding: `var(--section-padding-lg)` desktop, `var(--section-padding-sm)` mobile.

Gutter: `var(--gutter-lg)` desktop, `var(--gutter-sm)` mobile.

**Hero grid:** `0.85fr 1.4fr`. Text column left, showreel right. Asymmetric by design.

All layouts use asymmetric editorial grids, not symmetric centered grids.

---

## Breakpoints

Values from v15, defined in `@theme` (Phase 2). Standard set covering mobile, tablet, desktop, and ultrawide. All components are responsive across every aspect ratio and orientation.

---

## Accessibility requirements

Hard requirements. Not optional.

- `focus-visible` on all interactive elements. No `outline: none` without a visible replacement.
- `prefers-reduced-motion: reduce`: disable all transforms, animations, and auto-playing video.
- Semantic HTML: `<main>`, `<nav>`, `<article>`, `<header>`, `<footer>`, `<time datetime="...">`, `<h1>` through `<h6>` in correct hierarchy.
- `aria-current="page"` on the active nav link.
- `aria-label` on icon-only controls (S-logo anchor, social links).
- Screen reader text (`.sr-only`) for any interactive element without visible text.
- Skip-link as the first focusable element: `<a href="#main-content">Skip to content</a>`.

---

## Dark Reader safety

- `<meta name="color-scheme" content="dark">` in `<head>` (set via `metadata.other` in `layout.tsx`).
- CSS `color-scheme: dark` on `:root`.
- All background colors are explicit CSS variables, not `transparent` or `inherit` where Dark Reader could invert them.
- Test with Dark Reader extension enabled before marking any phase complete.

---

## Browser and platform support

**Browsers:** Chrome, Edge, Brave, Opera, Samsung Internet, Vivaldi, Arc, Comet, ChatGPT Atlas, Dia (all Chromium-based), Firefox, Safari (desktop and iOS), KaiOS.

**OS:** Windows, macOS, Linux, iOS, iPadOS, Android.

**Viewports:** every aspect ratio from small mobile portrait to ultrawide desktop landscape.

**Minimum requirements:** CSS Grid, CSS custom properties, `backdrop-filter`, `mix-blend-mode`, `IntersectionObserver`, `requestAnimationFrame`. All supported in evergreen browsers.
