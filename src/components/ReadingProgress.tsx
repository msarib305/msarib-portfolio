'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/components/Gallery/hooks/usePrefersReducedMotion'

// Thin progress bar fixed to the top of the viewport on long-form pages
// (case studies, writings). Width tracks scroll progress through the document.
//
// Phase 24.4: a requestAnimationFrame loop polls scrollY every frame and lerps the
// rendered width toward the true scroll position, instead of listening for 'scroll'
// events. Per-frame polling covers every input that moves the page (wheel, scrollbar,
// keyboard, touch, programmatic, and middle-click autoscroll, which does not reliably
// fire 'scroll'), and the lerp replaces the old CSS width transition with continuous
// smoothing. The loop only READS scrollY (it never scrolls or focuses), so it is
// exempt from the DEC-086 mount guard.
//
// Phase 27.1: two runtime-cost fixes that preserve the middle-click coverage above.
// (1) The loop is paused on a hidden tab (visibilitychange) and re-armed on return,
// so it no longer burns ~60fps in a backgrounded tab. (2) scrollHeight/innerHeight
// are layout reads that force reflow; reading them every frame made the loop a
// per-frame layout thrash. They are now cached and refreshed only when the layout
// can actually change (viewport resize, and content-height changes via a
// ResizeObserver: fonts swapping, images/gallery/TOC mounting). The visible loop
// still reads the cheap scrollY every frame, so no scroll input is missed.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const docHeightRef = useRef(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    // reduced-motion: snap straight to the target each frame (no lerp). The effect
    // depends on [reduced], so toggling the OS preference mid-page re-creates the
    // loop with the new factor.
    const LERP_FACTOR = reduced ? 1 : 0.15

    const measure = () => {
      docHeightRef.current =
        document.documentElement.scrollHeight - window.innerHeight
    }

    const tick = () => {
      const docHeight = docHeightRef.current
      const scrolled = window.scrollY
      targetRef.current = docHeight > 0 ? Math.min((scrolled / docHeight) * 100, 100) : 0

      const delta = targetRef.current - currentRef.current
      currentRef.current += delta * LERP_FACTOR

      // Snap when very close to avoid infinite sub-pixel micro-updates.
      if (Math.abs(delta) < 0.05) {
        currentRef.current = targetRef.current
      }

      setProgress(currentRef.current)

      // Keep polling every frame while visible (middle-click autoscroll does not
      // reliably fire 'scroll'); self-terminate if the tab went hidden.
      rafRef.current = document.hidden ? null : requestAnimationFrame(tick)
    }

    const start = () => {
      if (rafRef.current !== null || document.hidden) return
      rafRef.current = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        measure()
        start()
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      ro.disconnect()
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  return (
    <div
      className="msarib-reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    />
  )
}
