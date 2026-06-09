'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useGallery } from './GalleryContext'
import { MediaRenderer } from './MediaRenderer'
import { useFocusTrap } from './hooks/useFocusTrap'
import { useGalleryKeyboard } from './hooks/useGalleryKeyboard'

export function GalleryFullscreen() {
  const { state, dispatch, current, count, ariaLabel, triggerRef } = useGallery()
  const idx          = state.currentIndex
  const containerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef  = useRef<HTMLButtonElement>(null)
  const onKeyDown    = useGalleryKeyboard(dispatch, true)

  useFocusTrap({ active: true, containerRef, triggerRef, initialFocusRef: closeBtnRef })

  // Body scroll lock with scrollbar-width compensation (prevents layout shift when
  // the page scrollbar disappears). Mount = open, unmount = close.
  useEffect(() => {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding  = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [])

  if (!current) return null

  const embedActivated = state.activatedEmbeds.has(idx)
  const aspect = current.aspectRatio && current.aspectRatio !== 'auto' ? current.aspectRatio : '16 / 9'
  const close = () => dispatch({ type: 'CLOSE_FULLSCREEN' })
  const onActivateEmbed = () => dispatch({ type: 'ACTIVATE_EMBED', index: idx })

  // Clicking the scrim (the container itself, not its children) closes.
  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close()
  }

  return createPortal(
    <div
      ref={containerRef}
      className="gallery-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      onClick={onBackdropClick}
    >
      <button ref={closeBtnRef} type="button" className="gallery-fullscreen-close" aria-label="Close gallery" onClick={close}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        className="gallery-chevron gallery-chevron--fs gallery-chevron--prev"
        aria-label="Previous item"
        disabled={idx === 0}
        onClick={() => dispatch({ type: 'PREV' })}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="gallery-fullscreen-content">
        <div className="gallery-fullscreen-frame" style={{ aspectRatio: aspect }}>
          <MediaRenderer
            item={current}
            surface="fullscreen"
            isActive
            isEmbedActivated={embedActivated}
            onActivateEmbed={onActivateEmbed}
          />
        </div>
        {current.caption && <p className="gallery-caption gallery-caption--fs">{current.caption}</p>}
        <span className="gallery-fs-counter">{idx + 1} / {count}</span>
      </div>

      <button
        type="button"
        className="gallery-chevron gallery-chevron--fs gallery-chevron--next"
        aria-label="Next item"
        disabled={idx === count - 1}
        onClick={() => dispatch({ type: 'NEXT' })}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
