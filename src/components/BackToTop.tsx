'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/components/Gallery/hooks/usePrefersReducedMotion'

const SHOW_THRESHOLD = 500

// Fixed bottom-right button that appears after scrolling past the threshold and
// scrolls back to the top on click.
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const reduced = usePrefersReducedMotion()

  // TEMP Phase 24.1 instrumentation: confirm render-vs-CSS root cause of the
  // Windows Chrome/Edge "no button" report. Removed in the 24.1 fix commit.
  console.log('[BackToTop] render', { visible, scrollY, ts: new Date().toISOString() })

  useEffect(() => {
    console.log('[BackToTop] effect running, attaching scroll listener')
    const onScroll = () => {
      const sy = window.scrollY
      setScrollY(sy)
      setVisible((prev) => {
        const next = sy > SHOW_THRESHOLD
        if (next !== prev) console.log('[BackToTop] visible changed', prev, '->', next, 'at sy', sy)
        return next
      })
    }
    // Read-only initial sync (no scroll side effect), so no DEC-086 guard needed.
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      console.log('[BackToTop] effect cleanup, removing listener')
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' back-to-top--visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      data-debug={`v=${visible} sy=${Math.round(scrollY)}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
