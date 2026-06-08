import { test, expect } from '@playwright/test'

const PRIMARY_ROUTES = [
  { path: '/',                                        title: /Sarib/ },
  { path: '/work',                                    title: /Work/ },
  { path: '/about',                                   title: /About/ },
  { path: '/writings',                                title: /Writings/ },
  { path: '/contact',                                 title: /Contact/ },
  { path: '/projects/anime-stylized-action-tgs2024', title: /Stylized|Anime/i },
  { path: '/projects/character-creator-system',      title: /Character/i },
  { path: '/projects/exarta-metaverse',              title: /Exarta/i },
  { path: '/projects/exarta-uefn-portfolio',         title: /UEFN|Exarta/i },
  { path: '/projects/nvidia-ai-assistant',           title: /NVIDIA|AI/i },
  { path: '/projects/samurai-saga',                  title: /Samurai/i },
  { path: '/projects/tresemme-tresverse',            title: /TRESemmé|Tresverse/i },
  { path: '/projects/xandar',                        title: /Xandar/i },
] as const

const ASSET_ROUTES = [
  { path: '/feed.xml',    contentType: /application\/rss\+xml/ },
  { path: '/sitemap.xml', contentType: /application\/xml/ },
  { path: '/robots.txt',  contentType: /text\/plain/ },
  { path: '/favicon.ico', contentType: /image\/(x-icon|vnd\.microsoft\.icon)/ },
] as const

for (const route of PRIMARY_ROUTES) {
  test(`smoke: ${route.path}`, async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', err => errors.push(err))

    const response = await page.goto(route.path)

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(route.title)
    expect(
      errors,
      `Uncaught JS errors on ${route.path}: ${errors.map(e => e.message).join(', ')}`,
    ).toHaveLength(0)
  })
}

for (const asset of ASSET_ROUTES) {
  test(`smoke: ${asset.path}`, async ({ request }) => {
    const response = await request.get(asset.path)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toMatch(asset.contentType)
  })
}

test('smoke: /og image returns 1200x630 PNG', async ({ request }) => {
  const response = await request.get('/og?title=Test&eyebrow=Smoke')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/image\/png/)
  const buffer = await response.body()
  // PNG signature: first 4 bytes are 89 50 4E 47; bytes 16-19 = width, 20-23 = height (big-endian)
  expect(buffer[0]).toBe(0x89)
  expect(buffer[1]).toBe(0x50) // P
  expect(buffer[2]).toBe(0x4e) // N
  expect(buffer[3]).toBe(0x47) // G
  const width  = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  expect(width).toBe(1200)
  expect(height).toBe(630)
})

test('smoke: non-existent route returns 404 page', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.locator('h1').first()).toBeVisible({ timeout: 5000 })
})
