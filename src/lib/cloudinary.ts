/**
 * Extract a Cloudinary public ID from a full delivery URL.
 *
 * Handles:
 *   - Plain upload:     .../upload/PublicId.ext        → PublicId
 *   - Version segment:  .../upload/v1234567890/Pub.ext → Pub
 *   - Folder prefix:    .../upload/folder/Pub.ext      → folder/Pub
 *   - Transformations:  .../upload/c_fill,w_400/Pub    → Pub  (strips segments
 *                       containing a '='-style or 'key_value' transformation)
 *   - No extension:     .../upload/PublicId             → PublicId
 *
 * Examples (verified against actual project URLs):
 *   cloudinaryPublicId('https://res.cloudinary.com/ddgwzcrim/image/upload/Lily_Thumbnail_iraekz.jpg')
 *     → 'Lily_Thumbnail_iraekz'
 *   cloudinaryPublicId('https://res.cloudinary.com/ddgwzcrim/image/upload/Character_Creator_Thumbnail_720p_bovw24.png')
 *     → 'Character_Creator_Thumbnail_720p_bovw24'
 *   cloudinaryPublicId('https://res.cloudinary.com/ddgwzcrim/image/upload/v1700000000/sample.jpg')
 *     → 'sample'
 *   cloudinaryPublicId('https://res.cloudinary.com/ddgwzcrim/image/upload/portfolio/hero.jpg')
 *     → 'portfolio/hero'
 */
export function cloudinaryPublicId(url: string): string {
  if (!url) return url

  const marker = '/upload/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url

  let rest = url.slice(idx + marker.length)

  // Strip extension from the final segment
  rest = rest.replace(/\.[^./]+$/, '')

  // Split into path segments
  const segments = rest.split('/')

  // Drop leading version segment (v followed by digits only)
  const filtered: string[] = []
  for (const seg of segments) {
    if (/^v\d+$/.test(seg)) continue
    // Drop transformation segments (contain at least one underscore-separated key_value pair
    // or a comma, indicating Cloudinary named transformations like c_fill,w_400)
    if (/^[a-z]{1,3}_[a-z0-9]+/.test(seg) || seg.includes(',')) continue
    filtered.push(seg)
  }

  return filtered.join('/')
}

if (
  typeof process !== 'undefined' &&
  process.env.NODE_ENV === 'development' &&
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
) {
  console.error(
    '[cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. ' +
    'CldImage will not apply transformations. Add it to .env.local.'
  )
}

/* ------------------------------------------------------------------ *
 * Gallery URL builders (Phase 19.6.1)
 *
 * CldImage handles image delivery on its own. These helpers cover the
 * cases CldImage cannot: raw <video>/gif sources, video first-frame
 * posters, and the YouTube thumbnail/embed URLs. The cloud name comes
 * from the same env var CldImage uses, falling back to the known
 * production cloud so server-side URL construction never breaks.
 * ------------------------------------------------------------------ */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddgwzcrim'
const CLD_BASE   = `https://res.cloudinary.com/${CLOUD_NAME}`

// Three resolution tiers. thumb feeds the scroll strip, main the inline
// display, full the fullscreen modal (capped, not original, to bound payload).
export const CLD_TIER_WIDTH = { thumb: 200, main: 1600, full: 2400 } as const
export type CldTier = keyof typeof CLD_TIER_WIDTH

type CldResource = 'image' | 'video'

/**
 * Build a Cloudinary delivery URL for a video or GIF asset at a given tier.
 * Always applies f_auto,q_auto so Cloudinary negotiates codec/format and
 * adaptive quality at the edge. GIFs are delivered through the `video`
 * resource type so Cloudinary serves an efficient MP4 loop instead of a
 * heavy animated GIF.
 */
export function buildCloudinaryUrl(
  idOrUrl: string,
  opts: { resource: CldResource; tier: CldTier; ext?: string },
): string {
  const id        = cloudinaryPublicId(idOrUrl)
  const width     = CLD_TIER_WIDTH[opts.tier]
  const transform = `f_auto,q_auto,w_${width}`
  const suffix    = opts.ext ? `.${opts.ext}` : ''
  return `${CLD_BASE}/${opts.resource}/upload/${transform}/${id}${suffix}`
}

/**
 * First-frame poster (JPG) for a Cloudinary video or GIF, used as the
 * video element's poster and as the scroll-strip thumbnail for those types.
 */
export function cloudinaryVideoPoster(idOrUrl: string, tier: CldTier = 'main'): string {
  const id    = cloudinaryPublicId(idOrUrl)
  const width = CLD_TIER_WIDTH[tier]
  return `${CLD_BASE}/video/upload/f_jpg,so_0,q_auto,w_${width}/${id}.jpg`
}

/** Privacy-enhanced YouTube embed URL (youtube-nocookie, never youtube.com). */
export function youtubeEmbedUrl(videoId: string, opts: { autoplay?: boolean } = {}): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}${opts.autoplay ? '?autoplay=1' : ''}`
}

/**
 * YouTube thumbnail URL. maxresdefault is the high-res frame; some videos
 * lack it and return a 404/placeholder, so callers fall back to hqdefault
 * via the image's onError handler.
 */
export function youtubeThumbnailUrl(videoId: string, quality: 'maxres' | 'hq' = 'maxres'): string {
  const file = quality === 'maxres' ? 'maxresdefault' : 'hqdefault'
  return `https://img.youtube.com/vi/${videoId}/${file}.jpg`
}
