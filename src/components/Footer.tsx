import Link from 'next/link'
import dynamic        from 'next/dynamic'
import { SLogo }       from '@/components/SLogo'

// Lazy-load the clock — it lives in the footer (below the fold),
// runs setInterval, and contributes ~1KB of JS that would otherwise
// land in the per-route critical bundle on every page.
const LahoreClock = dynamic(
  () => import('@/components/LahoreClock').then(m => ({ default: m.LahoreClock })),
  {
    loading: () => (
      <div className="footer-clock" aria-label="Loading Lahore time">
        <span className="clock-dot" aria-hidden="true" />
        <span>LAHORE · <strong>--:--:--</strong> PKT</span>
      </div>
    ),
  },
)

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

        {/* Col 3: Pages — heading is h3 to stay sequential after the
            page's h2 (page content sits semantically above the footer). */}
        <div className="footer-col">
          <h3>Pages</h3>
          <ul>
            {PAGE_LINKS.map(({ label, href }) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Col 4: Connect */}
        <div className="footer-col">
          <h3>Connect</h3>
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
          <h3>Tools</h3>
          <ul>
            <li><a href="/feed.xml">RSS</a></li>
            <li><a href="/resume.pdf">Resume (PDF)</a></li>
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
