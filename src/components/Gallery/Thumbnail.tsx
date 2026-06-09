'use client'

import { useState } from 'react'
import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId, cloudinaryVideoPoster, youtubeThumbnailUrl } from '@/lib/cloudinary'
import { YouTubeIcon, InstagramIcon } from '@/icons/PlatformIcon'
import type { MediaItem } from './types'
import { isInstagram, itemLabel } from './types'

interface ThumbnailProps {
  item:     MediaItem
  index:    number
  isActive: boolean
  eager:    boolean              // current +/- 1 load eagerly; the rest lazy
  onSelect: (index: number) => void
}

export function Thumbnail({ item, index, isActive, eager, onSelect }: ThumbnailProps) {
  return (
    <button
      type="button"
      className={`gallery-thumbnail${isActive ? ' gallery-thumbnail--active' : ''}`}
      aria-label={`View item ${index + 1}: ${itemLabel(item)}`}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onSelect(index)}
    >
      <ThumbnailImage item={item} eager={eager} />
      <ThumbnailOverlay item={item} />
    </button>
  )
}

function ThumbnailImage({ item, eager }: { item: MediaItem; eager: boolean }) {
  const loading = eager ? 'eager' : 'lazy'

  if (item.type === 'image') {
    return (
      <CldImage
        src={cloudinaryPublicId(item.cloudinaryId)}
        alt=""
        width={200}
        height={200}
        sizes="200px"
        loading={loading}
        className="gallery-thumbnail-img"
      />
    )
  }

  if (item.type === 'video' || item.type === 'gif') {
    // eslint-disable-next-line @next/next/no-img-element -- Cloudinary video first-frame poster (derived jpg URL), not a standard image public ID
    return <img src={cloudinaryVideoPoster(item.cloudinaryId, 'thumb')} alt="" loading={loading} className="gallery-thumbnail-img" />
  }

  if (item.type === 'youtube') {
    return <YouTubeThumb videoId={item.videoId} override={item.thumbnailUrl} loading={loading} />
  }

  // instagram-reel / instagram-post
  if (item.thumbnailUrl) {
    return (
      <CldImage
        src={cloudinaryPublicId(item.thumbnailUrl)}
        alt=""
        width={200}
        height={200}
        sizes="200px"
        loading={loading}
        className="gallery-thumbnail-img"
      />
    )
  }
  const label = item.type === 'instagram-reel' ? 'REEL' : 'POST'
  return (
    <span className="gallery-ig-placeholder gallery-ig-placeholder--thumb" aria-hidden="true">
      <span className="gallery-ig-placeholder-label">{label}</span>
    </span>
  )
}

function YouTubeThumb({ videoId, override, loading }: { videoId: string; override?: string; loading: 'eager' | 'lazy' }) {
  const [quality, setQuality] = useState<'maxres' | 'hq'>('maxres')
  const src = override ?? youtubeThumbnailUrl(videoId, quality)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail with maxres->hq onError fallback
    <img
      src={src}
      alt=""
      loading={loading}
      className="gallery-thumbnail-img"
      onError={() => { if (!override && quality === 'maxres') setQuality('hq') }}
    />
  )
}

// Platform icon overlay (Addition A). YouTube -> YouTube icon, Instagram -> Instagram
// icon, both bottom-right in a dark chip. Cloudinary video/gif get a generic play
// triangle (playable, no brand implied). Static images get no overlay.
function ThumbnailOverlay({ item }: { item: MediaItem }) {
  if (item.type === 'image') return null

  if (item.type === 'youtube') {
    return (
      <span className="gallery-thumbnail-badge" aria-hidden="true">
        <YouTubeIcon width={20} height={20} />
      </span>
    )
  }

  if (isInstagram(item)) {
    return (
      <span className="gallery-thumbnail-badge" aria-hidden="true">
        <InstagramIcon width={20} height={20} />
      </span>
    )
  }

  // video or gif: generic play triangle
  return (
    <span className="gallery-thumbnail-badge" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
    </span>
  )
}
