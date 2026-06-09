'use client'

import { createContext, useContext, type Dispatch, type RefObject } from 'react'
import type { MediaItem } from './types'
import type { GalleryState, GalleryAction } from './galleryState'

export interface GalleryContextValue {
  items:      MediaItem[]
  state:      GalleryState
  dispatch:   Dispatch<GalleryAction>
  count:      number
  current:    MediaItem | undefined
  ariaLabel:  string
  // Element that opened the fullscreen modal. Set before dispatching OPEN_FULLSCREEN
  // so focus can be restored to it on close. Shared mutable ref owned by the shell.
  triggerRef: RefObject<HTMLElement | null>
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

export const GalleryProvider = GalleryContext.Provider

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext)
  if (ctx === null) {
    throw new Error('useGallery must be used within a Gallery provider')
  }
  return ctx
}
