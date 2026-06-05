import { test, expect } from '@playwright/test'

test.describe('legacy URL handling', () => {
  // These slugs changed in Phase 13.5. Old URLs must return 404, not a broken page.
  test('old slug /projects/character-creator → 404', async ({ request }) => {
    const response = await request.get('/projects/character-creator')
    expect(response.status()).toBe(404)
  })

  test('old slug /projects/tresemme-metaverse → 404', async ({ request }) => {
    const response = await request.get('/projects/tresemme-metaverse')
    expect(response.status()).toBe(404)
  })

  test('keystatic: not accessible in production', async ({ request }) => {
    test.skip(
      !process.env.PLAYWRIGHT_BASE_URL,
      'Keystatic admin is intentionally accessible at localhost via mode: local. This test only runs against remote PLAYWRIGHT_BASE_URL.',
    )
    const response = await request.get('/keystatic')
    expect([404, 403]).toContain(response.status())
  })
})
