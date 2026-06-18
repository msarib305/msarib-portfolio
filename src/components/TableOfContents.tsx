'use client'

import { useEffect, useRef, useState } from 'react'
import type { Heading } from '@/lib/text'
import { usePrefersReducedMotion } from '@/components/Gallery/hooks/usePrefersReducedMotion'

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const prevActiveRef = useRef<string | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Topmost heading currently in the viewport band wins.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length === 0) return
        const next = visible[0]?.target.id ?? null
        // Guard: only re-render when the active heading actually changes
        // (the observer fires repeatedly during scroll). prevActiveRef avoids
        // redundant setState, and means the on-mount fire is a no-op unless the
        // initial active heading differs from the (null) prior value.
        if (next !== prevActiveRef.current) {
          prevActiveRef.current = next
          setActiveId(next)
        }
      },
      // Activate a heading once it crosses into the top ~third of the viewport.
      { rootMargin: '-80px 0px -60% 0px' },
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    // Update the hash without pushing a new history entry.
    history.replaceState(null, '', `#${id}`)
    setMobileOpen(false)
  }

  return (
    <div className="toc">
      <button
        type="button"
        className="toc-toggle-mobile"
        onClick={() => setMobileOpen(v => !v)}
        aria-expanded={mobileOpen}
        aria-controls="toc-list"
      >
        Contents
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <nav
        className={`table-of-contents${mobileOpen ? ' table-of-contents--open' : ''}`}
        aria-label="Table of contents"
      >
        <p className="toc-heading" aria-hidden="true">On this page</p>
        <ul id="toc-list">
          {headings.map(h => (
            <li
              key={h.id}
              className={`toc-item toc-item--l${h.level}${activeId === h.id ? ' toc-item--active' : ''}`}
            >
              <a href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)} aria-current={activeId === h.id ? 'location' : undefined}>
                {/* Headings carry a trailing period in prose (Phase 24.3); the TOC
                    strips it so entries read "The brief", not "The brief.". */}
                {h.text.replace(/\.$/, '')}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
