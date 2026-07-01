import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Test against a remote URL (preview/prod) by setting PLAYWRIGHT_BASE_URL.
 * When unset, tests run against a locally started dev server (see webServer).
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

/**
 * Viewport values are CSS points (logical), not physical pixels.
 * Physical resolution = viewport * deviceScaleFactor (DPR). Screenshots render at DPR.
 */
/** 4K 16:10 (3840 x 2400). "4K" = 3840 wide; 16:10 height = 3840 * 10 / 16. */
const fourK1610 = { width: 3840, height: 2400 };
/** Ultrawide 21:9 (3440 x 1440). */
const ultrawide219 = { width: 3440, height: 1440 };
/** MacBook 14"-class CSS viewport; matches the repo's 1512-wide reference screenshots. DPR 2 = retina. */
const macbook = { width: 1512, height: 982 };

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/about')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers + devices */
  projects: [
    /* ---- Desktop engines ---- */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* ---- 4K / 16:10 desktops (wide-viewport, full-bleed + DEC-083 1440-cap checks) ---- */
    {
      name: 'chromium-4k-16:10',
      use: { ...devices['Desktop Chrome'], viewport: fourK1610, deviceScaleFactor: 1 },
    },
    {
      name: 'webkit-4k-16:10',
      use: { ...devices['Desktop Safari'], viewport: fourK1610, deviceScaleFactor: 1 },
    },

    /* ---- Mobile (393px = repo reference width) ---- */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }, // 393x727, Blink
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15'] }, // 393x659, matches repo mobile reference
    },

    /* ---- Android: old low-end -> current flagship ---- */
    {
      name: 'Android Low-End',
      use: { ...devices['Galaxy S5'] }, // 2014, 360x640, lowest common Android width
    },
    {
      // "Galaxy S27 Ultra"-class flagship: no stock descriptor exists, so model it
      // from real S-Ultra specs (CSS ~412x915, DPR 3.5) on the Galaxy S24 Blink base.
      name: 'Android Flagship',
      use: {
        ...devices['Galaxy S24'],
        viewport: { width: 412, height: 915 },
        deviceScaleFactor: 3.5,
      },
    },

    /* ---- iOS: old -> current flagship ---- */
    {
      // Stock descriptor ships DPR 3; the real XR is the LCD @2x model (DPR 2).
      name: 'iPhone XR',
      use: { ...devices['iPhone XR'], deviceScaleFactor: 2 }, // 414x896 @2x = 828x1792
    },
    {
      name: 'iPhone 17 Pro Max',
      use: { ...devices['iPhone 17 Pro Max'] }, // 440x763 @3x = 1320x2289, WebKit
    },

    /* ---- Tablet: touch surface for pointer:coarse / 44px target rules (25.7.e) ---- */
    {
      name: 'iPad Pro 11 (Safari)',
      use: { ...devices['iPad Pro 11'] }, // 834x1194 @2x, WebKit, touch
    },

    /* ---- MacBook 1512 (the repo's actual reference-screenshot width) ---- */
    {
      name: 'MacBook Chrome',
      use: { ...devices['Desktop Chrome'], viewport: macbook, deviceScaleFactor: 2 },
    },
    {
      name: 'MacBook Safari',
      use: { ...devices['Desktop Safari'], viewport: macbook, deviceScaleFactor: 2 },
    },

    /* ---- Ultrawide 21:9 (full-bleed wash beyond 16:10) ---- */
    {
      name: 'chromium-ultrawide-21:9',
      use: { ...devices['Desktop Chrome'], viewport: ultrawide219, deviceScaleFactor: 1 },
    },

    /* ---- Branded channels: real Chrome / Edge vs bundled Chromium ---- */
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },

    /* ---- Accessibility / preference emulation (DEC-089) ---- */
    {
      // reducedMotion/forcedColors are not top-level test `use` options in this
      // Playwright version; they live under contextOptions (BrowserContextOptions).
      name: 'reduced-motion',
      use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
    },
    {
      name: 'forced-colors',
      use: { ...devices['Desktop Chrome'], contextOptions: { forcedColors: 'active' } },
    },
    {
      name: 'dark-mode',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
  ],

  /* Start the dev server locally; skip when testing a remote PLAYWRIGHT_BASE_URL. */
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
