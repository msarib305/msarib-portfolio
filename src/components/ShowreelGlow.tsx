'use client'

import { useEffect, useRef } from 'react'

interface ShowreelGlowProps {
  src: string
  poster: string
  reelLabel?: string
  creditsTitle?: string
  creditsBody?: string
  className?: string
}

export function ShowreelGlow({
  src,
  poster,
  reelLabel = 'SHOWREEL · 2026',
  creditsTitle = 'Selected highlights',
  creditsBody = 'Samurai Saga · TGS 2024 · NVIDIA · Cesium',
  className,
}: ShowreelGlowProps) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!video || !canvas || !wrap) return

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      video.pause()
      return
    }

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    /* ~10fps; blur(80px) makes sub-10fps updates invisible */
    const INTERVAL_MS = 100
    let lastDraw = 0
    let rafId: number | null = null
    let isVisible = true
    let isTabVisible = document.visibilityState !== 'hidden'

    const draw = (now: number) => {
      if (
        now - lastDraw >= INTERVAL_MS &&
        video.readyState >= 2 &&
        video.videoWidth > 0
      ) {
        const w = 160
        const h = Math.max(1, Math.round(w * video.videoHeight / video.videoWidth))
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width  = w
          canvas.height = h
        }
        try { ctx.drawImage(video, 0, 0, w, h) } catch { /* video not ready */ }
        lastDraw = now
      }
      rafId = requestAnimationFrame(draw)
    }

    const start = () => {
      if (rafId !== null) return
      if (!isVisible || !isTabVisible) return
      video.play().catch(() => {})
      rafId = requestAnimationFrame(draw)
    }
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      video.pause()
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting
          if (isVisible) start()
          else stop()
        }
      },
      { threshold: 0.01 },
    )
    io.observe(wrap)

    const onVisibility = () => {
      isTabVisible = document.visibilityState !== 'hidden'
      if (isTabVisible) start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      stop()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`showreel${className ? ` ${className}` : ''}`}
      aria-label="Project showreel"
    >
      <canvas
        ref={canvasRef}
        className="showreel-glow-canvas"
        aria-hidden="true"
      />
      <div className="showreel-frame">
        <video
          ref={videoRef}
          className="showreel-video"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Showreel, selected project highlights"
        />
        <div className="reel-label" aria-hidden="true">
          <span className="reel-label-dot" />
          <span>{reelLabel}</span>
        </div>
        <div className="reel-credits" aria-hidden="true">
          <strong className="reel-credits-title">{creditsTitle}</strong>
          {creditsBody}
        </div>
      </div>
    </div>
  )
}
