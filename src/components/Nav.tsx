'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { SLogo }      from '@/components/SLogo'
import { PillButton } from '@/components/PillButton'
import { MobileMenu } from '@/components/MobileMenu'

const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Work',     href: '/work' },
  { label: 'About',    href: '/about' },
  { label: 'Writings', href: '/writings' },
  { label: 'Contact',  href: '/contact' },
] as const

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 30)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu whenever the route changes. Deferred via
  // setTimeout(0) to satisfy React 19's react-hooks/set-state-in-effect
  // lint rule: setState inside a queued callback is non-cascading.
  useEffect(() => {
    const id = setTimeout(() => setMenuOpen(false), 0)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        {/* Column 1: logo */}
        <SLogo ariaLabel="Sarib — go to home" />

        {/* Column 2: desktop links */}
        <nav aria-label="Main navigation">
          <ul className="nav-links" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href, pathname)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`nav-link${active ? ' nav-link--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Column 3: CTA + burger */}
        <div className="nav-actions">
          <PillButton href="/contact" variant="primary" size="sm" className="nav-cta">
            Hire me
          </PillButton>
          <button
            ref={burgerRef}
            className={`nav-burger${menuOpen ? ' nav-burger--open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={burgerRef}
        pathname={pathname}
      />
    </>
  )
}
