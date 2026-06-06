# OG Preview Matrix

Tracks Open Graph preview rendering across platforms. Verified via LinkedIn Post Inspector (forces cache refresh). Feed posts can take up to 24 hours to reflect changes.

Last verified: 2026-06-06 (Phase 18)

---

## Verification results

### LinkedIn Post Inspector

Tool: `https://www.linkedin.com/post-inspector/`

| URL | Title | Description | Image | Aspect ratio | Status |
|-----|-------|-------------|-------|-------------|--------|
| `https://msarib.dev` | Correct | Correct | Renders | 1.91:1 (1200x628) | PASS |
| `https://msarib.dev/work` | Correct | Correct | Renders | 1.91:1 (1200x628) | PASS |
| `https://msarib.dev/projects/anime-stylized-action-tgs2024` | Correct | Correct | Renders | 1.91:1 (1200x628) | PASS |

All three URLs render at the correct 1.91:1 aspect ratio with brand title formatting. No clipping.

### Other platforms

| Platform | Method | Status | Notes |
|----------|--------|--------|-------|
| Twitter/X | Cards validator | Pending — verify manually | Use `https://cards-dev.twitter.com/validator` |
| Slack | Paste URL in composer | Pending — verify manually | Preview renders inline before sending |
| WhatsApp Web | Paste URL in composer | Pending — verify manually | Preview renders in composer |
| Discord | Paste URL in composer | Pending — verify manually | Preview renders in composer |
| Facebook | Sharing Debugger | Deferred — lower priority for dev portfolio | `https://developers.facebook.com/tools/debug/` |

---

## OG metadata reference

Defined in `src/app/layout.tsx` `metadata.openGraph`.

| Property | Value |
|----------|-------|
| `og:type` | `website` |
| `og:image` | Cloudinary (`ddgwzcrim` cloud, AVIF/WebP) |
| `og:image:width` | 1200 |
| `og:image:height` | 628 |
| `og:title` | Page-specific, falls back to site title |
| `og:description` | Page-specific, falls back to site description |

Per-page OG overrides are set in each route's `generateMetadata()` or static `metadata` export.

---

## Notes

- LinkedIn cache is invalidated immediately by Post Inspector. Feed link previews can take up to 24 hours.
- If OG image appears wrong after a title/description copy change: re-run Post Inspector to force a refresh.
- `og:image` is served via Cloudinary CDN. If `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is ever changed, the image URLs will break on all platforms until their cache expires.
