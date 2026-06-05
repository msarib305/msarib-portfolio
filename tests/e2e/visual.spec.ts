import { test, expect } from '@playwright/test'

// Visual regression baselines are OS-specific. These baselines were produced
// on WSL2 (Linux). Re-baseline is required when CI runs on a different OS.
// Playwright appends the OS name to snapshot filenames automatically
// (e.g., home-chromium-desktop-linux.png).
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

    // Freeze all CSS animations and transitions to prevent flaky pixel diffs
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    })

    await page.waitForFunction(() => document.fonts.ready)
    // 'load' instead of 'networkidle': the /contact Turnstile iframe keeps the
    // network active indefinitely, so networkidle never resolves on that route.
    await page.waitForLoadState('load')

    if (route.path === '/') {
      // Pause the showreel at frame 0 so the video thumbnail and canvas
      // glow mirror are deterministic across runs.
      await page.evaluate(() => {
        const video = document.querySelector<HTMLVideoElement>('.showreel-video')
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      })
      // Give the canvas mirror one frame to repaint the poster state.
      await page.waitForTimeout(100)
    }

    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      // Mask the Lahore clock (live time) and Turnstile widget (Cloudflare iframe
      // renders differently between test and production keys, causing false diffs).
      mask: [page.locator('.footer-clock'), page.locator('.turnstile-wrap')],
      animations: 'disabled',
      fullPage: true,
    })
  })
}
