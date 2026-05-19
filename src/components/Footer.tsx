import Link from 'next/link'
import { SLogo }       from '@/components/SLogo'
import { FontToggle }  from '@/components/FontToggle'
import { LahoreClock } from '@/components/LahoreClock'

const PAGE_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Work',     href: '/work' },
  { label: 'About',    href: '/about' },
  { label: 'Writings', href: '/writings' },
  { label: 'Contact',  href: '/contact' },
]

const CONNECT_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/msarib305' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/msarib305' },
  { label: 'YouTube',  href: 'https://youtube.com/@msarib305' },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Col 1-2: Brand */}
        <div className="footer-col" style={{ gridColumn: 'span 2' }}>
          <SLogo showText textLabel="SARIB" subText="Lead UE5 Developer" />
          <LahoreClock />
        </div>

        {/* Col 3: Pages */}
        <div className="footer-col">
          <h4>Pages</h4>
          <ul>
            {PAGE_LINKS.map(({ label, href }) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Col 4: Connect */}
        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            {CONNECT_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              </li>
            ))}
            <li>
              <a href="mailto:contact@msarib.dev">contact@msarib.dev</a>
            </li>
          </ul>
        </div>

        {/* Col 5: Tools */}
        <div className="footer-col">
          <h4>Tools</h4>
          <ul>
            <li><FontToggle /></li>
            <li><a href="/feed.xml">RSS</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <span>
          &copy; {new Date().getFullYear()} Muhammad Sarib. All rights reserved.
        </span>
        <span>Lahore, Pakistan</span>
      </div>
    </footer>
  )
}
