import { test, expect, type Page } from '@playwright/test'

// Contact form tests run on Chromium only: Turnstile widget behaviour and
// Server Action logic are not browser-specific, and the 5-min rate-limit
// window is shared in-memory across all parallel browser processes.
test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Contact form tests run on Chromium only.')
})

class ContactPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/contact') }

  get nameInput()        { return this.page.locator('#contact-name') }
  get emailInput()       { return this.page.locator('#contact-email') }
  get messageInput()     { return this.page.locator('#contact-message') }
  get submitButton()     { return this.page.getByRole('button', { name: /Send message/i }) }
  get successContainer() { return this.page.locator('.contact-success') }
  get nameError()        { return this.page.locator('#error-name') }
  get emailError()       { return this.page.locator('#error-email') }
  get messageError()     { return this.page.locator('#error-message') }
  get formErrorBanner()  { return this.page.locator('.form-error-banner') }

  async waitForTurnstile() {
    // Cloudflare always-pass test key (1x00000000000000000000AA) populates
    // the hidden cf-turnstile-response input automatically without interaction.
    await this.page.waitForFunction(
      () => {
        const input = document.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')
        return input !== null && input.value.length > 0
      },
      { timeout: 15_000 },
    )
  }

  async fill(opts: { name?: string; email?: string; message?: string }) {
    if (opts.name    !== undefined) await this.nameInput.fill(opts.name)
    if (opts.email   !== undefined) await this.emailInput.fill(opts.email)
    if (opts.message !== undefined) await this.messageInput.fill(opts.message)
  }
}

test.describe('contact form', () => {
  test('happy path: valid submission shows success state', async ({ page }) => {
    // Unique IP per test: prevents rate-limit bucket sharing across parallel workers.
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': '10.test.happy.1' })
    const contact = new ContactPage(page)
    await contact.goto()
    await contact.fill({
      name:    'Test User',
      email:   'test@example.com',
      message: 'This is a test message from the Playwright suite.',
    })
    await contact.waitForTurnstile()
    await contact.submitButton.click()

    await expect(contact.successContainer).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.contact-success-heading')).toContainText('Message received.')
    await expect(page.locator('.contact-success-body')).toContainText('Test User')
  })

  test('validation: empty submit shows field errors', async ({ page }) => {
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': '10.test.valid.2' })
    const contact = new ContactPage(page)
    await contact.goto()
    await contact.waitForTurnstile()
    await contact.submitButton.click()

    // Server-side Zod validation returns field-level errors for required fields.
    await expect(contact.nameError).toBeVisible({ timeout: 5_000 })
    await expect(contact.emailError).toBeVisible()
    await expect(contact.messageError).toBeVisible()
    await expect(contact.successContainer).not.toBeVisible()
  })

  test('rate limit: second submission is blocked; window expires correctly', async ({ page }) => {
    // Unique IP isolates this test from the happy-path test's rate-limit bucket.
    // RATE_LIMIT_TEST_MODE=true → 8s window (set in playwright.config.ts webServer.env).
    await page.setExtraHTTPHeaders({ 'x-forwarded-for': '10.test.limit.3' })
    const contact = new ContactPage(page)
    await contact.goto()
    await contact.fill({
      name:    'Rate Limit Test',
      email:   'ratelimit@example.com',
      message: 'First submission for rate limit test.',
    })
    await contact.waitForTurnstile()
    await contact.submitButton.click()
    await expect(contact.successContainer).toBeVisible({ timeout: 10_000 })

    // Second submission within the 2-second window must be blocked.
    await page.goto('/contact')
    await contact.fill({
      name:    'Rate Limit Test',
      email:   'ratelimit@example.com',
      message: 'Second submission — must be blocked.',
    })
    await contact.waitForTurnstile()
    await contact.submitButton.click()
    await expect(contact.formErrorBanner).toBeVisible({ timeout: 5_000 })
    await expect(contact.formErrorBanner).toContainText(/Too many submissions/i)

    // After the 8-second window expires, submission should succeed again.
    await page.waitForTimeout(8500)
    await page.goto('/contact')
    await contact.fill({
      name:    'Rate Limit Test',
      email:   'ratelimit@example.com',
      message: 'Third submission after window expired — must succeed.',
    })
    await contact.waitForTurnstile()
    await contact.submitButton.click()
    await expect(contact.successContainer).toBeVisible({ timeout: 10_000 })
  })
})
