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
// exempt from the DEC-086 mount guard. It runs continuously by design so no input is
// missed; once the bar snaps to the target, setProgress is called with an unchanged
// value each frame and React bails out of the re-render.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    // reduced-motion: snap straight to the target each frame (no lerp). The effect
    // depends on [reduced], so toggling the OS preference mid-page re-creates the
    // loop with the new factor.
    const LERP_FACTOR = reduced ? 1 : 0.15

    const updateTarget = () => {
      const scrolled = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      targetRef.current = docHeight > 0 ? Math.min((scrolled / docHeight) * 100, 100) : 0
    }

    const tick = () => {
      updateTarget()
      const delta = targetRef.current - currentRef.current
      currentRef.current += delta * LERP_FACTOR

      // Snap when very close to avoid infinite sub-pixel micro-updates.
      if (Math.abs(delta) < 0.05) {
        currentRef.current = targetRef.current
      }

      setProgress(currentRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener('resize', updateTarget, { passive: true })

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', updateTarget)
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
