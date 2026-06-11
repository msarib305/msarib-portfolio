import type { Metadata } from 'next'
import KeystaticApp from './keystatic'

// Belt-and-suspenders alongside the robots.txt Disallow: the admin UI must never
// be indexed (Phase 19.7, DEC-082).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function Layout() {
  return <KeystaticApp />
}
