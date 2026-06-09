'use client'

import { useEffect, useMemo, useReducer, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'
import type { GalleryProps, MediaItem } from './types'
import { GalleryProvider, type GalleryContextValue } from './GalleryContext'
import { makeGalleryReducer, initialGalleryState } from './galleryState'
import { GalleryMain } from './GalleryMain'
import { GalleryThumbnails } from './GalleryThumbnails'
import { GalleryFullscreen } from './GalleryFullscreen'
import { useInViewport } from './hooks/useInViewport'

export function Gallery({ items, ariaLabel = 'Project gallery' }: GalleryProps) {
  const reducer = useMemo(() => makeGalleryReducer(items.length), [items.length])
  const [state, dispatch] = useReducer(reducer, undefined, initialGalleryState)
  const triggerRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const [rootRef, inView] = useInViewport<HTMLDivElement>()

  // Close fullscreen on route change. On a project page the whole gallery unmounts
  // on navigation (and the modal's unmount effect restores the scroll lock); this
  // covers soft navigations where the component might persist.
  useEffect(() => {
    if (state.isFullscreen) dispatch({ type: 'CLOSE_FULLSCREEN' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (items.length === 0) return null

  const count = items.length
  const ctx: GalleryContextValue = {
    items,
    state,
    dispatch,
    count,
    current: items[state.currentIndex],
    ariaLabel,
    triggerRef,
  }

  return (
    <GalleryProvider value={ctx}>
      <div ref={rootRef} className="gallery-root" role="region" aria-label={ariaLabel}>
        <GalleryMain />
        <GalleryThumbnails />
        <div className="gallery-aria-live" aria-live="polite">{`Item ${state.currentIndex + 1} of ${count}`}</div>
        {inView && <NeighborPrefetch items={items} index={state.currentIndex} />}
      </div>
      {state.isFullscreen && <GalleryFullscreen />}
    </GalleryProvider>
  )
}

// Warm current +/- 1 image neighbors using the same CldImage width/sizes as the main
// display, so the request URL matches and lands in cache. Non-image neighbors are
// skipped (their bytes load lazily when they become current).
function NeighborPrefetch({ items, index }: { items: MediaItem[]; index: number }) {
  const neighbors = [index - 1, index + 1]
    .filter((i) => i >= 0 && i < items.length)
    .map((i) => items[i])
    .filter((it): it is Extract<MediaItem, { type: 'image' }> => it?.type === 'image')

  if (neighbors.length === 0) return null

  return (
    <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
      {neighbors.map((it, k) => (
        <CldImage
          key={k}
          src={cloudinaryPublicId(it.cloudinaryId)}
          alt=""
          width={1600}
          height={900}
          sizes="(max-width: 900px) 100vw, 1100px"
        />
      ))}
    </div>
  )
}
