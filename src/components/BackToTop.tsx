'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/components/Gallery/hooks/usePrefersReducedMotion'

const SHOW_THRESHOLD = 500

// Fixed bottom-right button that appears after scrolling past the threshold and
// scrolls back to the top on click. The accessible name comes from visually-hidden
// text content, NOT an aria-label: EasyList's "Other Annoyances" list ships a
// generic cosmetic rule `##[aria-label="Back to top"]` that hid the button in
// uBlock Origin regardless of class name (the Phase 24.1 `.msarib-` rename did not
// help because uBlock matched the aria-label, not the class). Removing the
// attribute is structurally immune to that rule and its rewordings (Phase 25.1,
// DEC-089). The `msarib-` class prefix from 24.1 stays as defense-in-depth.
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD)
    // Read-only initial sync (no scroll side effect), so no DEC-086 guard needed.
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`msarib-back-to-top${visible ? ' msarib-back-to-top--visible' : ''}`}
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="msarib-sr-only">Back to top</span>
    </button>
  )
}
