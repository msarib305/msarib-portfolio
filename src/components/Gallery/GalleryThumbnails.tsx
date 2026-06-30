'use client'

import { useEffect, useRef } from 'react'
import { useGallery } from './GalleryContext'
import { Thumbnail } from './Thumbnail'
import { itemKey } from './types'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'

export function GalleryThumbnails() {
  const { items, state, dispatch, count } = useGallery()
  const reduced  = usePrefersReducedMotion()
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep the active thumbnail in view as the index changes. This must NOT run on
  // mount: the effect fires on mount with the initial currentIndex (0), and
  // scrollIntoView would scroll the page down to the thumbnail strip (which sits
  // at the bottom of every case study), overriding the scroll-to-top on
  // navigation. Guard by comparing the previous index, not a first-render flag:
  // React Strict Mode double-invokes effects in dev, which flips a one-shot flag
  // on the first run so the second run would still scroll. Comparing the value
  // skips both the mount run and the Strict-Mode re-run, and only scrolls on an
  // actual user-driven index change.
  const prevIndexRef = useRef(state.currentIndex)
  useEffect(() => {
    if (prevIndexRef.current === state.currentIndex) return
    prevIndexRef.current = state.currentIndex
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
            key={itemKey(item)}
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
