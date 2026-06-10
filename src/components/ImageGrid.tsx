import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'

// ImageGrid: a static, server-rendered 2-column grid of prose images. This is the
// counterpart to the interactive Gallery (Phase 19.6.1): use ImageGrid for inline body
// illustrations that belong at a fixed position in the article, and use Gallery for an
// interactive, fullscreen-able media set. ImageGrid has no state, no carousel, no modal.
//
// Authored via the `ImageGrid` Keystatic markdoc block (keystatic.config.ts). ProjectBody
// registers the tag and a server `ImageGridBlock` wrapper that runs the raw markdoc items
// through `normalizeImageGridItems` before handing them here, mirroring the Gallery plumbing.

export interface ImageGridItem {
  src:      string
  alt:      string
  caption?: string
}

interface ImageGridProps {
  items:      ImageGridItem[]
  ariaLabel?: string
}

// Normalize the raw markdoc `items` attribute into the typed ImageGridItem array.
// The Keystatic schema is a flat `fields.array(fields.object({ src, alt, caption }))`, so
// each entry serializes as a plain object (no { discriminant, value } wrapper like the
// conditional-based Gallery). Pure and server-safe. Rows without a usable `src` are dropped.
export function normalizeImageGridItems(raw: unknown): ImageGridItem[] {
  if (!Array.isArray(raw)) return []

  const str    = (v: unknown): string => (typeof v === 'string' ? v : '')
  const optStr = (v: unknown): string | undefined =>
    (typeof v === 'string' && v.length > 0 ? v : undefined)

  const items: ImageGridItem[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const e = entry as Record<string, unknown>
    const src = str(e.src)
    if (src.length === 0) continue
    items.push({ src, alt: str(e.alt), caption: optStr(e.caption) })
  }
  return items
}

export function ImageGrid({ items, ariaLabel }: ImageGridProps) {
  if (items.length === 0) return null

  return (
    <ul className="image-grid" aria-label={ariaLabel ?? 'Image grid'}>
      {items.map((item, i) => (
        <li key={i} className="image-grid-item">
          <figure>
            <CldImage
              src={cloudinaryPublicId(item.src)}
              alt={item.alt}
              width={1200}
              height={675}
              sizes="(max-width: 600px) 100vw, 50vw"
              className="image-grid-img"
              loading="lazy"
            />
            {item.caption && <figcaption className="image-grid-cap">{item.caption}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  )
}
