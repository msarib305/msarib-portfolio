'use client'

import { useRef } from 'react'
import type { ExpertiseItem } from '@/data/expertise'

interface ExpertiseCardProps {
  item: ExpertiseItem
}

export function ExpertiseCard({ item }: ExpertiseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  function onHover() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videoRef.current?.play().catch(() => {})
  }

  function onLeave() {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <div
      className={`exp-card ${item.tintClass}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="exp-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.bwImage}
          alt={item.bwImageAlt}
          className="exp-img"
          loading="lazy"
          decoding="async"
        />
        <video
          ref={videoRef}
          className="exp-video"
          src={item.video}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div className="exp-tint" aria-hidden="true" />
      <h3 className="ec-title">{item.title}</h3>
    </div>
  )
}
