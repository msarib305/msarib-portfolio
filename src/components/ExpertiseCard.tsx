'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { ExpertiseItem } from '@/data/expertise'

interface ExpertiseCardProps {
  item: ExpertiseItem
}

export function ExpertiseCard({ item }: ExpertiseCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef  = useRef<HTMLDivElement>(null)

  // Defer the video's metadata fetch until the card is near the
  // viewport. Avoids 8 simultaneous metadata requests on initial
  // render (one per expertise card) that would block the main thread.
  useEffect(() => {
    const card  = cardRef.current
    const video = videoRef.current
    if (!card || !video) return

    let loaded = false
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !loaded) {
            loaded = true
            video.load()
            io.disconnect()
            break
          }
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(card)

    return () => io.disconnect()
  }, [])

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
      ref={cardRef}
      className={`exp-card ${item.tintClass}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="exp-media">
        <Image
          src={item.bwImage}
          alt={item.bwImageAlt}
          className="exp-img"
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
          quality={55}
          loading="lazy"
        />
        <video
          ref={videoRef}
          className="exp-video"
          src={item.video}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      </div>
      <div className="exp-tint" aria-hidden="true" />
      <h3 className="ec-title">{item.title}</h3>
    </div>
  )
}
