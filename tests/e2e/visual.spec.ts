import { test, expect } from '@playwright/test'

// Visual regression baselines are OS- AND environment-specific. Playwright
// appends the OS name to snapshot filenames automatically (e.g.
// home-chromium-linux.png), but the render itself must also be deterministic.
//
// IMPORTANT: do NOT baseline this suite on a local WSL2 (or bare desktop) host.
// Local software rendering there is non-deterministic run-to-run (sub-pixel
// layout + font hinting drift, video decode), so even static pages flake and
// full-page size mismatches fail the capture. The stabilisation below (frozen
// animations, forced content-visibility, real font-await, eager images,
// height-settle, hero nowrap, masked video) is necessary but NOT sufficient on
// that host. Generate and compare baselines only in the consistent-rendering
// environment (the official Playwright Docker image / CI). No baselines are
// committed for exactly this reason.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Visual regression runs on Chromium only.')
})

test.use({ viewport: { width: 1440, height: 900 } })

const ROUTES = [
  { path: '/',         name: 'home' },
  { path: '/work',     name: 'work' },
  { path: '/about',    name: 'about' },
  { path: '/writings', name: 'writings' },
  { path: '/contact',  name: 'contact' },
  { path: '/projects/anime-stylized-action-tgs2024', name: 'case-study-featured' },
]

for (const route of ROUTES) {
  test(`visual: ${route.name}`, async ({ page }) => {
    await page.goto(route.path)

    // Freeze animations/transitions AND neutralise the two sources of full-page
    // non-determinism on this site:
    //   1. content-visibility:auto (.expertise-section) estimates its height via
    //      contain-intrinsic-size until scrolled into view, so total page height
    //      shifts run-to-run during a fullPage capture. A size mismatch is an
    //      automatic screenshot failure, so force real layout everywhere.
    //   2. the .showreel-glow-canvas mirrors the video into a blurred canvas that
    //      repaints on its own rAF schedule; hide it (keep its box) so it can't
    //      inject flaky pixels.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
          content-visibility: visible !important;
          contain-intrinsic-size: auto !important;
        }
        .showreel-glow-canvas { visibility: hidden !important; }
        /* The hero headline is two fixed spans, each meant to be a single line.
           "I build gameplay systems." sits exactly on the wrap boundary, so a
           sub-pixel font-metric difference occasionally wraps it to a second line
           (+68px, ~1-in-8 loads) and the full-page height comes out bimodal.
           Pin each span to one line so the captured layout matches the design. */
        .msarib-hero-line { white-space: nowrap !important; }
      `,
    })

    // Actually await font loading. NOTE: waitForFunction(() => document.fonts.ready)
    // is a no-op: fonts.ready is a Promise (always truthy), so the predicate passes
    // instantly without waiting; a late font swap then reflows text and shifts the
    // full-page height. evaluate() awaits the promise for real.
    await page.evaluate(() => document.fonts.ready)
    // 'load' instead of 'networkidle': the /contact Turnstile iframe keeps the
    // network active indefinitely, so networkidle never resolves on that route.
    await page.waitForLoadState('load')

    if (route.path === '/') {
      // Pause the showreel at frame 0 so the video thumbnail is deterministic.
      await page.evaluate(() => {
        const video = document.querySelector<HTMLVideoElement>('.showreel-video')
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      })
    }

    // Promote every lazy <img> to eager so all image bytes are in and laid out
    // BEFORE capture. Playwright's fullPage capture scrolls the page to stitch; if
    // images lazy-load during that scroll they reflow mid-capture and the page
    // height comes out bimodal. Do NOT manually scroll to trigger loads: the rAF
    // scroll races the capture scroll and reintroduces the variance. Eager-promote,
    // then wait until every image reports complete.
    await page.evaluate(() => {
      document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
        img.loading = 'eager'
      })
    })
    await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete))

    // Wait for the full-page height to settle: any size mismatch is an automatic
    // screenshot failure, so poll document scrollHeight until it is unchanged
    // across consecutive animation frames before capturing.
    await page.waitForFunction(() => {
      const h = document.documentElement.scrollHeight
      return new Promise<boolean>((resolve) => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve(document.documentElement.scrollHeight === h)),
        )
      })
    })

    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      // Mask non-deterministic regions:
      //  - .footer-clock: live Lahore time.
      //  - .turnstile-wrap: Cloudflare iframe renders differently per key.
      //  - .showreel-video: the home hero video decodes to a different frame per
      //    run (masking the pixels; the element still holds its layout box).
      //  - .youtube-thumb: the case-study cover pulls a remote YouTube thumbnail
      //    that loads/renders inconsistently across runs.
      mask: [
        page.locator('.footer-clock'),
        page.locator('.turnstile-wrap'),
        page.locator('.showreel-video'),
        page.locator('.youtube-thumb'),
      ],
      animations: 'disabled',
      fullPage: true,
      // Small tolerance for sub-pixel anti-aliasing noise between runs.
      maxDiffPixelRatio: 0.01,
    })
  })
}
