'use client'

import Link from 'next/link'
import { useRef } from 'react'

interface SLogoProps {
  size?: number
  href?: string
  ariaLabel?: string
  showText?: boolean
  textLabel?: string
  subText?: string
  className?: string
}

export function SLogo({
  size,
  href = '/',
  ariaLabel = 'Go to home',
  showText = false,
  textLabel = 'SARIB',
  subText,
  className = '',
}: SLogoProps) {
  const markRef = useRef<HTMLSpanElement>(null)

  function handleMarkEnter() {
    const mark = markRef.current
    if (!mark || mark.classList.contains('spinning')) return
    mark.classList.add('spinning')
  }

  function handleAnimationEnd() {
    markRef.current?.classList.remove('spinning')
  }

  return (
    <Link
      href={href}
      className={`s-logo ${className}`}
      aria-label={showText ? undefined : ariaLabel}
      style={size !== undefined ? ({ '--s-logo-size': `${size}px` } as React.CSSProperties) : undefined}
    >
      <span
        ref={markRef}
        className="s-logo-mark"
        aria-hidden="true"
        onMouseEnter={handleMarkEnter}
        onAnimationEnd={handleAnimationEnd}
      >
        S
      </span>
      {showText && (
        <span className="s-logo-text">
          {textLabel}
          {subText && <span className="sub"> {subText}</span>}
        </span>
      )}
    </Link>
  )
}
