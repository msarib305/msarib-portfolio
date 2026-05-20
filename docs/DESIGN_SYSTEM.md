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
| `--color-badge-fg` | `#1a1a1f` | Text on 3D pill badge gradient backgrounds. Added Phase 3 (DEC-015). |

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

**File:** `src/components/SLogo.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.s-logo` and child classes.

The recurring visual signature. Defined once in CSS (CLAUDE.md singleton rule). Used in nav, hero, and footer. Never duplicated.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number` | (unset) | Mark diameter in px. Sets `--s-logo-size` via inline style. Omit to use `:root` default (32px) or a size variant class. |
| `href` | `string` | `'/'` | Navigation target. |
| `ariaLabel` | `string` | `'Go to home'` | Accessible label on the anchor. Used when `showText` is false. |
| `showText` | `boolean` | `false` | Renders the text label beside the mark. |
| `textLabel` | `string` | `'SARIB'` | Primary text label. Used when `showText` is true. |
| `subText` | `string` | (unset) | Secondary grey label beside the primary text. |
| `className` | `string` | `''` | Additional classes. Use for size variants (`.s-logo-lg`, `.s-logo-xl`) or layout utilities. |

### Class anatomy

| Class | Element | Role |
|---|---|---|
| `.s-logo` | `<a>` (Next.js `<Link>`) | Flex wrapper, hover trigger. `text-decoration: none`. |
| `.s-logo-mark` | `<span>` | Circle mark containing the S character. Size and colours from CSS variables. `aria-hidden="true"`. |
| `.s-logo-mark.spinning` | `<span>` | Applied on `mouseenter`, removed on `animationend`. Triggers `s-logo-spin` keyframe. |
| `.s-logo-text` | `<span>` | Primary text label. Display font, 900, uppercase, 0.04em tracking. |
| `.s-logo-text .sub` | `<span>` | Secondary text. Base font, 500, `--color-text-secondary`. Hidden on mobile (`max-width: 600px`). |

### Size variants

| Class | `--s-logo-size` override | Text size |
|---|---|---|
| (default) | 32px (`:root`) | 15px |
| `.s-logo-lg` | 36px | 18px |
| `.s-logo-xl` | 44px | 22px |
| `style="--s-logo-size: Npx"` | arbitrary | inherits base |

### CSS variable surface (defined in `:root`)

| Variable | Value | Purpose |
|---|---|---|
| `--s-logo-size` | `32px` | Default mark diameter |
| `--s-logo-bg` | `var(--color-text-primary)` | Mark background |
| `--s-logo-fg` | `var(--color-bg)` | Mark foreground (S character) |
| `--s-logo-bg-hover` | `var(--color-accent)` | Mark background on hover |
| `--s-logo-fg-hover` | `#00231f` | Mark foreground on hover |
| `--logo-spin-duration` | `700ms` | Spin animation duration |
| `--logo-spin-easing` | `cubic-bezier(0.16, 1, 0.3, 1)` | Same as `--ease-out` |

### Spin mechanics

1. `mouseenter` on `.s-logo` fires `handleMouseEnter`.
2. Guard: if `.s-logo-mark` already has `.spinning`, return. Prevents re-entry during animation.
3. `.spinning` class added. `s-logo-spin` keyframe fires: `rotate(0deg)` to `rotate(720deg)` over `--logo-spin-duration` (700ms) with `--logo-spin-easing`.
4. `animationend` on `.s-logo-mark` fires `handleAnimationEnd`. `.spinning` removed.
5. Spin always completes; cursor leaving mid-rotation does not cancel it.

### Accessibility

- `aria-label` is on the `<Link>` only when `showText` is false. When `showText` is true the visible text provides the accessible name.
- `aria-hidden="true"` on `.s-logo-mark`. The S character is decorative; the link label provides the name.
- Keyboard-activatable via Enter (the anchor receives focus).
- Reduced motion: the global `@layer base` `prefers-reduced-motion` rule collapses `animation-duration` to `0.01ms`, so the spin completes instantly instead of being skipped.

### Where used

Nav (Phase 4), hero (Phase 5), footer (Phase 4). `/design-system` for visual verification.

---

## Pill button

**File:** `src/components/PillButton.tsx` (server component, no `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.pill-btn` and modifier classes.

Renders as `<button>` when no `href` is passed, or as a Next.js `<Link>` when `href` is passed. Discriminated union type enforces this at the TypeScript level.

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary'` | `'primary'` | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size modifier. `'md'` adds no modifier class. |
| `icon` | `ReactNode` | (unset) | Decorative icon rendered before children, wrapped in `aria-hidden="true"` span. |
| `children` | `ReactNode` | required | Button label. |
| `className` | `string` | `''` | Additional classes. |
| `href` | `string` | (unset) | When set, renders as `<Link>`. Switches the TypeScript variant to `PillButtonAsLink`. |
| `prefetch` | `boolean` | (Next.js default) | `<Link>` only. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | `<button>` only. |
| `onClick` | `MouseEventHandler` | (unset) | `<button>` only. |
| `disabled` | `boolean` | (unset) | `<button>` only. |

### Class anatomy

| Class | Role |
|---|---|
| `.pill-btn` | Base: flex, padding 10px 22px, min-height 40px, `--radius-full`, transitions. |
| `.pill-btn--primary` | Teal background (`--color-accent`), dark text (`--color-accent-fg`), bold. |
| `.pill-btn--secondary` | Transparent-white background (`--color-light-005`), white text, subtle border. |
| `.pill-btn--lg` | 14px 28px padding, 48px min-height, 15px font. |
| `.pill-btn--sm` | 6px 14px padding, 32px min-height, 12px font. |

No size class is added for `'md'`. The base `.pill-btn` rules are the medium size.

### Hover and active states

- **Primary hover:** `background: var(--color-accent-hover)`, `box-shadow: var(--shadow-pill-glow)`. No position movement.
- **Secondary hover:** `background: var(--color-light-010)`, `border-color: var(--color-border-default)`.
- **Active (both):** `transform: scale(0.98)`, `transition-duration: 80ms`.
- All transitions use `var(--ease-base)`. Box-shadow uses 320ms; others use 240ms.

### Accessibility

- Renders semantic `<button>` or `<a>` based on `href`. No `role="button"` on a non-interactive element.
- `type="button"` is set by default on `<button>` to prevent accidental form submission.
- Icon slot uses `aria-hidden="true"`. Icon is purely decorative; the text label is the accessible name.
- Reduced motion: `transition-duration: 0.01ms !important` via the global `@layer base` override. The scale(0.98) active state collapses to instant.

### Where used

Nav CTA (Phase 4), hero CTAs (Phase 5), contact section (Phase 8).

---

## 3D pill badge

**File:** `src/components/PillBadge.tsx` (server component, no `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.pill-badge` and tone modifier classes.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `'grad-1' \| 'grad-2' \| 'grad-3'` | `'grad-1'` | Gradient colour pair. |
| `children` | `ReactNode` | required | Badge text. |
| `className` | `string` | `''` | Additional classes. |

### Gradient tones

| Tone | Gradient A | Gradient B | Visual | v15 use |
|---|---|---|---|---|
| `grad-1` | `--color-grad-1-a` `#c7c8fe` lilac | `--color-grad-1-b` `#44d5bf` teal | Lilac to teal | "Technical depth" card |
| `grad-2` | `--color-grad-2-a` `#feb4b4` blush | `--color-grad-2-b` `#bb6bf0` purple | Pink to purple | "Engineering leadership" card |
| `grad-3` | `--color-grad-3-a` `#ffc6a3` peach | `--color-grad-3-b` `#e166b6` magenta | Peach to magenta | "Shipped products" card |

Each tone applies:

```css
background:
  linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 50%),
  linear-gradient(225deg, var(--color-grad-N-a), var(--color-grad-N-b));
```

The top overlay (`rgba(255,255,255,0.18)` to `transparent`) creates the 3D highlight on the upper half.

### Shadow anatomy

```css
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.55),   /* top inset highlight */
  inset 0 -1px 0 rgba(0, 0, 0, 0.18),         /* bottom inset shadow */
  inset 0 0 0 1px rgba(255, 255, 255, 0.08),  /* inner 1px border edge */
  0 1px 1px rgba(0, 0, 0, 0.30),              /* tight drop shadow */
  0 3px 6px rgba(0, 0, 0, 0.35),              /* medium drop shadow */
  0 6px 14px rgba(0, 0, 0, 0.18);             /* diffuse drop shadow */
text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35); /* emboss */
```

These rgba() literals are the 3D visual recipe, not theme values. They are not tokenized.

### Typography

11px, 700 weight, uppercase, 0.08em tracking. Text colour: `var(--color-badge-fg)` (`#1a1a1f` — added to @theme in Phase 3, documented in DEC-015).

### Accessibility

Renders as `<span>`. Text is readable by screen readers. No interactive role. No focus handling needed.

### Where used

Three-card animated gradient section (Phase 6).

---

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

**File:** `src/components/Cursor.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.cursor-dot` and `.cursor-gradient`.

### Architecture

v15 uses `body.on-home::before` (a CSS pseudo-element) for the radial gradient. React cannot inject content into pseudo-elements. Phase 3 replaces this with two dedicated `<div>` elements rendered by `<Cursor />`. Behaviour is identical; the implementation path differs.

`<Cursor />` is mounted inside `src/app/page.tsx` only. It does not appear in the layout. No `usePathname` hook is needed. The cursor system is absent on every other route by default.

### Elements

| Element | Class | Role |
|---|---|---|
| `<div>` | `.cursor-gradient` | Full-viewport fixed overlay. Radial gradient reads `--cursor-x` and `--cursor-y` via `var()`. `mix-blend-mode: screen`. `z-index: 1`. |
| `<div>` | `.cursor-dot` | 6px circle. `mix-blend-mode: difference`. `z-index: 9999`. Position updated via `transform: translate3d()` in the RAF loop. |

### CSS variable bridge

On every `mousemove` frame, JS sets on `document.documentElement`:

```javascript
document.documentElement.style.setProperty('--cursor-x', `${mouseX}px`)
document.documentElement.style.setProperty('--cursor-y', `${mouseY}px`)
```

`.cursor-gradient` reads them via:

```css
background: radial-gradient(
  600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
  rgba(0, 217, 196, 0.10),
  rgba(0, 217, 196, 0.04) 25%,
  transparent 55%
);
```

The gradient fallback (`50% 50%`) centres the glow before the first mousemove fires.

### Dot lerp

```javascript
dotX += (mouseX - dotX) * 0.55
dotY += (mouseY - dotY) * 0.55
dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`
```

Factor 0.55 produces a fast follow with slight lag. `dotX - 3` centres the 6px dot on the hot spot (half the dot width).

### Hover enlargement

`mouseover` and `mouseout` events delegate to `a, button, [role="button"]`. The dot grows from 6px to 12px (`cursor-dot--hover` class) when the pointer enters a hoverable element. Width and height transition at 200ms `var(--ease-base)`.

### Visibility

- `cursor-dot--visible` class is added on first `mousemove`. The dot starts hidden (`opacity: 0`) so it does not flash at position `(-100px, -100px)` before any pointer interaction.
- `mouseleave` on the document removes `cursor-dot--visible`. This event fires when the pointer exits the browser viewport; it does not handle inactivity timeout.

### Guard conditions

JS guard (checked in `useEffect` before attaching any listeners):

```javascript
const prefersNoHover       = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersNoHover || prefersReducedMotion) return
```

CSS gate (CSS-only fallback before JS executes):

```css
@media (hover: none), (pointer: coarse), (prefers-reduced-motion: reduce) {
  .cursor-dot, .cursor-gradient { display: none !important; }
}
```

Both gates are needed: the CSS gate fires immediately on render; the JS guard prevents the RAF loop from starting on devices that match after hydration.

### Cleanup

On unmount, `useEffect` cleanup:
- Removes all four event listeners (`mousemove`, `mouseleave`, `mouseover`, `mouseout`).
- Cancels the RAF loop.
- Removes `--cursor-x` and `--cursor-y` from `document.documentElement` so stale values do not persist if the user navigates back to the home route.

### Where used

Home route (`src/app/page.tsx`) only. No other route.

---

## SkipToContent

**File:** `src/components/SkipToContent.tsx` (server component, no `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.skip-link`.

### Purpose

First focusable element in the DOM. Keyboard-only users Tab to it before reaching the nav and can jump past the chrome to `#main-content`.

### Props

None. Self-contained.

### Class anatomy

| Class | Role |
|---|---|
| `.skip-link` | `position: absolute; top: -100px` (off-screen). On `:focus`: `top: 16px` slides it into view. `z-index: 9999`, teal background, black text, `--radius-12` corners. |

### Accessibility

- The only visible-on-focus element rendered before the nav.
- `href="#main-content"` targets the `<main id="main-content" tabIndex={-1}>` in `layout.tsx`.
- `main[tabindex="-1"]:focus { outline: none; }` in `@layer base` suppresses the browser's default focus ring on the main element itself (keyboard users do not need a ring on a non-interactive scroll target).
- Meets WCAG 2.4.1 Bypass Blocks.

### Where used

`src/app/layout.tsx` only, as the first child of `<body>`.

---

## Nav

**File:** `src/components/Nav.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.nav` and child classes.

### Purpose

Fixed top navigation bar. Present on every route via `layout.tsx`.

### Props

None. Self-contained. Uses `usePathname` internally.

### Class anatomy

| Class | Element | Role |
|---|---|---|
| `.nav` | `<header>` | Fixed bar. Three-column grid: `minmax(0,1fr) auto minmax(0,1fr)`. Outer 1fr columns absorb equal remaining space, centring the auto-width link column at the viewport optical centre. `z-index: 100`. `backdrop-filter: blur(50px)`. |
| `.nav--scrolled` | `<header>` | Applied when `window.scrollY > 30`. Reduces padding to 10px; darkens background to `rgba(16,16,20,0.85)`. |
| `.nav-links` | `<ul>` | Desktop link row. `display: flex; gap: 2px; justify-content: center`. Hidden at `max-width: 1200px`. |
| `.nav-actions` | `<div>` | Column 3. `display: flex; justify-content: flex-end; gap: 8px`. |
| `.nav-link` | `<Link>` | Base link style. 14px, 500 weight, `--radius-full` hover bg. `::after` underline indicator (0px width default; 20px on hover/active). |
| `.nav-link--active` | `<Link>` | Added alongside `aria-current="page"` on the active link. Sets `color: var(--color-accent)` and activates the underline. |
| `.nav-cta` | `<PillButton>` | Hire me pill. Hidden at `max-width: 1200px` (merged into the same media query as `.nav-links`). |
| `.nav-burger` | `<button>` | Hamburger. `display: none` desktop; `display: inline-flex` at `max-width: 1200px`. 40px circle, three 1.5px spans. |
| `.nav-burger--open` | `<button>` | Open state. Spans 1 and 3 rotate to X; span 2 fades out. |

### Active link detection

```tsx
function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}
```

Home only activates on exact `/`. All other links activate for the path and any sub-routes.

### Scroll listener

`requestAnimationFrame`-throttled `scroll` listener. Sets `scrolled` state when `window.scrollY > 30`. Passive event. Removed on unmount.

### Mobile menu state

`menuOpen` boolean state. Passed to `<MobileMenu>`. Reset to `false` on every `pathname` change.

### Accessibility

- `<header>` landmark wraps the entire nav bar.
- `<nav aria-label="Main navigation">` wraps the link list.
- `aria-current="page"` on the active link (set to `undefined` on inactive links so the attribute is omitted from the DOM).
- `aria-expanded` and `aria-controls="mobile-menu"` on the burger button.
- `aria-label` switches between "Open menu" and "Close menu" based on state.

### Motion

- Nav padding transition: 300ms `var(--ease-out)`.
- Nav link underline `::after`: width + left at 300ms `var(--ease-out)`.
- Nav link background: 240ms `var(--ease-base)`.
- Burger spans: 320ms `var(--ease-out)` transform, 200ms `var(--ease-base)` opacity.
- `@supports not (backdrop-filter)` fallback: background becomes `rgba(16,16,20,0.95)`.
- Reduced motion: all nav transitions set to `none` in `@media (prefers-reduced-motion: reduce)`.

### Where used

`src/app/layout.tsx` only, after `<SkipToContent />`.

---

## MobileMenu

**File:** `src/components/MobileMenu.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.mobile-menu` and child classes.

### Purpose

Right-sliding drawer. Shown only when the burger is activated at `max-width: 1200px`. Contains the full link list, a Hire me CTA, and the FontToggle.

### Props

| Prop | Type | Description |
|---|---|---|
| `open` | `boolean` | Controls open/close state. |
| `onClose` | `() => void` | Called on Escape, close button click, or link click. |
| `triggerRef` | `React.RefObject<HTMLButtonElement \| null>` | Ref to the burger button. Focus returns here on close. |
| `pathname` | `string` | Current pathname from `usePathname()` in Nav. Used to compute active link state. |

### Class anatomy

| Class | Element | Role |
|---|---|---|
| `.mobile-menu` | `<div>` | Fixed drawer. `width: min(100%, 380px)`. `height: 100dvh`. `transform: translateX(100%)` (off-screen right). `visibility: hidden`. `z-index: 90` (below nav at 100). |
| `.mobile-menu--open` | `<div>` | `transform: translateX(0); visibility: visible`. 400ms `var(--ease-out)` transition. |
| `.mm-link` | `<Link>` | Menu link. 18px display font, 700. `padding: 18px 20px`. `--radius-12`. |
| `.mm-link--active` | `<Link>` | Active state. `background: var(--color-light-005); color: var(--color-accent)`. |
| `.mm-arr` | `<span>` | Arrow glyph (`→`). 14px, muted colour. `transition: transform 200ms`. Translates right on link hover. |
| `.mm-cta` | `<div>` | Wraps the Hire me `<PillButton>`. `margin-top: 24px`. |
| `.mm-info` | `<div>` | Info block at the bottom. `margin-top: auto`. Tagline, timezone, email, FontToggle. Separated from links by a top border. |

### Focus trap

On open:
1. `document.body.style.overflow = 'hidden'` (scroll lock).
2. Focus moves to the close button (`closeBtnRef`).
3. `keydown` listener added to `document`.
4. `Tab`/`Shift+Tab` cycle through all focusable elements inside the dialog and wrap at both ends.
5. `Escape` calls `onClose`.

On close (cleanup):
1. `keydown` listener removed.
2. `document.body.style.overflow = ''` (scroll unlock).
3. Focus returns to `triggerRef.current` (the burger) only when `document.activeElement` is `document.body`, `null`, or still inside the dialog. This prevents stealing focus when a menu link was clicked and navigation has already begun.

### ARIA

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="mobile-menu-heading"`.
- `<h2 id="mobile-menu-heading" className="sr-only">Menu</h2>` provides the accessible name.
- `aria-current="page"` on the active link.

### Motion

- `.mobile-menu` slide: `transform 400ms var(--ease-out)`.
- `.mm-link` background/colour: 200ms `var(--ease-base)`.
- `.mm-arr`: `transform 200ms var(--ease-base)`.
- Reduced motion: all transitions set to `none`.

### Where used

Rendered by `Nav.tsx` alongside the `<header>`.

---

## FontToggle

**File:** `src/components/FontToggle.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.font-toggle` and `.ft-label`.

### Purpose

Toggles the body font between PP Right Grotesk (default) and PP Neue Montreal. Preference survives page reload via `localStorage`.

### Props

None. Self-contained client island.

### State

| localStorage key | Values | `body.dataset.font` effect |
|---|---|---|
| `sarib-font-preference` | `'right'` (default) or `'montreal'` | Absence (or `'right'`) uses PP Right Grotesk. `'montreal'` activates the `body[data-font="montreal"]` CSS rule which overrides `--font-display` and `--font-base`. |

### SSR hydration

Server renders with `aria-pressed={false}` and label "Right Grotesk". `useEffect` reads `localStorage` on mount and corrects state and `body.dataset.font` if "montreal" is stored. One-frame label flash may occur for returning Montreal users; imperceptible for a below-fold footer element.

### Class anatomy

| Class | Role |
|---|---|
| `.font-toggle` | Pill-shaped `<button>`. Monospace 11px. `--color-light-005` background, `--color-border-faint` border. |
| `.font-toggle:hover` | Background: `--color-light-010`. Border: `--color-border-subtle`. Text: primary. |
| `.ft-label` | Inner span showing the current font name. `color: var(--color-text-primary); font-weight: 500`. |

### Accessibility

- `aria-pressed={true}` when Montreal is active; `aria-pressed={false}` for Right Grotesk.
- `aria-label`: `"Switch typeface. Current: Neue Montreal"` (dynamically updated).
- Screen readers announce: "Switch typeface. Current: Neue Montreal — toggle button pressed".
- This is an improvement over v15, which had no `aria-pressed` attribute.

### Where used

Footer (`src/components/Footer.tsx`) and MobileMenu mm-info section (`src/components/MobileMenu.tsx`).

---

## LahoreClock

**File:** `src/components/LahoreClock.tsx` (client component, `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.footer-clock`, `.clock-dot`.

### Purpose

Live Lahore time display in the footer. Updates every second.

### Props

None. Self-contained client island.

### Time format

`Intl.DateTimeFormat` with `timeZone: 'Asia/Karachi'` (Lahore is PKT, UTC+5). Output: `HH:mm:ss` 24-hour. No blinking colon. Format: "LAHORE · HH:mm:ss PKT".

### SSR hydration

Server renders `--:--:--` as the initial placeholder. `useEffect` replaces it on the first tick (within 1000ms). Avoids hydration mismatch because the placeholder is static on both server and client before mount.

### Class anatomy

| Class | Element | Role |
|---|---|---|
| `.footer-clock` | `<div>` | Pill container. Monospace 11px, `--color-light-005` bg, `--color-border-faint` border, `--radius-full`. |
| `.clock-dot` | `<span>` | 5px teal circle. `box-shadow: 0 0 6px var(--color-accent)`. Pulses via `@keyframes pulse` at 2s ease-in-out infinite. |
| `strong` | `<strong>` | Wraps the time value. `color: var(--color-text-primary); font-weight: 500`. |

### Keyframes

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
```

Defined outside `@layer`, after `@keyframes s-logo-spin`. Reduced motion: `.clock-dot { animation: none; }` in the `@layer base` reduced-motion block.

### Accessibility

`aria-label` on the wrapper div includes the live time: `"Current Lahore time: HH:mm:ss PKT"`. The `.clock-dot` is `aria-hidden="true"`.

### Where used

Footer (`src/components/Footer.tsx`) only.

---

## Footer

**File:** `src/components/Footer.tsx` (server component, no `'use client'`)
**CSS:** `@layer components` in `src/app/globals.css`, `.footer`, `.footer-grid`, `.footer-col`, `.footer-bottom`.

### Purpose

Site footer. Present on every route via `layout.tsx`. Contains brand identity, navigation, social links, and utility controls (FontToggle, LahoreClock).

### Props

None. Self-contained server component with two client islands.

### Layout

Five-column grid (`grid-template-columns: repeat(5, 1fr)`):

| Columns | Region | Content |
|---|---|---|
| 1-2 (`span 2`) | Brand | SLogo + tagline + LahoreClock |
| 3 | Pages | Home, Work, About, Writings, Contact links |
| 4 | Connect | GitHub, LinkedIn, YouTube, email |
| 5 | Tools | FontToggle, RSS |

Below the grid: a `footer-bottom` bar with copyright and location.

### Class anatomy

| Class | Element | Role |
|---|---|---|
| `.footer` | `<footer>` | `padding: 80px 32px 32px`. `border-top: 1px solid var(--color-border-faint)`. `margin-top: 64px`. `z-index: 2`. |
| `.footer-grid` | `<div>` | Five-column grid. `max-width: var(--container-max)`. `gap: 48px`. `border-bottom: 1px solid var(--color-border-faint)`. |
| `.footer-col` | `<div>` | One grid column. Column headings: `<h4>` — display font, 800, 13px, uppercase, `0.06em` tracking. Links: 13px, `--color-text-secondary`, hover to primary. |
| `.footer-bottom` | `<div>` | `display: flex; justify-content: space-between; flex-wrap: wrap`. 12px, muted colour. |

### Responsive

- At `max-width: 900px`: grid collapses to 2 columns. Padding reduces to `64px 20px 32px`.
- At `max-width: 600px`: grid collapses to 1 column. Footer bottom stacks vertically.

### Client islands

`FontToggle` and `LahoreClock` are imported as client islands. `Footer.tsx` has no `'use client'` — it is a Server Component. Only the two interactive subtrees enter the client bundle.

### Social links

- GitHub: `https://github.com/msarib305`
- LinkedIn: `https://linkedin.com/in/msarib305`
- YouTube: `https://youtube.com/@msarib305`
- Email: `contact@msarib.dev`

All external links: `target="_blank" rel="noopener noreferrer"`.

### Where used

`src/app/layout.tsx` only, after `<main id="main-content">`.

---

## Layout system

```css
--container-max: 1600px
```

Hero grid: `0.85fr 1.4fr`. Text column left, showreel right. Asymmetric by design.

All layouts use asymmetric editorial grids.

---

## Hero (Phase 5)

**File:** `src/components/Hero.tsx`
**Type:** Server Component

**Purpose:** Home page hero section. Two-column grid with headline/subhead/CTAs/meta row on the left and the showreel on the right.

**Props:** None. Copy and URLs are module-level constants.

**Structure:**
```
<section.hero aria-labelledby="hero-headline">
  <div.hero-grid>
    <div.hero-text>
      <h1#hero-headline.hero-headline>
        [HEADLINE_LINE_1 words as .hero-headline-word spans]
        <span.hero-headline-accent>
          [HEADLINE_LINE_2 words as .hero-headline-word spans]
        </span>
      </h1>
      <p.hero-subhead>
        [SUBHEAD_WORDS as .hero-subhead-word spans]
      </p>
      <div.hero-actions>
        <PillButton variant="primary" size="lg" href="/contact">
        <PillButton variant="secondary" size="lg" href="/work">
      </div>
      <div.hero-meta>
        [three .hero-meta-item blocks]
      </div>
    </div>
    <ShowreelGlow ... />
  </div>
</section>
```

**Word reveal animation:** Each `.hero-headline-word` and `.hero-subhead-word` span has an inline `animationDelay` style. CSS `@keyframes word-reveal` drives `opacity: 0; transform: translateY(40px)` to `opacity: 1; transform: translateY(0)` over 800ms with `var(--ease-out)` and `animation-fill-mode: both`. Headline stagger: 100ms base + 70ms per word. Subhead stagger: starts 200ms after headline completes, 60ms per word.

**Spacing:** Words are split into `<span>` siblings. A text-node space is rendered between spans using `React.Fragment` to preserve native inline-flow word spacing. Space inside an `inline-block` span does not contribute to inter-element spacing.

**Accessibility:** `<section aria-labelledby="hero-headline">` names the landmark from the h1 text. `<video aria-label="...">` names the media. Canvas and reel overlays are `aria-hidden="true"`.

**Reduced motion:** Handled at two levels: CSS `@layer base` collapses `animation-duration` to `0.01ms` (words appear instantly); JS `matchMedia` in ShowreelGlow pauses the video and skips the RAF loop.

**CSS classes introduced:**
| Class | Purpose |
|---|---|
| `.hero` | Section container, max-width, padding |
| `.hero-grid` | Two-column grid (0.85fr 1.4fr) |
| `.hero-text` | Left column flex container |
| `.hero-headline` | h1 styles: display family, size clamp, line-height, tracking |
| `.hero-headline-accent` | `display: block` to force accent line below |
| `.hero-headline-word` | Per-word span: `display: inline-block`, word-reveal animation |
| `.hero-subhead` | p styles: 16px, 1.55 line-height, secondary colour |
| `.hero-subhead-word` | Per-word span: same animation pattern as headline |
| `.hero-actions` | Flex row for CTA buttons |
| `.hero-meta` | Flex row for stat columns, top border |
| `.hero-meta-item` | Single stat column (label + value) |
| `.hero-meta-label` | Mono font, 11px uppercase, secondary colour |
| `.hero-meta-value` | Display font, 14px bold |

**Breakpoints:**
- 1200px: columns 1fr 1.2fr, gap 48px
- 900px: single column, showreel moves above text via `order: -1`
- 600px: padding reduced, meta gap reduced

**Where used:** `src/app/page.tsx`

---

## ShowreelGlow (Phase 5)

**File:** `src/components/ShowreelGlow.tsx`
**Type:** Client Component (`'use client'`)

**Purpose:** Renders the showreel `<video>` element alongside a `<canvas>` sibling that mirrors the video frames at low resolution to produce an image-derived glow behind the frame. One network request for the video; the canvas reads from the same DOM node.

**Props:**
| Prop | Type | Default | Purpose |
|---|---|---|---|
| `src` | `string` | required | Cloudinary video delivery URL |
| `poster` | `string` | required | Still frame URL (shown during load and on reduced-motion) |
| `reelLabel` | `string` | `"SHOWREEL · 2026"` | Overlay chip text |
| `creditsTitle` | `string` | `"Selected highlights"` | Credits strong text |
| `creditsBody` | `string` | `"Samurai Saga · TGS 2024 · NVIDIA · Cesium"` | Credits detail |
| `className` | `string` | — | Optional passthrough for layout overrides |

**Canvas glow technique:**
- Canvas is sized to 160px wide, height proportional to video aspect ratio.
- `ctx.getContext('2d', { alpha: false })` skips alpha compositing.
- RAF loop throttled to ~10fps via `INTERVAL_MS = 100` check; draws only when `video.readyState >= 2` and `video.videoWidth > 0`.
- CSS applies `filter: blur(80px) saturate(1.4); transform: scale(1.05); opacity: 0.7` to the canvas element.
- Canvas sits at `z-index: 0`; `.showreel-frame` sits at `z-index: 2`. `isolation: isolate` on `.showreel` contains these z-indices.

**Reduced motion:** `matchMedia('(prefers-reduced-motion: reduce)').matches` checked in `useEffect`. If true: `video.pause()` called, RAF loop not started. CSS also hides the canvas via `display: none` as an additional guard (DEC-023).

**Cleanup:** `cancelAnimationFrame(rafId)` in the `useEffect` cleanup.

**CSS classes introduced:**
| Class | Purpose |
|---|---|
| `.showreel` | Container: `position: relative; aspect-ratio: 16/10; isolation: isolate` |
| `.showreel-frame` | Inner frame: `overflow: hidden; z-index: 2; border-radius` |
| `.showreel-video` | `width/height: 100%; object-fit: cover` |
| `.showreel-glow-canvas` | Absolute, overflows 10%, blur/saturate/scale/opacity filter |
| `.reel-label` | Overlay chip: top-left, backdrop blur, mono font |
| `.reel-label-dot` | Pulsing accent dot |
| `.reel-credits` | Bottom-left overlay: credits text with text-shadow legibility treatment |
| `.reel-credits-title` | Bold credits headline |

**Performance budget:** Canvas draws at ~10fps. At 160x90px, each draw is 14,400 pixels. `filter: blur(80px)` is GPU-composited. Total idle CPU contribution: well under 5% on a modern machine.

**Where used:** `src/components/Hero.tsx`

---

## @keyframes word-reveal (Phase 5)

```css
@keyframes word-reveal {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Used by `.hero-headline-word` and `.hero-subhead-word`. Duration 800ms, easing `var(--ease-out)`, `fill-mode: both` so words start invisible during their delay period.

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

---

## WorkCard

**File:** `src/components/WorkCard.tsx`
**Type:** Server Component

**Purpose:** Renders a single project card in the Selected Work grid. Links to `/projects/<slug>` with `prefetch={false}` (route does not exist until Phase 8).

**Props:**
```ts
project: FeaturedWorkItem  // from src/data/featured-work.ts
```

**Class anatomy:**
- `.work-card.<tintClass>` — outer `<Link>`, flex column, card background, border, rounded corners, hover lift
- `.work-card-media` — 16/9 aspect ratio container for the image and overlays
- `.work-card-img` — absolute-fill `<img>`, `loading="lazy"`, scales on parent hover
- `.work-card-overlay` — gradient overlay carrying `--card-tint` per card; fades on hover
- `.work-card-tag-img` — pill tag over the image at bottom-left (first tag in the array)
- `.work-card-body` — padded flex column for meta, title, summary
- `.work-card-meta` — mono 11px date and client
- `.work-card-title` — display 22px h3, turns accent on hover
- `.work-card-summary` — two-line clamp body text

**Tint variants:** `wc-1` (teal), `wc-2` (purple), `wc-3` (pink), `wc-4` (cyan)

**Accessibility:** `<Link>` renders as `<a>` in the DOM, so `.cursor-dot--hover` enlarges the cursor on hover. Image has descriptive `alt` text from `coverAlt`.

**Motion:** Card lifts 4px on hover (`transform: translateY(-4px)`). Image scales 1.06 and desaturate filter releases. Overlay fades from 0.4 to 0.25 opacity. All transitions snap to instant under `prefers-reduced-motion: reduce` via the `@layer base` collapse.

**Where used:** `FeaturedWork.tsx`

---

## FeaturedWork

**File:** `src/components/FeaturedWork.tsx`
**Type:** Server Component

**Purpose:** Renders the Selected Work section with a 2x2 card grid and a "View all projects" CTA link.

**Props:** None. Reads `featuredWork` array from `src/data/featured-work.ts`.

**Class anatomy:**
- `.section` — max-width container with 96px vertical padding
- `.section-head` — flex row: h2 on left, PillButton on right
- `.work-grid` — 2-column CSS grid, 24px gap

**Accessibility:** Section has `aria-labelledby="selected-work-heading"` pointing to the `<h2>`.

**Where used:** `src/app/page.tsx`

---

## FeatureShowcase

**File:** `src/components/FeatureShowcase.tsx`
**Type:** Server Component

**Purpose:** Engineering leadership feature panel. Two-column layout: copy and CTA left, image with blurred glow right.

**Props:** None. Image URLs are module-level constants (`SHOWCASE_IMG`, `SHOWCASE_ALT`, `SHOWCASE_CREDIT`).

**Class anatomy:**
- `.feature-showcase` — 2-column grid (1fr 1.2fr), 80px gap, vertically centred
- `.feature-text` — flex column: eyebrow, h2, body copy, PillButton
- `.eyebrow` — mono 11px accent uppercase label
- `.feature-visual-wrap` — 16/11 aspect ratio, `isolation: isolate`
- `.feature-img-glow` — `aria-hidden` `<img>` with `filter: blur(80px) saturate(1.4)`, z-index 0
- `.feature-visual-frame` — rounded border container, z-index 2, with `::after` bottom gradient
- `.feature-img` — full-fill `<img>` inside the frame
- `.feature-credit` — glassmorphic pill badge top-left of the frame (aria-hidden)

**Glow technique:** Two `<img>` elements share the same `src`. Cloudinary CDN `Cache-Control: public, max-age=31536000` means the second element is served from memory cache. One network request total. (DEC-025)

**Accessibility:** Section has `aria-labelledby="leadership-heading"`. The glow image has `alt=""` and `aria-hidden="true"`. Credit badge is `aria-hidden`.

**Where used:** `src/app/page.tsx`

---

## ExpertiseCard

**File:** `src/components/ExpertiseCard.tsx`
**Type:** Client Component (`'use client'`)

**Purpose:** Single card in the Expertise Grid. Shows a BW image with a coloured tint at rest; on hover, BW image fades out and a colour video fades in and plays.

**Props:**
```ts
item: ExpertiseItem  // from src/data/expertise.ts
```

**Class anatomy:**
- `.exp-card.<tintClass>` — aspect-ratio 1/1.1 container, `isolation: isolate`, flex align-end
- `.exp-media` — absolute-fill container for image and video layers
- `.exp-img` — BW still image (`filter: grayscale(1) brightness(0.5)`), z-index 1, fades out on hover
- `.exp-video` — colour hover video, z-index 2, fades in on hover, `preload="metadata"`
- `.exp-tint` — tint overlay with `mix-blend-mode: color`, z-index 3, fades out on hover
- `.exp-card::after` — bottom dark gradient pseudo-element, z-index 4, not pointer-interactive
- `.ec-title` — `<h3>` with `margin: 0`, z-index 5, always visible

**Tint variants:** `c1` (teal), `c2` (blue), `c3` (cyan), `c4` (purple), `c5` (indigo), `c6` (orange), `c7` (pink), `c8` (magenta)

**Blend mode notes:** `mix-blend-mode: color` on `.exp-tint` uses the hue/saturation of the tint colour while keeping the luminosity of the grayscale image beneath, producing a colourised-BW effect. `isolation: isolate` on `.exp-card` contains the blend within the card's stacking context. Avoid `will-change` on `.exp-card` or its ancestors.

**Video behaviour:**
- `onMouseEnter`: calls `matchMedia('(prefers-reduced-motion: reduce)')` at hover time (not in `useEffect`, so it reflects system preference changes mid-session). If not reduced-motion, calls `videoRef.current?.play().catch(() => {})`.
- `onMouseLeave`: calls `v.pause(); v.currentTime = 0` — pauses and resets to start.
- `preload="metadata"`: browser fetches moov box (~5 to 30 KB per video) on page load; full video streams on hover. (DEC-026)

**Accessibility:** `<video>` has `aria-hidden="true"`. `.exp-tint` has `aria-hidden="true"`. Card title is an `<h3>`.

**Motion (reduced):** CSS `prefers-reduced-motion: reduce` block restores `.exp-img { opacity: 1; transform: none }`, keeps `.exp-video { opacity: 0 }`, and restores `.exp-tint { opacity: 0.8 }`. JS `matchMedia` in `onHover` also prevents `play()`. Card is visually identical hovered vs not-hovered on reduced-motion devices.

**Where used:** `ExpertiseGrid.tsx`

---

## ExpertiseGrid

**File:** `src/components/ExpertiseGrid.tsx`
**Type:** Server Component

**Purpose:** Expertise section heading and 8-card grid. Uses `content-visibility: auto` for rendering performance since it is below the fold.

**Props:** None. Reads `expertise` array from `src/data/expertise.ts`.

**Class anatomy:**
- `.expertise-section` — max-width container, 96px vertical padding, `content-visibility: auto`, `contain-intrinsic-size: 800px`
- `.expertise-head` — max-width 880px heading block with h2 and body copy
- `.expertise-grid` — 4-column CSS grid at desktop, 3 at 1200px, 2 at 900px, 2 at 600px

**Accessibility:** Section has `aria-labelledby="expertise-heading"` pointing to the `<h2>`.

**Where used:** `src/app/page.tsx`

---

## WhatIBringCard

**File:** `src/components/WhatIBringCard.tsx`
**Type:** Server Component

**Purpose:** Single card in the "What I bring" three-card grid. Renders a PillBadge label, h3 headline, body paragraph, and a bullet detail list with teal right-arrow markers.

**Props:**
- `card: WhatIBringItem` — from `src/data/what-i-bring.ts`

**WhatIBringItem shape:**
```typescript
{
  slug:     string
  tone:     'grad-1' | 'grad-2' | 'grad-3'
  label:    string
  headline: string
  body:     string
  details:  string[]
}
```

**Class anatomy:**
- `.wib-card` — `<article>`, flex column, `--radius-20` border-radius, `z-index: 1` above blob layer, hover: lift 4px + border/bg shift
- `.wib-card-headline` — `<h3>`, display font 800, clamp(18px, 1.8vw, 22px), `margin: 0`
- `.wib-card-body` — 15px body copy, text-secondary
- `.wib-card-detail` — unstyled `<ul>`, flex column, 8px gap
- `.wib-card-detail li` — mono font 12px, 16px left-padding; `::before` pseudo injects `→` (U+2192) in accent colour

**Accessibility:** `<article>` wrapper provides a self-contained landmark. Screen readers surface it in the document outline. No `aria-label` needed; the h3 headline provides the accessible name.

**Motion:** Hover lift via `transform: translateY(-4px)` at 400ms ease-out. Suppressed globally at reduced motion by `@layer base` `transition-duration: 0.01ms !important`.

**Where used:** `WhatIBring.tsx`

---

## WhatIBring

**File:** `src/components/WhatIBring.tsx`
**Type:** Server Component

**Purpose:** Home-page "Why hire me" section. Three-card grid with animated radial-gradient blob background.

**Props:** None. Reads `whatIBring` array from `src/data/what-i-bring.ts`.

**Class anatomy:**
- `.wib-section` — max-width container, 96px vertical padding
- `.wib-head` — heading block, max-width 760px; `.eyebrow` label, `<h2>`, `.wib-lede` paragraph
- `.wib-grid` — `position: relative; isolation: isolate;` 3-column grid, 20px gap; collapses to 1 column at 900px
- `.wib-bg` — `position: absolute; inset: -40px;` blob container; `::before` (teal blob, `wib-drift1` 18s), `::after` (purple blob, `wib-drift2` 22s), `.wib-blob3` child (indigo blob, `wib-drift3` 25s)
- `.wib-blob3` — centre-positioned indigo radial gradient, animated scale

**Blob animation:** Three `@keyframes` (`wib-drift1`, `wib-drift2`, `wib-drift3`) animate `transform: translate + scale` only. No repaint. GPU compositor path. (DEC-028)

**Accessibility:** Section has `aria-labelledby="wib-heading"`. `.wib-bg` has `aria-hidden="true"`. All blob elements are visual-only.

**Motion (reduced):** `@media (prefers-reduced-motion: reduce)` sets `animation: none` on `.wib-bg::before`, `.wib-bg::after`, `.wib-blob3`. Blobs freeze at their initial position.

**Where used:** `src/app/page.tsx`

---

## ContactCTA

**File:** `src/components/ContactCTA.tsx`
**Type:** Server Component

**Purpose:** Home-page closing call-to-action. Centred card with eyebrow, large heading, body paragraph, and two PillButtons.

**Props:** None. All copy is hardcoded as module-level constants.

**Class anatomy:**
- `.contact-cta-section` — outer section, `padding: 96px 32px` only; no width constraint
- `.contact-cta-card` — centred card; `max-width: min(var(--container-max), calc(100% - 64px))` ensures the card never touches viewport edges (minimum 32px inset each side) and respects container-max on wide screens (DEC-029); flex column, text centred, 24px gap
- `.contact-cta-card h2` — display font 900, clamp(36px, 5vw, 64px), tight letter-spacing
- `.contact-cta-body` — 16px text-secondary, max-width 480px
- `.contact-cta-actions` — flex row, 16px gap, wraps on mobile; collapses to column at 600px

**CTAs:**
- Primary: `<PillButton variant="primary" size="lg" href="/contact">Contact me</PillButton>`
- Secondary: `<PillButton variant="secondary" size="lg" href="/resume.pdf">Download resume</PillButton>` — PDF served statically from `public/resume.pdf`

**Accessibility:** Section has `aria-labelledby="cta-home-heading"` pointing to the `<h2>`. The eyebrow paragraph precedes the heading in DOM order for correct reading flow.

**Where used:** `src/app/page.tsx`

---

## Phase 8 components

### CaseStudyHeader

**File:** `src/components/CaseStudyHeader.tsx`

Renders the chips row and the case study h1. Used at the top of every `/projects/[slug]` page.

**CSS classes:** `.case-meta-row` (flex row, 12px gap, wrapping) | `.case-chip` (11px, font-base 500 weight, `--color-light-010` background, `--radius-full`)| `.case-title` (`clamp(48px, 7vw, 96px)` display 900, letter-spacing -0.03em)

**Props:** `tags: string[]`, `title: string`

**Accessibility:** `aria-label="Project tags"` on the chips container.

---

### CaseStudySpecs

**File:** `src/components/CaseStudySpecs.tsx`

Vertical flex column of key/value spec rows. Uses `<dl>/<dt>/<dd>` semantics. Shown in the right column of the `.case-summary` two-column grid.

**CSS classes:** `.case-specs` (flex column, 16px gap) | `.case-spec-row` (flex row, justify-content space-between, border-bottom faint) | `.case-spec-key` (mono, 12px, uppercase, 0.08em tracking) | `.case-spec-val` (base, 13px, 500 weight, text-align right)

**Spec fields shown:** Year, Client (omitted when null), Role, Engine, Status.

---

### ProjectBody

**File:** `src/components/ProjectBody.tsx`

Renders `ProjectBodyBlock[]` using a grouping reducer (c2 pattern). Heading blocks start new `.case-section` groups; non-heading blocks accumulate under their preceding heading in the same section.

**CSS classes:** `.case-section` (max-width 1100px, 64px padding) | `.case-list` / `.case-list-item` (CSS counter ordinals in `--color-accent`) | `.case-figure` / `figcaption` (mono 12px, muted color)

**Block types:** `paragraph` → `<p>` | `heading` level 2/3 → `<h2>`/`<h3>` | `list` → `<ol className="case-list">` | `figure` → `<figure>` with `next/image`

---

### CaseStudyNav

**File:** `src/components/CaseStudyNav.tsx`

Prev/next navigation at the bottom of each case study. Two-column grid at desktop, one column at 900px.

**CSS classes:** `.case-nav` (2-column grid, 64px auto margin) | `.case-nav-link` (flex column, 32px padding, `--color-light-005` background, `--radius-16`, hover lightens) | `.case-nav-link.is-next` (text-align right) | `.case-nav-dir` (mono 12px, uppercase) | `.case-nav-title` (display 800, 22px) | `.case-nav-empty` (empty cell)

**Boundary behavior:** When `prev === null`, shows "All work / Back to projects" link pointing at `/work`. When `next === null`, renders an empty `<div>` holding the grid column.

---

### WorkIndex

**File:** `src/components/WorkIndex.tsx`

The `/work` page body. Two sections: a hero header with `.work-index-hero-grid` (1.5fr + 1fr, heading left, meta stats right), then a `.work-index-cards` wrapper containing the existing `.work-grid` and `WorkCard` components.

**CSS classes:** `.work-index-hero` | `.work-index-hero-grid` | `.work-index-meta` | `.work-index-meta-row` | `.work-index-cards`

**Data source:** `projects` array from `src/data/projects.ts` (all projects, not just featured).

---

### PlaceholderPage

**File:** `src/components/PlaceholderPage.tsx`

Minimal placeholder used by `/about`, `/writings`, and `/contact` until their full content phases ship. Section wrapper with `.placeholder-page` class, h1, description paragraph, and a secondary PillButton back to home.

**CSS classes:** `.placeholder-page` (152px top padding, `--container-max`)

**Props:** `title: string`, `description: string`

---

## Phase 9 components

### AboutHero

Two-column section (`.about-hero-grid`: 1.5fr 1fr). Left column: eyebrow "About", `h1.about-h1` "Lead UE5 developer from Lahore.", `.about-lede`, and `.about-stats` (flex row of three `.about-stat` blocks with `.num` in accent teal and `.lbl` in mono uppercase). Right column: `.about-portrait` (gradient placeholder, 3:4 aspect ratio, `.pwm` text overlay). No scroll animations; portrait image deferred until asset is available.

**CSS classes:** `.about-hero`, `.about-hero-grid`, `.about-h1`, `.about-lede`, `.about-stats`, `.about-stat`, `.about-portrait`, `.about-portrait .pwm`, `.nm`, `.ro`

**Props:** none (hardcoded constants)

---

### AboutNarrative

Prose section (`.about-narrative`, max-width 800px). h2 "The short version." followed by four paragraphs with `<strong>` lead-ins on paragraphs 2 through 4. Copy is verbatim v15 (Sarib-approved). No data file.

**CSS classes:** `.about-narrative`, `.about-narrative h2`, `.about-narrative p`, `.about-narrative p strong`

**Props:** none

---

### AboutPillars

Three-card engineering principles section (`.three-card`). Blob background reuses `wib-drift1` keyframe. `.three-card-head` with eyebrow "Engineering pillars" and h2 "How I think about the work.". `.three-grid` (3-column) with three `.t-card` articles. `.t1` card gets teal-tinted `.t-pill` chip; `.t2` and `.t3` get neutral chips. No detail bullet list (distinct from WhatIBringCard). Data is a module-level `PILLARS` constant.

**CSS classes:** `.three-card`, `.three-card-bg`, `.blob3`, `.three-card-head`, `.three-grid`, `.t-card`, `.t-card.t1`, `.t-card.t2`, `.t-card.t3`, `.t-pill`, `.t-desc`

**Props:** none

---

### Timeline

Experience section (`.timeline`). Header with h2 "Experience." and a secondary PillButton "Download resume (PDF)" linking to `/resume.pdf`. Maps `experience[]` from `src/data/experience.ts` to `TimelineEntry` components.

**CSS classes:** `.timeline`, `.timeline-head`

**Data:** `src/data/experience.ts` — `ExperienceItem { slug, years, role, company, location, summary, bullets[], tags[], current }`

**Props:** none

---

### TimelineEntry

Single experience row (`.exp-row`). Three-column grid: 200px `.when` column, 1fr `.role` column, 280px `.tags` column. Current entry gets `.exp-row.current` teal radial gradient background and a `<PillBadge tone="grad-1">Current</PillBadge>` in `.now-wrap`. `.deets` uses `.deets-summary` paragraph + `<ul>` for bullets (valid HTML, no bare text nodes). At 1200px the tags column wraps to its own row; on the `.current` row the border-top is transparent to preserve the gradient.

**CSS classes:** `.exp-row`, `.exp-row.current`, `.when`, `.now-wrap`, `.role`, `.role-title`, `.company`, `.deets`, `.deets-summary`, `.tags`, `.tag`

**Props:** `item: ExperienceItem`

---

### SkillsGrid

Skills section (`.skills-section`). Section heading h2 "Skills." followed by `.skills-grid` (4-column at desktop, 2-column at 1200px, 1-column at 600px). Maps `skills[]` from `src/data/skills.ts` to `SkillCategory` components.

**CSS classes:** `.skills-section`, `.skills-section-head`, `.skills-grid`

**Data:** `src/data/skills.ts` — `SkillCategoryItem { slug, label, items[] }`. Four categories: Engines & Languages, Systems & Frameworks, Platforms & Tools, Practice.

**Props:** none

---

### SkillCategory

Single skill category card (`.skill-cat`). `h4` category label in `color-accent` uppercase, followed by `<ul>` of `<li>` items. Background `color-light-005`, border `border-faint`, `radius-16`.

**CSS classes:** `.skill-cat`, `.skill-cat h4`, `.skill-cat ul`, `.skill-cat li`

**Props:** `category: SkillCategoryItem`
