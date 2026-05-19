'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { PillButton } from '@/components/PillButton'
import { FontToggle }  from '@/components/FontToggle'

interface MobileMenuProps {
  open:       boolean
  onClose:    () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  pathname:   string
}

const MM_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Work',     href: '/work' },
  { label: 'About',    href: '/about' },
  { label: 'Writings', href: '/writings' },
  { label: 'Contact',  href: '/contact' },
] as const

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileMenu({ open, onClose, triggerRef, pathname }: MobileMenuProps) {
  const dialogRef  = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()

    const dialog = dialogRef.current
    const trigger = triggerRef.current
    if (!dialog) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return

      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      const active = document.activeElement
      const dialogContains = dialog.contains(active as Node)
      const focusIsHere = active === document.body || active === null || dialogContains
      if (focusIsHere) {
        trigger?.focus()
      }
    }
  }, [open, onClose, triggerRef])

  function isLinkActive(href: string): boolean {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div
      id="mobile-menu"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-heading"
      className={`mobile-menu${open ? ' mobile-menu--open' : ''}`}
    >
      <h2 id="mobile-menu-heading" className="sr-only">Menu</h2>

      <button
        ref={closeBtnRef}
        onClick={onClose}
        aria-label="Close menu"
        className="nav-burger nav-burger--open"
        style={{ alignSelf: 'flex-end', marginBottom: '8px' }}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {MM_LINKS.map(({ label, href }) => {
        const active = isLinkActive(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`mm-link${active ? ' mm-link--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span>{label}</span>
            <span className="mm-arr" aria-hidden="true">→</span>
          </Link>
        )
      })}

      <div className="mm-cta">
        <PillButton href="/contact" variant="primary" size="md">
          Hire me
        </PillButton>
      </div>

      <div className="mm-info">
        <span><strong>Sarib</strong> · Lead UE5 Developer</span>
        <span>Lahore, Pakistan · PKT (UTC+5)</span>
        <span><strong>contact@msarib.dev</strong></span>
        <FontToggle />
      </div>
    </div>
  )
}
