import { test, expect } from '@playwright/test'

// robots.txt content is served identically across browsers.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'robots.txt checks run on Chromium only.')
})

test('robots.txt: content and directives', async ({ request }) => {
  const response = await request.get('/robots.txt')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/text\/plain/)

  const body = await response.text()

  expect(body).toContain('Disallow: /keystatic/')
  expect(body).toContain('Disallow: /api/')
  expect(body).toContain('Sitemap: https://msarib.dev/sitemap.xml')
})
