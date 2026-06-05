import { test, expect } from '@playwright/test'

test.describe('desktop nav', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('Work link navigates to /work', async ({ page }) => {
    await page.goto('/')
    // Wait for Next.js hydration before clicking — WebKit can race between
    // the App Router's history.replaceState on hydration and the URL assertion.
    await page.waitForFunction(() => document.documentElement.dataset['nextjsRouterReady'] !== 'false')
    await page.locator('.nav-link', { hasText: /^Work$/ }).click()
    await page.waitForURL(/\/work/, { timeout: 15000 })
  })

  test('About link navigates to /about', async ({ page }) => {
    await page.goto('/work')
    await page.locator('.nav-link', { hasText: /^About$/ }).click()
    await expect(page).toHaveURL(/\/about/)
  })

  test('S-logo navigates to /', async ({ page }) => {
    await page.goto('/about')
    await page.locator('.s-logo').first().click()
    await expect(page).toHaveURL('/')
  })
})

test.describe('mobile nav', () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true })

  test('hamburger opens menu', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-burger').first().click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
  })

  test('Escape closes menu', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-burger').first().click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-menu')).not.toBeVisible()
  })

  test('menu link navigates and closes menu', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-burger').first().click()
    await expect(page.locator('#mobile-menu')).toBeVisible()
    // mm-link text is "Work→" (arrow span appended); use prefix regex to match
    await page.locator('.mm-link', { hasText: /^Work/ }).click()
    await page.waitForURL(/\/work/, { timeout: 15000 })
    // MobileMenu stays in DOM (visibility:hidden, not display:none) after close.
    // Check the CSS property directly rather than toBeVisible() which checks
    // the full visibility chain and can race with React's state flush.
    await expect(page.locator('#mobile-menu')).toHaveCSS('visibility', 'hidden')
  })
})

test.describe('footer links', () => {
  test('RSS feed link is present and points to /feed.xml', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="/feed.xml"]').first()).toBeVisible()
  })

  test('resume PDF link resolves (200)', async ({ request }) => {
    const response = await request.get('/resume.pdf')
    expect([200, 302]).toContain(response.status())
  })
})

test.describe('skip-to-content', () => {
  test('skip link is present and focuses #main-content on activation', async ({ page }) => {
    await page.goto('/')
    // Focus the skip link directly — tab-from-URL-bar behaviour varies by browser
    await page.locator('.skip-link').focus()
    await expect(page.locator('.skip-link')).toBeVisible()
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.locator('.skip-link').click()
    await expect(page.locator('#main-content')).toBeFocused()
  })
})
