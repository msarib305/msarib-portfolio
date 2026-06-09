'use client'

import { useEffect, useRef, useState } from 'react'
import { CldImage } from '@/components/CldImageClient'
import {
  cloudinaryPublicId,
  buildCloudinaryUrl,
  cloudinaryVideoPoster,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from '@/lib/cloudinary'
import type { MediaItem, Surface } from './types'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

// Window typing for the Instagram embed script.
declare global {
  interface Window {
    instgrm?: { Embeds?: { process: () => void } }
  }
}

const IG_SCRIPT_SRC = 'https://www.instagram.com/embed.js'

interface MediaRendererProps {
  item:            MediaItem
  surface:         Surface
  isActive:        boolean         // this surface should show live/playing content (only one surface at a time)
  isEmbedActivated: boolean        // user has clicked to load the YT/IG embed
  onActivateEmbed: () => void      // load the embed (and IG script) for this item
  onIgScript?:     (status: 'loading' | 'ready' | 'error') => void
}

export function MediaRenderer(props: MediaRendererProps) {
  const { item } = props
  switch (item.type) {
    case 'image':          return <ImageMedia {...props} item={item} />
    case 'gif':            return <GifMedia {...props} item={item} />
    case 'video':          return <VideoMedia {...props} item={item} />
    case 'youtube':        return <YouTubeMedia {...props} item={item} />
    case 'instagram-reel':
    case 'instagram-post': return <InstagramMedia {...props} item={item} />
  }
}

/* ---------------- image ---------------- */

function ImageMedia({
  item,
  surface,
  isActive,
}: MediaRendererProps & { item: Extract<MediaItem, { type: 'image' }> }) {
  const [errored, setErrored] = useState(false)
  if (errored) return <MediaError label="Image unavailable" />

  const width = surface === 'fullscreen' ? 2400 : 1600
  return (
    <CldImage
      src={cloudinaryPublicId(item.cloudinaryId)}
      alt={item.alt}
      width={width}
      height={Math.round((width * 9) / 16)}
      sizes={surface === 'fullscreen' ? '100vw' : '(max-width: 900px) 100vw, 1100px'}
      className="gallery-media-el"
      // The gallery sits below the fold, so it is never the LCP element: use eager
      // loading for the current item (no `priority`, which would emit an unused
      // <link rel=preload>). Non-current surfaces fall back to lazy.
      loading={isActive ? 'eager' : 'lazy'}
      onError={() => setErrored(true)}
    />
  )
}

/* ---------------- gif (Cloudinary video loop) ---------------- */

function GifMedia({
  item,
  surface,
  isActive,
}: MediaRendererProps & { item: Extract<MediaItem, { type: 'gif' }> }) {
  const reduced = usePrefersReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [errored, setErrored] = useState(false)
  const tier = surface === 'fullscreen' ? 'full' : 'main'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isActive && !reduced) {
      v.play().catch(() => { /* autoplay can be refused; poster stays */ })
    } else {
      v.pause()
    }
  }, [isActive, reduced])

  if (errored) return <MediaError label="GIF unavailable" />

  return (
    <video
      ref={videoRef}
      className="gallery-media-el"
      muted
      loop
      playsInline
      preload="metadata"
      poster={cloudinaryVideoPoster(item.cloudinaryId, tier)}
      aria-label={item.alt}
      onError={() => setErrored(true)}
    >
      <source src={buildCloudinaryUrl(item.cloudinaryId, { resource: 'video', tier })} />
    </video>
  )
}

/* ---------------- video (Cloudinary, with controls) ---------------- */

function VideoMedia({
  item,
  surface,
  isActive,
}: MediaRendererProps & { item: Extract<MediaItem, { type: 'video' }> }) {
  const reduced = usePrefersReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [errored, setErrored] = useState(false)
  const tier = surface === 'fullscreen' ? 'full' : 'main'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isActive && item.autoplay && !reduced) {
      v.play().catch(() => { /* refused autoplay is fine */ })
    } else if (!isActive) {
      v.pause()
    }
  }, [isActive, item.autoplay, reduced])

  if (errored) return <MediaError label="Video unavailable" />

  return (
    <video
      ref={videoRef}
      className="gallery-media-el"
      controls
      playsInline
      loop={item.loop}
      preload={isActive ? 'metadata' : 'none'}
      poster={cloudinaryVideoPoster(item.cloudinaryId, tier)}
      aria-label={item.accessibleName}
      onError={() => setErrored(true)}
    >
      <source src={buildCloudinaryUrl(item.cloudinaryId, { resource: 'video', tier })} />
    </video>
  )
}

/* ---------------- youtube (thumbnail-first, click to activate) ---------------- */

function YouTubeMedia({
  item,
  isActive,
  isEmbedActivated,
  onActivateEmbed,
}: MediaRendererProps & { item: Extract<MediaItem, { type: 'youtube' }> }) {
  const [thumbQuality, setThumbQuality] = useState<'maxres' | 'hq'>('maxres')
  const [thumbFailed, setThumbFailed] = useState(false)

  if (isEmbedActivated && isActive) {
    return (
      <iframe
        className="gallery-media-el gallery-iframe"
        src={youtubeEmbedUrl(item.videoId, { autoplay: true })}
        title={item.accessibleName}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  }

  const thumb = item.thumbnailUrl ?? youtubeThumbnailUrl(item.videoId, thumbQuality)

  return (
    <button type="button" className="gallery-activate" aria-label={`Play ${item.accessibleName}`} onClick={onActivateEmbed}>
      {thumbFailed ? (
        <MediaError label="Video unavailable" muted />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail, needs onError quality fallback
        <img
          src={thumb}
          alt=""
          className="gallery-media-el"
          loading="lazy"
          onError={() => {
            if (!item.thumbnailUrl && thumbQuality === 'maxres') setThumbQuality('hq')
            else setThumbFailed(true)
          }}
        />
      )}
      <span className="gallery-play-overlay" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </button>
  )
}

/* ---------------- instagram (lazy embed.js, click to activate) ---------------- */

function InstagramMedia({
  item,
  isActive,
  isEmbedActivated,
  onActivateEmbed,
  onIgScript,
}: MediaRendererProps & { item: Extract<MediaItem, { type: 'instagram-reel' | 'instagram-post' }> }) {
  const [scriptError, setScriptError] = useState(false)
  const live = isEmbedActivated && isActive

  // Lazy-load the Instagram embed script once, only after activation, then process.
  useEffect(() => {
    if (!live) return
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${IG_SCRIPT_SRC}"]`)

    const process = () => window.instgrm?.Embeds?.process?.()

    if (existing) {
      if (window.instgrm?.Embeds) { onIgScript?.('ready'); process() }
      return
    }

    onIgScript?.('loading')
    const script = document.createElement('script')
    script.src = IG_SCRIPT_SRC
    script.async = true
    script.onload = () => { onIgScript?.('ready'); process() }
    script.onerror = () => { onIgScript?.('error'); setScriptError(true) }
    document.body.appendChild(script)
  }, [live, onIgScript])

  if (!live) {
    return (
      <button type="button" className="gallery-activate" aria-label={`Load ${item.accessibleName}`} onClick={onActivateEmbed}>
        <InstagramPlaceholder item={item} thumbnailUrl={item.thumbnailUrl} />
      </button>
    )
  }

  if (scriptError) {
    return (
      <div className="gallery-embed-fallback">
        <p>Instagram embed unavailable.</p>
        <a href={item.postUrl} target="_blank" rel="noopener noreferrer" className="gallery-embed-link">
          View on Instagram
        </a>
      </div>
    )
  }

  return (
    <div className="gallery-ig-embed">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={item.postUrl}
        data-instgrm-version="14"
        style={{ margin: 0, width: '100%' }}
      >
        <a href={item.postUrl} target="_blank" rel="noopener noreferrer">{item.accessibleName}</a>
      </blockquote>
    </div>
  )
}

// Brand-neutral Instagram placeholder: gradient tile background (no wordmark) with a
// REEL/POST label. The platform icon overlay is added by Thumbnail in the strip; here
// in the main surface the gradient + label carry the signal. If a custom thumbnailUrl
// is provided, show that image instead.
function InstagramPlaceholder({
  item,
  thumbnailUrl,
}: {
  item: Extract<MediaItem, { type: 'instagram-reel' | 'instagram-post' }>
  thumbnailUrl?: string
}) {
  const label = item.type === 'instagram-reel' ? 'REEL' : 'POST'
  if (thumbnailUrl) {
    return (
      <CldImage
        src={cloudinaryPublicId(thumbnailUrl)}
        alt=""
        width={1600}
        height={900}
        sizes="(max-width: 900px) 100vw, 1100px"
        className="gallery-media-el"
      />
    )
  }
  return (
    <div className="gallery-ig-placeholder" aria-hidden="true">
      <span className="gallery-ig-placeholder-label">{label}</span>
    </div>
  )
}

/* ---------------- shared error tile ---------------- */

function MediaError({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <div className={`gallery-media-error${muted ? ' gallery-media-error--muted' : ''}`} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  )
}
