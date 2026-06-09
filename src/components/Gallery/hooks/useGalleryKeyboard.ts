'use client'

import { useCallback, type Dispatch, type KeyboardEvent } from 'react'
import type { GalleryAction } from '../galleryState'

// Returns a keydown handler to attach to a container (the inline gallery root and
// the fullscreen modal), NOT to document. Attaching to the container means arrow
// navigation only fires when focus is inside the gallery, so it never hijacks page
// scroll or the browser's Home/End. Enter/Space activation is left to native
// <button> semantics on thumbnails and the expand control (also avoids hijacking
// Space-to-scroll). Escape closes fullscreen.
export function useGalleryKeyboard(
  dispatch: Dispatch<GalleryAction>,
  isFullscreen: boolean,
): (e: KeyboardEvent<HTMLElement>) => void {
  return useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          dispatch({ type: 'PREV' })
          break
        case 'ArrowRight':
          e.preventDefault()
          dispatch({ type: 'NEXT' })
          break
        case 'Home':
          e.preventDefault()
          dispatch({ type: 'FIRST' })
          break
        case 'End':
          e.preventDefault()
          dispatch({ type: 'LAST' })
          break
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault()
            dispatch({ type: 'CLOSE_FULLSCREEN' })
          }
          break
      }
    },
    [dispatch, isFullscreen],
  )
}
