import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? 'list' : 'html',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  expect: {
    timeout: 8000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  webServer: BASE_URL.startsWith('http://localhost')
    ? {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'ignore',
        stderr: 'pipe',
        timeout: 60_000,
        env: {
          RESEND_MOCK: 'true',
          RESEND_API_KEY: 'test_resend_key_placeholder',
          RATE_LIMIT_TEST_MODE: 'true',
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
          TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
        },
      }
    : undefined,

  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-desktop',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome',    use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari',    use: { ...devices['iPhone 13'] } },
  ],
})
