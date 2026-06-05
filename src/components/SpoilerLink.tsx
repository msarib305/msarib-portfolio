'use client'
import { useState } from 'react'

interface SpoilerLinkProps {
  label: string
  url: string
  warning: string
}

export function SpoilerLink({ label, url, warning }: SpoilerLinkProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="spoiler-link">
      <span className="spoiler-warning">{warning}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`spoiler-url${revealed ? ' spoiler-revealed' : ''}`}
        onTouchEnd={() => setRevealed(true)}
        aria-label={revealed ? label : `${label} (tap to reveal)`}
      >
        {label}
      </a>
    </div>
  )
}
