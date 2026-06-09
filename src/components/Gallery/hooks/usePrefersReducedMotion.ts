'use client'

import { useSyncExternalStore } from 'react'

// Reduced-motion as a JS signal. CSS already zeroes transition/animation durations
// globally (@layer base), but two behaviors need JS knowledge: suppressing video
// autoplay and showing a GIF's static first frame instead of the looping video.
// useSyncExternalStore subscribes to the media query without a setState-in-effect.

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
