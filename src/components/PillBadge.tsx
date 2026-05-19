import type { ReactNode } from 'react'

type BadgeTone = 'grad-1' | 'grad-2' | 'grad-3'

interface PillBadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

export function PillBadge({ tone = 'grad-1', children, className = '' }: PillBadgeProps) {
  return (
    <span className={`pill-badge pill-badge--${tone} ${className}`}>
      {children}
    </span>
  )
}
