'use client'

import { useEffect, useRef } from 'react'
import { useGallery } from './GalleryContext'
import { Thumbnail } from './Thumbnail'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

export function GalleryThumbnails() {
  const { items, state, dispatch, count } = useGallery()
  const reduced  = usePrefersReducedMotion()
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep the active thumbnail in view as the index changes.
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    const activeEl = strip.querySelector<HTMLElement>('.gallery-thumbnail--active')
    activeEl?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [state.currentIndex, reduced])

  // Single item: no strip, no chevrons.
  if (count <= 1) return null

  return (
    <div className="gallery-thumbnails-wrap">
      <button
        type="button"
        className="gallery-chevron gallery-chevron--prev"
        aria-label="Previous item"
        disabled={state.currentIndex === 0}
        onClick={() => dispatch({ type: 'PREV' })}
      >
        <Chevron dir="left" />
      </button>

      <div className="gallery-thumbnails" ref={stripRef} role="group" aria-label="Gallery thumbnails">
        {items.map((item, i) => (
          <Thumbnail
            key={i}
            item={item}
            index={i}
            isActive={i === state.currentIndex}
            eager={Math.abs(i - state.currentIndex) <= 1}
            onSelect={(index) => dispatch({ type: 'GO_TO', index })}
          />
        ))}
      </div>

      <button
        type="button"
        className="gallery-chevron gallery-chevron--next"
        aria-label="Next item"
        disabled={state.currentIndex === count - 1}
        onClick={() => dispatch({ type: 'NEXT' })}
      >
        <Chevron dir="right" />
      </button>
    </div>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  const d = dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
