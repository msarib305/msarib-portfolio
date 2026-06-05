import { test, expect } from '@playwright/test'

// SEO metadata checks are structural. Run on Chromium only.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'SEO metadata checks run on Chromium only.')
})

const PRIMARY_ROUTES = [
  '/',
  '/work',
  '/about',
  '/writings',
  '/contact',
  '/projects/anime-stylized-action-tgs2024',
]

for (const route of PRIMARY_ROUTES) {
  test.describe(`SEO: ${route}`, () => {
    test('has valid JSON-LD with @type', async ({ page }) => {
      await page.goto(route)
      const ldScripts = await page.locator('script[type="application/ld+json"]').all()
      expect(ldScripts.length, `No JSON-LD found on ${route}`).toBeGreaterThan(0)
      for (const script of ldScripts) {
        const text = await script.textContent()
        const parsed = JSON.parse(text ?? '{}') as Record<string, unknown>
        // Accept both flat schema ({ "@type": "..." }) and @graph array schemas
        // (e.g. homepage uses { "@graph": [{ "@type": "Person" }, ...] })
        const graph = parsed['@graph']
        const hasType  = parsed['@type'] != null
        const hasGraph =
          Array.isArray(graph) &&
          graph.length > 0 &&
          (graph as Array<Record<string, unknown>>).every(item => item['@type'] != null)
        expect(hasType || hasGraph, `JSON-LD missing @type on ${route}`).toBe(true)
      }
    })

    test('has canonical URL pointing to msarib.dev', async ({ page }) => {
      await page.goto(route)
      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveAttribute('href', /^https:\/\/msarib\.dev/)
    })

    test('has og:image with absolute URL', async ({ page }) => {
      await page.goto(route)
      const ogImage = page.locator('meta[property="og:image"]')
      await expect(ogImage).toHaveAttribute('content', /^https?:\/\//)
    })

    test('html element has lang="en"', async ({ page }) => {
      await page.goto(route)
      const lang = await page.locator('html').getAttribute('lang')
      expect(lang).toBe('en')
    })

    test('has viewport meta with width=device-width', async ({ page }) => {
      await page.goto(route)
      const viewport = page.locator('meta[name="viewport"]')
      await expect(viewport).toHaveAttribute('content', /width=device-width/)
    })
  })
}
