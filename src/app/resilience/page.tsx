import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Resilience',
  description: 'msarib.dev is built to work alongside your ad-blocker, password manager, high-contrast mode, screen translation, and reduced-motion settings.',
  alternates:  { canonical: 'https://msarib.dev/resilience' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev/resilience',
    title:       'Resilience · Sarib',
    description: 'Built to work alongside your ad-blocker, password manager, high-contrast mode, screen translation, and reduced-motion settings.',
    images:      [{ url: '/og?title=Resilience&eyebrow=Built+to+work+everywhere', width: 1200, height: 630, alt: 'Resilience · Sarib' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Resilience · Sarib',
    description: 'Built to work alongside your ad-blocker, password manager, high-contrast mode, screen translation, and reduced-motion settings.',
    images:      ['/og?title=Resilience&eyebrow=Built+to+work+everywhere'],
  },
}

export default function ResiliencePage() {
  return (
    <>
      <section className="section-container section-container--hero">
        <div className="msarib-resilience">
          <p className="eyebrow">Resilience</p>
          <h1 className="heading-2xl">Built to work with your setup, not against it.</h1>
          <p className="paragraph-lg msarib-resilience-lede">
            msarib.dev is designed to coexist with the way you actually browse. Ad-blocker on,
            password manager running, Dark Reader or Windows High Contrast active, pages
            auto-translating, motion turned down: none of it should break the site. Most portfolios
            assume a clean Chrome window on a fast laptop. This one was tested against the messier
            reality, on real Windows, macOS, Android, and iOS devices across Chrome, Firefox, Safari,
            Edge, Brave, and Opera.
          </p>
        </div>
      </section>

      <section className="section-container section-container--flush-top">
        <div className="msarib-resilience msarib-resilience-body">

          <div className="msarib-resilience-group">
            <h2 className="heading-md">What works where</h2>
            <p>
              Support comes in three tiers. The first is a promise, the second is a soft landing, the
              third is an honest line in the sand.
            </p>
            <ul className="msarib-resilience-list">
              <li>
                <strong>Tier 1, fully supported.</strong> Current Chrome, Firefox, Safari, and Edge
                (plus their last two versions) on Windows, macOS, Linux, iOS, and Android. Modern
                phones and tablets, screens from 360px up to 4K. Common extensions: uBlock Origin,
                AdBlock Plus, AdGuard, Dark Reader, 1Password, LastPass, Bitwarden, Google Translate,
                Grammarly. System settings like reduced-motion, high-contrast, and forced-colors. If
                you are reading this, you are almost certainly in this tier, and everything is built
                to just work.
              </li>
              <li>
                <strong>Tier 2, graceful degradation.</strong> Browsers three to five major versions
                behind, older phones (Android 8 to 11, iOS 13 to 15), less common browsers like
                Vivaldi and Samsung Internet, super-ultrawide monitors, and slow connections. Layout
                and content hold; some of the polish may soften.
              </li>
              <li>
                <strong>Tier 3, not supported on purpose.</strong> Internet Explorer, KaiOS, UC
                Browser, anything more than five versions behind, text-only browsers, and screens
                narrower than 320px. These are not tested or guaranteed. Drawing the line is what
                keeps the first two tiers honest.
              </li>
            </ul>
          </div>

          <div className="msarib-resilience-group">
            <h2 className="heading-md">Built to coexist with your setup</h2>
            <ul className="msarib-resilience-list">
              <li>
                <strong>Ad-blockers.</strong> The site avoids the generic class names and IDs that
                filter lists hide by mistake, so nothing important vanishes with uBlock Origin or
                AdGuard running.
              </li>
              <li>
                <strong>Password managers.</strong> The contact form tells 1Password, LastPass, and
                Bitwarden which fields are not logins, so you get clean autofill on your name and
                email and no prompts where they do not belong.
              </li>
              <li>
                <strong>Dark Reader.</strong> This is already a hand-tuned dark theme, so it opts out
                of Dark Reader&apos;s recoloring through the official lock, keeping the gradients and
                glows as intended. Native contrast meets WCAG.
              </li>
              <li>
                <strong>Windows High Contrast and Forced Colors.</strong> Buttons keep explicit
                borders and focus rings when the OS strips backgrounds, so no control turns into an
                invisible rectangle.
              </li>
              <li>
                <strong>Translation.</strong> Names, studio names, and technical terms are marked to
                stay untranslated, and the layout absorbs longer languages like German without
                overflowing.
              </li>
              <li>
                <strong>No JavaScript.</strong> With scripts blocked, the contact form steps aside and
                shows a direct email link instead of a dead form.
              </li>
              <li>
                <strong>Reduced motion.</strong> Turn motion down in your system settings and the
                animations resolve to their final state instantly. No slides, no fades.
              </li>
            </ul>
          </div>

          <p className="msarib-resilience-closing">
            Want the engineering detail? The full methodology, verification log, and device matrix
            live in the project&apos;s{' '}
            <a
              className="msarib-resilience-link"
              href="https://github.com/msarib305/msarib-portfolio/blob/main/docs/RESILIENCE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              RESILIENCE.md
            </a>{' '}
            on GitHub.
          </p>

        </div>
      </section>
    </>
  )
}
