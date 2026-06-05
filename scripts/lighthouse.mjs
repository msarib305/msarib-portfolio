#!/usr/bin/env node
/**
 * Lighthouse runner.
 *
 * Reuses the Playwright-bundled chromium binary so no system Chrome
 * install is needed. Runs mobile + desktop profiles against every
 * route, saves JSON reports to ./lighthouse-reports, and prints a
 * one-screen summary.
 *
 * Usage:
 *   pnpm dev    # in another shell, or:
 *   pnpm build && pnpm start &
 *   node scripts/lighthouse.mjs                          # all pages
 *   node scripts/lighthouse.mjs /about /work             # specific
 *   BASE_URL=http://localhost:3000 node scripts/lighthouse.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const OUT_DIR  = resolve(ROOT, 'lighthouse-reports')
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const CHROME_BIN = process.env.CHROME_PATH ??
  '/home/sarib/.cache/ms-playwright/chromium-1224/chrome-linux64/chrome'

const DEFAULT_ROUTES = [
  '/',
  '/work',
  '/about',
  '/writings',
  '/contact',
  '/projects/anime-stylized-action-tgs2024',
]

const requested = process.argv.slice(2)
const routes = requested.length > 0 ? requested : DEFAULT_ROUTES

// Two profiles: mobile (Moto G Power 3G-throttled) and desktop.
const PROFILES = ['mobile', 'desktop']

/**
 * Launch a chrome instance via chrome-launcher. We import the
 * package dynamically because lighthouse re-exports it via a
 * sibling path; this stays robust across upgrades.
 */
async function launchChrome() {
  const chromeLauncher = await import('chrome-launcher')
  return chromeLauncher.launch({
    chromePath: CHROME_BIN,
    chromeFlags: [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI,AutomationControlled',
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-sync',
      '--mute-audio',
    ],
  })
}

async function runOne(url, profile, port) {
  const lighthouse = (await import('lighthouse')).default
  const flags = {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  }
  const config = profile === 'desktop'
    ? (await import('lighthouse/core/config/desktop-config.js')).default
    : undefined
  const runnerResult = await lighthouse(url, flags, config)
  return runnerResult?.lhr ?? null
}

function fmtScore(s) {
  if (s == null) return '  - '
  const pct = Math.round(s * 100)
  const colour = pct >= 90 ? '\x1b[32m' : pct >= 50 ? '\x1b[33m' : '\x1b[31m'
  return `${colour}${String(pct).padStart(3)}\x1b[0m`
}

function fmtMs(v) {
  if (v == null) return '   - '
  return `${Math.round(v).toString().padStart(5)}`
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { method: 'GET' })
      if (r.ok || r.status === 404) return true
    } catch { /* not ready */ }
    await new Promise(r => setTimeout(r, 500))
  }
  return false
}

async function main() {
  console.log(`\n[lighthouse] base: ${BASE_URL}`)
  console.log(`[lighthouse] routes (${routes.length}): ${routes.join(' ')}\n`)

  const ok = await waitForServer(BASE_URL)
  if (!ok) {
    console.error(`[lighthouse] ${BASE_URL} not reachable. Start the server first.`)
    process.exit(1)
  }

  const chrome = await launchChrome()
  const summary = []
  try {
    for (const route of routes) {
      const url = BASE_URL.replace(/\/$/, '') + route
      for (const profile of PROFILES) {
        process.stdout.write(`[lighthouse] ${profile.padEnd(7)} ${route} ... `)
        const t0 = Date.now()
        let lhr
        try {
          lhr = await runOne(url, profile, chrome.port)
        } catch (err) {
          console.log(`\x1b[31mfailed\x1b[0m ${err?.message ?? err}`)
          continue
        }
        const took = ((Date.now() - t0) / 1000).toFixed(1)
        if (!lhr) {
          console.log('\x1b[31mno report\x1b[0m')
          continue
        }
        const slug = route.replace(/\//g, '_') || '_home'
        writeFileSync(
          join(OUT_DIR, `${slug}-${profile}.json`),
          JSON.stringify(lhr, null, 2),
        )
        const s = lhr.categories
        const a = lhr.audits
        summary.push({
          route,
          profile,
          perf:  s.performance?.score ?? null,
          a11y:  s.accessibility?.score ?? null,
          best:  s['best-practices']?.score ?? null,
          seo:   s.seo?.score ?? null,
          lcp:   a['largest-contentful-paint']?.numericValue ?? null,
          cls:   a['cumulative-layout-shift']?.numericValue ?? null,
          tbt:   a['total-blocking-time']?.numericValue ?? null,
          fcp:   a['first-contentful-paint']?.numericValue ?? null,
          si:    a['speed-index']?.numericValue ?? null,
          tti:   a['interactive']?.numericValue ?? null,
        })
        console.log(`\x1b[32mok\x1b[0m (${took}s)`)
      }
    }
  } finally {
    await chrome.kill()
  }

  // Print summary table.
  console.log('\n=== Summary ===')
  console.log(
    '  route                                      profile  perf a11y best seo   lcp   cls   tbt   fcp    si   tti',
  )
  console.log(
    '  ' + '-'.repeat(105),
  )
  for (const r of summary) {
    console.log(
      '  ' +
      r.route.padEnd(42) + ' ' +
      r.profile.padEnd(7) + ' ' +
      fmtScore(r.perf) + ' ' +
      fmtScore(r.a11y) + ' ' +
      fmtScore(r.best) + ' ' +
      fmtScore(r.seo) + ' ' +
      fmtMs(r.lcp) + ' ' +
      (r.cls != null ? r.cls.toFixed(3).padStart(5) : '   - ') + ' ' +
      fmtMs(r.tbt) + ' ' +
      fmtMs(r.fcp) + ' ' +
      fmtMs(r.si) + ' ' +
      fmtMs(r.tti),
    )
  }
  console.log('')
  writeFileSync(
    join(OUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
