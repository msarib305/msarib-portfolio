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
    let rafId: number | null = null
    // Coalesce documentElement.style writes into the rAF tick.
    // Writing on every mousemove triggers a style recalc per event
    // (poor INP on rapid moves); batching into one write per frame
    // keeps the work to one recalc per repaint.
    let pendingCssX = mouseX
    let pendingCssY = mouseY
    let cssX = -1
    let cssY = -1

    // The lerp approaches the target asymptotically and never reaches it, so a
    // sub-pixel snap threshold is required for the settle check below to ever
    // fire. At 0.1px the snap is visually imperceptible.
    const SETTLE = 0.1

    // Phase 27.1: the loop is no longer self-perpetuating. It stops when the dot
    // has caught up to the pointer and the CSS vars are flushed, and re-arms on
    // the next mousemove. This keeps it from running ~60fps forever while the
    // pointer is stationary. It is also paused entirely on a hidden tab.
    const isSettled = () =>
      Math.abs(mouseX - dotX) < SETTLE &&
      Math.abs(mouseY - dotY) < SETTLE &&
      pendingCssX === cssX &&
      pendingCssY === cssY

    const tick = () => {
      if (pendingCssX !== cssX || pendingCssY !== cssY) {
        cssX = pendingCssX
        cssY = pendingCssY
        document.documentElement.style.setProperty('--cursor-x', `${cssX}px`)
        document.documentElement.style.setProperty('--cursor-y', `${cssY}px`)
      }
      dotX += (mouseX - dotX) * 0.55
      dotY += (mouseY - dotY) * 0.55
      if (Math.abs(mouseX - dotX) < SETTLE) dotX = mouseX
      if (Math.abs(mouseY - dotY) < SETTLE) dotY = mouseY
      dot.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`
      if (isSettled()) {
        rafId = null
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (rafId !== null) return
      if (motionMQ.matches || document.hidden) return
      rafId = requestAnimationFrame(tick)
    }
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      pendingCssX = mouseX
      pendingCssY = mouseY
      dot.classList.add('cursor-dot--visible')
      start()
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

    const onMotionChange = () => {
      if (motionMQ.matches) stop()
    }

    // Pause on a hidden tab; resume from the current position (no snap) when the
    // tab becomes visible again. Mirrors ShowreelGlow's visibilitychange gating.
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    motionMQ.addEventListener('change', onMotionChange)
    document.addEventListener('mousemove',  onMouseMove,  { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover',  onMouseOver)
    document.addEventListener('mouseout',   onMouseOut)
    document.addEventListener('visibilitychange', onVisibility)
    // Flush the initial CSS vars once; the loop idles immediately after because
    // the dot starts settled at centre.
    start()

    return () => {
      document.removeEventListener('mousemove',  onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseout',   onMouseOut)
      document.removeEventListener('visibilitychange', onVisibility)
      motionMQ.removeEventListener('change', onMotionChange)
      stop()
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
