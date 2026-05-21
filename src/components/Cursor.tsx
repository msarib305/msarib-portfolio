'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const hoverMQ  = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!hoverMQ.matches || motionMQ.matches) return

    const hoverSelector = 'a, button, [role="button"]'

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let dotX   = mouseX
    let dotY   = mouseY
    let rafId: number
    // Coalesce documentElement.style writes into the rAF tick.
    // Writing on every mousemove triggers a style recalc per event
    // (poor INP on rapid moves); batching into one write per frame
    // keeps the work to one recalc per repaint.
    let pendingCssX = mouseX
    let pendingCssY = mouseY
    let cssX = -1
    let cssY = -1

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      pendingCssX = mouseX
      pendingCssY = mouseY
      dot.classList.add('cursor-dot--visible')
    }

    const onMouseLeave = () => {
      dot.classList.remove('cursor-dot--visible')
    }

    const onMouseOver = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (e.target.closest(hoverSelector)) {
        dot.classList.add('cursor-dot--hover')
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      const related = e.relatedTarget instanceof Element ? e.relatedTarget : null
      if (
        e.target.closest(hoverSelector) &&
        !related?.closest(hoverSelector)
      ) {
        dot.classList.remove('cursor-dot--hover')
      }
    }

    const tick = () => {
      if (pendingCssX !== cssX || pendingCssY !== cssY) {
        cssX = pendingCssX
        cssY = pendingCssY
        document.documentElement.style.setProperty('--cursor-x', `${cssX}px`)
        document.documentElement.style.setProperty('--cursor-y', `${cssY}px`)
      }
      dotX += (mouseX - dotX) * 0.55
      dotY += (mouseY - dotY) * 0.55
      dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    const onMotionChange = () => {
      if (motionMQ.matches) {
        cancelAnimationFrame(rafId)
      }
    }
    motionMQ.addEventListener('change', onMotionChange)

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
      motionMQ.removeEventListener('change', onMotionChange)
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
