'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

// IntersectionObserver wrapper. Returns a ref to attach to the gallery root and a
// boolean that is true while the element is in (or near) the viewport. Used to gate
// neighbor prefetch so off-screen galleries do no eager network work. `rootMargin`
// pre-arms slightly before the element scrolls fully into view.
export function useInViewport<T extends HTMLElement>(
  rootMargin = '200px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    // No IO support is an extreme edge case. inView stays false and neighbor
    // prefetch (its only consumer, a pure optimization) simply does not run.
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting)
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
