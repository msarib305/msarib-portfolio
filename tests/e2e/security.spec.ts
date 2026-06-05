import { test, expect } from '@playwright/test'

// External link security checks are structural (HTML attribute presence).
// No cross-browser difference; run on Chromium only.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'External link security checks run on Chromium only.')
})

const SAMPLE_ROUTES = [
  '/',
  '/work',
  '/about',
  '/contact',
  '/projects/anime-stylized-action-tgs2024',
]

for (const route of SAMPLE_ROUTES) {
  test(`external links on ${route} have noopener + noreferrer`, async ({ page }) => {
    await page.goto(route)

    const externalLinks = await page.locator('a[target="_blank"]').all()

    for (const link of externalLinks) {
      const href = (await link.getAttribute('href')) ?? '(no href)'
      const rel  = (await link.getAttribute('rel')) ?? ''
      expect(rel, `Missing noopener on ${href}`).toContain('noopener')
      expect(rel, `Missing noreferrer on ${href}`).toContain('noreferrer')
    }
  })
}
