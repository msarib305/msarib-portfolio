import { test, expect } from '@playwright/test'

// XML parsing provides no additional signal across browsers.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Sitemap validation runs on Chromium only.')
})

const EXPECTED_PATHS = [
  '/',
  '/work',
  '/about',
  '/writings',
  '/contact',
  '/projects/anime-stylized-action-tgs2024',
  '/projects/character-creator-system',
  '/projects/convai-npc-integration',
  '/projects/exarta-metaverse',
  '/projects/exarta-uefn-portfolio',
  '/projects/nvidia-ai-assistant',
  '/projects/samurai-saga',
  '/projects/tresemme-tresverse',
  '/projects/xandar',
]

test('sitemap: contains all expected routes', async ({ request }) => {
  const response = await request.get('/sitemap.xml')

  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/application\/xml/)

  const body = await response.text()
  expect(body).toContain('<urlset')

  for (const path of EXPECTED_PATHS) {
    expect(body, `Expected ${path} in sitemap`).toContain(`msarib.dev${path}`)
  }

  // Every <url> entry should carry lastmod, changefreq, and priority
  expect(body).toContain('<lastmod>')
  expect(body).toContain('<changefreq>')
  expect(body).toContain('<priority>')
})

test('sitemap: lastmod values are valid ISO 8601 dates', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  const body = await response.text()

  const lastmodValues = [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]!)
  expect(lastmodValues.length).toBeGreaterThan(0)

  for (const value of lastmodValues) {
    const date = new Date(value)
    expect(isNaN(date.getTime()), `Invalid ISO 8601 date: ${value}`).toBe(false)
  }
})

test('sitemap: priority values are between 0.0 and 1.0', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  const body = await response.text()

  const priorityValues = [...body.matchAll(/<priority>([^<]+)<\/priority>/g)].map(m =>
    parseFloat(m[1]!),
  )
  expect(priorityValues.length).toBeGreaterThan(0)

  for (const value of priorityValues) {
    expect(value, `Priority out of range: ${value}`).toBeGreaterThanOrEqual(0.0)
    expect(value, `Priority out of range: ${value}`).toBeLessThanOrEqual(1.0)
  }
})
