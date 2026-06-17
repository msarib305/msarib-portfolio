'use client'

import { usePathname } from 'next/navigation'
import { BackToTop } from './BackToTop'

// Site-wide mount for the back-to-top button, suppressed on the Keystatic admin
// UI (/keystatic/*) where the fixed button would overlap the CMS chrome.
export function BackToTopMount() {
  const pathname = usePathname()
  if (pathname.startsWith('/keystatic')) return null
  return <BackToTop />
}
