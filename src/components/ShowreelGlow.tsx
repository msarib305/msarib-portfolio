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

  useEffect(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

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
    let rafId: number

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

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
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
          preload="auto"
          aria-label="Showreel — selected project highlights"
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
