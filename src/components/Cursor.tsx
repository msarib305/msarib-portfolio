'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const prefersNoHover       = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersNoHover || prefersReducedMotion) return

    const hoverSelector = 'a, button, [role="button"]'

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let dotX   = mouseX
    let dotY   = mouseY
    let rafId: number

    // Arrow functions (not hoisted) so TypeScript can narrow dot to HTMLDivElement
    // across the closure boundary.
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      document.documentElement.style.setProperty('--cursor-x', `${mouseX}px`)
      document.documentElement.style.setProperty('--cursor-y', `${mouseY}px`)
      dot.classList.add('cursor-dot--visible')
    }

    // Fires when the pointer exits the browser viewport (document boundary).
    // Hides the dot so it does not float at the last known position.
    const onMouseLeave = () => {
      dot.classList.remove('cursor-dot--visible')
    }

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(hoverSelector)) {
        dot.classList.add('cursor-dot--hover')
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null
      if (
        (e.target as Element).closest(hoverSelector) &&
        !related?.closest(hoverSelector)
      ) {
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const tick = () => {
      dotX += (mouseX - dotX) * 0.55
      dotY += (mouseY - dotY) * 0.55
      dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove',  onMouseMove,  { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover',  onMouseOver)
    document.addEventListener('mouseout',   onMouseOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseout',   onMouseOut)
      cancelAnimationFrame(rafId)
      document.documentElement.style.removeProperty('--cursor-x')
      document.documentElement.style.removeProperty('--cursor-y')
    }
  }, [])

  return (
    <>
      <div className="cursor-gradient" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
