import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// axe-core produces identical results across browsers for structural violations.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Accessibility checks run on Chromium only.')
})

const A11Y_ROUTES = [
  '/',
  '/work',
  '/about',
  '/writings',
  '/contact',
  '/projects/anime-stylized-action-tgs2024',
]

for (const route of A11Y_ROUTES) {
  test(`a11y: ${route} has zero critical/serious violations`, async ({ page }) => {
    await page.goto(route)

    const results = await new AxeBuilder({ page })
      .exclude('.showreel-glow-canvas') // aria-hidden decorative canvas
      .analyze()

    const serious = results.violations.filter(
      v => v.impact === 'serious' || v.impact === 'critical',
    )

    if (results.violations.length > 0) {
      console.log(`[a11y] ${route} — ${results.violations.length} violation(s):`)
      for (const v of results.violations) {
        console.log(`  [${v.impact ?? 'unknown'}] ${v.id}: ${v.description}`)
      }
    }

    expect(
      serious,
      `${route}: ${serious.length} serious/critical violation(s): ${serious.map(v => v.id).join(', ')}`,
    ).toHaveLength(0)
  })
}
