'use client'

import { useRef } from 'react'
import { useGallery } from './GalleryContext'
import { MediaRenderer } from './MediaRenderer'
import { isEmbed } from './types'

const SWIPE_THRESHOLD = 40 // px

export function GalleryMain() {
  const { state, dispatch, current, triggerRef } = useGallery()
  const idx = state.currentIndex
  const pointerStartX = useRef<number | null>(null)

  if (!current) return null

  const embedActivated = state.activatedEmbeds.has(idx)
  const isActiveSurface = !state.isFullscreen // inline goes passive while fullscreen is open
  const aspect = current.aspectRatio && current.aspectRatio !== 'auto' ? current.aspectRatio : '16 / 9'
  // Portrait/square items (e.g. 9:16 Instagram reels) get a height cap so the
  // frame does not tower at the full stage width. Landscape ratios (default
  // 16/9, YouTube, video) fall through unchanged. See globals.css 25.7.c.
  const aspectParts = aspect.split('/').map((n) => parseFloat(n))
  const aspectW = aspectParts[0] ?? NaN
  const aspectH = aspectParts[1] ?? NaN
  const isPortrait = Number.isFinite(aspectW) && Number.isFinite(aspectH) && aspectH >= aspectW

  const onActivateEmbed = () => dispatch({ type: 'ACTIVATE_EMBED', index: idx })

  const openFullscreen = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget
    dispatch({ type: 'OPEN_FULLSCREEN' })
  }

  // Swipe to navigate. Disabled when the current item is an activated embed so the
  // iframe keeps its own gestures.
  const swipeEnabled = !(isEmbed(current) && embedActivated)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!swipeEnabled || e.pointerType === 'mouse') return
    pointerStartX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    const dx = e.clientX - pointerStartX.current
    pointerStartX.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    dispatch({ type: dx < 0 ? 'NEXT' : 'PREV' })
  }

  return (
    <div className="gallery-main">
      <div
        className={`gallery-main-frame${isPortrait ? ' msarib-gallery-portrait' : ''}`}
        style={{ aspectRatio: aspect }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <MediaRenderer
          item={current}
          surface="main"
          isActive={isActiveSurface}
          isEmbedActivated={embedActivated}
          onActivateEmbed={onActivateEmbed}
        />
        <button
          type="button"
          className="gallery-expand"
          aria-label="View fullscreen"
          onClick={openFullscreen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8-18h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {current.caption && <p className="gallery-caption">{current.caption}</p>}
    </div>
  )
}
