import { test, expect } from '@playwright/test'

// XML structure checks provide no additional signal across browsers.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Feed validation runs on Chromium only.')
})

test('RSS feed: structure, content-type, and atom self-link', async ({ request }) => {
  const response = await request.get('/feed.xml')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/application\/rss\+xml/)

  const body = await response.text()

  // Well-formed XML declaration
  expect(body.startsWith('<?xml')).toBe(true)

  // RSS 2.0 structure
  expect(body).toContain('<rss')
  expect(body).toContain('<channel>')
  expect(body).toContain('<title>')
  expect(body).toContain('<link>')
  expect(body).toContain('<description>')
  expect(body).toContain('</channel>')
  expect(body).toContain('</rss>')

  // Atom self-link for feed readers
  expect(body).toContain('rel="self"')
  expect(body).toMatch(/href="[^"]*\/feed\.xml"/)
})
