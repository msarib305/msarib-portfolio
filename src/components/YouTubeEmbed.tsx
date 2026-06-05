'use client'
import { useState } from 'react'
import Image from 'next/image'

interface YouTubeEmbedProps {
  youtubeId: string
  title: string
  priority?: boolean
}

export function YouTubeEmbed({ youtubeId, title, priority = false }: YouTubeEmbedProps) {
  const [active, setActive] = useState(false)

  if (active) {
    return (
      <div className="youtube-embed">
        <iframe
          className="youtube-iframe"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div
      className="youtube-embed"
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title}`}
      onClick={() => setActive(true)}
      onKeyDown={(e) => e.key === 'Enter' && setActive(true)}
    >
      <Image
        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
        alt={title}
        fill
        sizes="(max-width: 900px) 100vw, 1100px"
        className="youtube-thumb"
        priority={priority}
      />
      <div className="youtube-play" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}
