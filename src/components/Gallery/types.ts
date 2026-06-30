// Gallery media model. Pure types, no runtime, so this module is safe to import
// from both the server (GalleryBlock in ProjectBody) and the client (Gallery shell).
//
// The discriminated union mirrors the Keystatic block schema in keystatic.config.ts
// (projects.body.components.Gallery). Each variant's fields match one conditional
// branch of that schema. Normalization from the raw { discriminant, value } shape
// happens in ProjectBody via normalizeGalleryItems().

export type AspectRatio = string // e.g. "16/9", "4/5", "auto" (default when unset)

interface BaseItem {
  caption?:     string
  aspectRatio?: AspectRatio
}

export type MediaItem =
  | (BaseItem & { type: 'image';           cloudinaryId: string; alt: string })
  | (BaseItem & { type: 'video';           cloudinaryId: string; accessibleName: string; autoplay?: boolean; loop?: boolean })
  | (BaseItem & { type: 'gif';             cloudinaryId: string; alt: string })
  | (BaseItem & { type: 'youtube';         videoId: string;      accessibleName: string; thumbnailUrl?: string })
  | (BaseItem & { type: 'instagram-reel';  postUrl: string;      accessibleName: string; thumbnailUrl?: string })
  | (BaseItem & { type: 'instagram-post';  postUrl: string;      accessibleName: string; thumbnailUrl?: string })

export type MediaType = MediaItem['type']

// Which display context a renderer is drawing into. Selects Cloudinary tier + sizing.
export type Surface = 'main' | 'fullscreen'

export interface GalleryProps {
  items:      MediaItem[]
  ariaLabel?: string
}

// Type guards used by renderers and the thumbnail platform-icon logic.
export function isInstagram(item: MediaItem): item is Extract<MediaItem, { type: 'instagram-reel' | 'instagram-post' }> {
  return item.type === 'instagram-reel' || item.type === 'instagram-post'
}

export function isEmbed(item: MediaItem): boolean {
  return item.type === 'youtube' || isInstagram(item)
}

// Accessible name resolver: images/gifs carry `alt`, everything else `accessibleName`.
export function itemLabel(item: MediaItem): string {
  if (item.type === 'image' || item.type === 'gif') return item.alt
  return item.accessibleName
}

// Stable list key: a type-prefixed identity so React tracks thumbnails across
// renders by content instead of array position. The type prefix disambiguates the
// rare case of one asset reused under two types (e.g. the same Cloudinary id as
// both a video and a gif).
export function itemKey(item: MediaItem): string {
  switch (item.type) {
    case 'image':
    case 'gif':
    case 'video':           return `${item.type}:${item.cloudinaryId}`
    case 'youtube':         return `${item.type}:${item.videoId}`
    case 'instagram-reel':
    case 'instagram-post':  return `${item.type}:${item.postUrl}`
  }
}
