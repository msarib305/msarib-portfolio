import { test, expect } from '@playwright/test'

const CASES = [
  { slug: 'anime-stylized-action-tgs2024',  hasSpoilerLink: true,  hasGallery: true  },
  { slug: 'character-creator-system',       hasSpoilerLink: false, hasGallery: true  },
  { slug: 'exarta-metaverse',               hasSpoilerLink: false, hasGallery: true  },
  { slug: 'exarta-uefn-portfolio',          hasSpoilerLink: false, hasGallery: false },
  { slug: 'nvidia-ai-assistant',            hasSpoilerLink: false, hasGallery: true  },
  { slug: 'samurai-saga',                   hasSpoilerLink: false, hasGallery: true  },
  { slug: 'tresemme-tresverse',             hasSpoilerLink: false, hasGallery: true  },
  { slug: 'xandar',                         hasSpoilerLink: false, hasGallery: true  },
] as const

for (const c of CASES) {
  test(`case study shape: /projects/${c.slug}`, async ({ page }) => {
    const errors: Error[] = []
    page.on('pageerror', err => errors.push(err))

    const response = await page.goto(`/projects/${c.slug}`)
    expect(response?.status()).toBe(200)

    // Cover: first .case-media-frame is the hero cover (exarta-uefn-portfolio has
    // additional .case-media-frame wrappers in the body for inline YouTube sections)
    await expect(page.locator('.case-media-frame').first()).toBeVisible()
    const hasImage   = (await page.locator('.case-media-frame').first().locator('img').count()) > 0
    const hasYoutube = (await page.locator('.case-media-frame').first().locator('[role="button"]').count()) > 0
    expect(hasImage || hasYoutube, `Expected image or YouTube embed on ${c.slug}`).toBe(true)

    // Specs row
    await expect(page.locator('.case-specs')).toBeVisible()
    await expect(page.locator('.case-spec-row').first()).toBeVisible()

    // Body heading
    await expect(page.locator('article h2, article h3').first()).toBeVisible()

    // CaseStudyNav: always present (links to prev/next or back to /work)
    await expect(page.locator('.case-nav')).toBeVisible()
    await expect(page.locator('.case-nav-link').first()).toBeVisible()

    // SpoilerLink: only anime-stylized-action-tgs2024 has one
    if (c.hasSpoilerLink) {
      await expect(page.locator('.spoiler-link')).toBeVisible()
      await expect(page.locator('.spoiler-warning')).toBeVisible()
    } else {
      expect(await page.locator('.spoiler-link').count()).toBe(0)
    }

    // Gallery: all gallery types (image, video, instagram) render inside .gallery-item
    if (c.hasGallery) {
      await expect(page.locator('.gallery-grid')).toBeVisible()
      expect(await page.locator('.gallery-item').count()).toBeGreaterThan(0)
    }

    expect(errors).toHaveLength(0)
  })
}

// YouTubeEmbed behavior — tested via the anime case study cover (type: video)
test.describe('YouTubeEmbed behavior (anime case study cover)', () => {
  test('initial state shows thumbnail button, no iframe', async ({ page }) => {
    await page.goto('/projects/anime-stylized-action-tgs2024')
    // The cover div renders as a role="button" with aria-label="Play ..."
    await expect(page.locator('.case-media-frame [role="button"]')).toBeVisible()
    expect(await page.locator('.youtube-iframe').count()).toBe(0)
  })

  test('click activates iframe with youtube-nocookie src', async ({ page }) => {
    await page.goto('/projects/anime-stylized-action-tgs2024')
    await page.locator('.case-media-frame [role="button"]').click()
    const iframe = page.locator('.youtube-iframe')
    await expect(iframe).toBeVisible({ timeout: 5000 })
    await expect(iframe).toHaveAttribute('src', /youtube-nocookie\.com/)
  })
})

// SpoilerLink behavior — anime-stylized-action-tgs2024 only
test.describe('SpoilerLink behavior (anime case study)', () => {
  test.describe('desktop: hover removes blur', () => {
    test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false })

    test('hover on .spoiler-url removes the blur filter', async ({ page }) => {
      await page.goto('/projects/anime-stylized-action-tgs2024')
      await expect(page.locator('.spoiler-url')).toBeVisible()

      // Blur is applied via CSS filter; hover should remove it.
      // poll until the 150ms CSS transition completes.
      await page.hover('.spoiler-url')
      await page.waitForFunction(
        () => {
          const el = document.querySelector('.spoiler-url')
          return el ? !window.getComputedStyle(el).filter.includes('blur') : false
        },
        { timeout: 2000 },
      )
    })
  })

  test.describe('mobile: tap reveals link', () => {
    test.use({ viewport: { width: 375, height: 812 }, hasTouch: true })

    test('first tap adds .spoiler-revealed class', async ({ page }) => {
      await page.goto('/projects/anime-stylized-action-tgs2024')
      await expect(page.locator('.spoiler-url')).toBeVisible()
      await page.tap('.spoiler-url')
      await expect(page.locator('.spoiler-url')).toHaveClass(/spoiler-revealed/)
    })

    test('after reveal, link href points to the spoiler destination', async ({ page }) => {
      await page.goto('/projects/anime-stylized-action-tgs2024')
      await page.tap('.spoiler-url')
      await expect(page.locator('.spoiler-url')).toHaveClass(/spoiler-revealed/)
      // Verify the real link destination is accessible without navigating to it
      const href = await page.locator('.spoiler-url').getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).not.toBe('')
    })
  })
})
