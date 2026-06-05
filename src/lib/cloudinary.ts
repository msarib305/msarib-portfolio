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
