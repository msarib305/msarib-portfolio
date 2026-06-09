import type { MediaItem } from './types'

// Normalize the raw markdoc Gallery `items` attribute (an array of
// { discriminant, value } produced by the Keystatic conditional schema) into the
// typed MediaItem union the Gallery consumes. Pure and server-safe; mirrors the
// frontmatter normalizer in src/data/projects.ts but covers all six types.

type RawValue = Record<string, unknown>
interface RawItem { discriminant?: string; value?: RawValue }

const str    = (v: unknown): string => (typeof v === 'string' ? v : '')
const optStr = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v : undefined)
const bool   = (v: unknown): boolean => v === true

export function normalizeGalleryItems(raw: unknown): MediaItem[] {
  if (!Array.isArray(raw)) return []

  const items: MediaItem[] = []
  for (const entry of raw as RawItem[]) {
    if (!entry || typeof entry !== 'object') continue
    const v = (entry.value ?? {}) as RawValue
    const caption     = optStr(v.caption)
    const aspectRatio = optStr(v.aspectRatio)

    switch (entry.discriminant) {
      case 'image':
        items.push({ type: 'image', cloudinaryId: str(v.cloudinaryId), alt: str(v.alt), caption, aspectRatio })
        break
      case 'video':
        items.push({ type: 'video', cloudinaryId: str(v.cloudinaryId), accessibleName: str(v.accessibleName), autoplay: bool(v.autoplay), loop: bool(v.loop), caption, aspectRatio })
        break
      case 'gif':
        items.push({ type: 'gif', cloudinaryId: str(v.cloudinaryId), alt: str(v.alt), caption, aspectRatio })
        break
      case 'youtube':
        items.push({ type: 'youtube', videoId: str(v.videoId), accessibleName: str(v.accessibleName), thumbnailUrl: optStr(v.thumbnailUrl), caption, aspectRatio })
        break
      case 'instagram-reel':
        items.push({ type: 'instagram-reel', postUrl: str(v.postUrl), accessibleName: str(v.accessibleName), thumbnailUrl: optStr(v.thumbnailUrl), caption, aspectRatio })
        break
      case 'instagram-post':
        items.push({ type: 'instagram-post', postUrl: str(v.postUrl), accessibleName: str(v.accessibleName), thumbnailUrl: optStr(v.thumbnailUrl), caption, aspectRatio })
        break
    }
  }
  return items
}
