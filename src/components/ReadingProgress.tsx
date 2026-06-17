'use client'

import { useEffect, useState } from 'react'

// Thin progress bar fixed to the top of the viewport on long-form pages
// (case studies, writings). Width tracks scroll progress through the document.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled  = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent   = docHeight > 0 ? Math.min((scrolled / docHeight) * 100, 100) : 0
      setProgress(percent)
    }

    // Initial call is a READ (sets state from current scroll position); it does
    // not scroll or focus, so the DEC-086 mount guard does not apply.
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    />
  )
}
