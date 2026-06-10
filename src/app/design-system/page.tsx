import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SLogo }      from '@/components/SLogo'
import { PillButton } from '@/components/PillButton'
import { PillBadge }  from '@/components/PillBadge'
import { Gallery, type MediaItem } from '@/components/Gallery'
import { ImageGrid, type ImageGridItem } from '@/components/ImageGrid'

export const metadata: Metadata = {
  title: 'Design System (internal)',
  robots: { index: false, follow: false },
}

const ArrowRight = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs text-text-muted tracking-eyebrow uppercase mb-6">
      {children}
    </p>
  )
}

// One item per media type. Real assets where they exist; the GIF reuses the
// showreel video as a stand-in (no true GIF asset exists yet) and both Instagram
// items omit thumbnailUrl so the brand-neutral placeholder is exercised.
const GALLERY_DEMO: MediaItem[] = [
  { type: 'image',          cloudinaryId: 'https://res.cloudinary.com/ddgwzcrim/image/upload/Lily_9_ce4kp1.jpg', alt: 'Static Cloudinary image demo', caption: 'Image (Cloudinary static)' },
  { type: 'video',          cloudinaryId: 'portfolio-showreel', accessibleName: 'Cloudinary video demo', caption: 'Video (Cloudinary MP4 with controls)' },
  { type: 'gif',            cloudinaryId: 'portfolio-showreel', alt: 'GIF autoplay-loop demo', caption: 'GIF (Cloudinary autoplay loop, stand-in asset)' },
  { type: 'youtube',        videoId: '16SzQjJ58Dc', accessibleName: 'YouTube embed demo', caption: 'YouTube (privacy-enhanced embed)' },
  { type: 'instagram-reel', postUrl: 'https://www.instagram.com/reel/C3tHZnFsSlt', accessibleName: 'Instagram Reel embed demo', caption: 'Instagram Reel (placeholder until activated)' },
  { type: 'instagram-post', postUrl: 'https://www.instagram.com/reel/C6tQKTQuKUt', accessibleName: 'Instagram Post embed demo', caption: 'Instagram Post (placeholder until activated)' },
]

// Four real Cloudinary assets, rendered as a 2x2 grid. One item carries a caption
// to exercise the figcaption path. ImageGrid is static (no carousel, no modal):
// the prose-image counterpart to the interactive Gallery above.
const IMAGE_GRID_DEMO: ImageGridItem[] = [
  { src: 'https://res.cloudinary.com/ddgwzcrim/image/upload/BeautyMatter_Press_Release_eb9sjz.png', alt: 'Press coverage from BeautyMatter', caption: 'Captioned item (exercises figcaption)' },
  { src: 'https://res.cloudinary.com/ddgwzcrim/image/upload/happi_Press_Release_cwmp8d.png',        alt: 'Press coverage from Happi' },
  { src: 'https://res.cloudinary.com/ddgwzcrim/image/upload/ParlayMe_Press_Release_ufepyf.png',     alt: 'Press coverage from ParlayMe' },
  { src: 'https://res.cloudinary.com/ddgwzcrim/image/upload/IGN_Pakistan_Press_Release_vxf1d4.png', alt: 'Press coverage from IGN Pakistan' },
]

// Two small galleries (two items each) rendered together so both sit in the viewport
// at once. Permanent regression surface for multi-instance behavior (Phase 19.6.3,
// DEC-081): arrow keys are inert on inline strips, state is isolated per instance,
// and fullscreen is one-at-a-time. Reuses assets already referenced on this page.
const MULTI_GALLERY_X: MediaItem[] = [
  { type: 'image', cloudinaryId: 'https://res.cloudinary.com/ddgwzcrim/image/upload/Lily_9_ce4kp1.jpg',                       alt: 'Gallery X item 1' },
  { type: 'image', cloudinaryId: 'https://res.cloudinary.com/ddgwzcrim/image/upload/BeautyMatter_Press_Release_eb9sjz.png',  alt: 'Gallery X item 2' },
]

const MULTI_GALLERY_Y: MediaItem[] = [
  { type: 'image', cloudinaryId: 'https://res.cloudinary.com/ddgwzcrim/image/upload/happi_Press_Release_cwmp8d.png',         alt: 'Gallery Y item 1' },
  { type: 'image', cloudinaryId: 'https://res.cloudinary.com/ddgwzcrim/image/upload/ParlayMe_Press_Release_ufepyf.png',      alt: 'Gallery Y item 2' },
]

function configSummary(item: MediaItem): string {
  switch (item.type) {
    case 'image':
    case 'gif':
    case 'video':           return item.cloudinaryId
    case 'youtube':         return `videoId: ${item.videoId}`
    case 'instagram-reel':
    case 'instagram-post':  return item.postUrl
  }
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-dvh bg-bg px-8 py-16 space-y-20 max-w-4xl mx-auto">

      <section>
        <Label>S-Logo / mark sizes</Label>
        <div className="flex flex-wrap items-center gap-8">
          <SLogo size={24} ariaLabel="S-logo 24px" />
          <SLogo size={48} ariaLabel="S-logo 48px" />
          <SLogo size={96} ariaLabel="S-logo 96px" />
        </div>
      </section>

      <section>
        <Label>S-Logo / with text label</Label>
        <div className="flex flex-wrap items-center gap-8">
          <SLogo ariaLabel="S-logo default" showText textLabel="SARIB" subText="Lead UE5 Developer" />
          <SLogo className="s-logo-lg" ariaLabel="S-logo lg" showText textLabel="SARIB" subText="Lead UE5 Developer" />
          <SLogo className="s-logo-xl" ariaLabel="S-logo xl" showText textLabel="SARIB" />
        </div>
        <p className="font-mono text-xs text-text-muted mt-4">
          Hover any mark to see the 720 deg spin.
        </p>
      </section>

      <section>
        <Label>Pill Button / primary</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="primary" size="sm">Primary sm</PillButton>
          <PillButton variant="primary" size="md">Primary md</PillButton>
          <PillButton variant="primary" size="lg">Primary lg</PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Button / secondary</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="secondary" size="sm">Secondary sm</PillButton>
          <PillButton variant="secondary" size="md">Secondary md</PillButton>
          <PillButton variant="secondary" size="lg">Secondary lg</PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Button / with icon + as link</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="primary" size="md" icon={ArrowRight}>
            With icon
          </PillButton>
          <PillButton variant="secondary" size="md" icon={ArrowRight}>
            Secondary icon
          </PillButton>
          <PillButton variant="primary" size="md" href="/">
            As link (home)
          </PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Badge / all gradient tones</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillBadge tone="grad-1">Technical depth</PillBadge>
          <PillBadge tone="grad-2">Engineering leadership</PillBadge>
          <PillBadge tone="grad-3">Shipped products</PillBadge>
        </div>
      </section>

      <section>
        <Label>Gallery Demo Matrix</Label>
        <p className="font-mono text-xs text-text-muted mb-6">
          Internal verification surface. Not indexed. One item per media type.
        </p>
        <Gallery items={GALLERY_DEMO} ariaLabel="Gallery demo matrix" />
        <table className="mt-8 w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="text-text-muted">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2">Config</th>
            </tr>
          </thead>
          <tbody>
            {GALLERY_DEMO.map((item, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="py-2 pr-4">{i + 1}</td>
                <td className="py-2 pr-4">{item.type}</td>
                <td className="py-2 break-all">{configSummary(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <Label>ImageGrid Demo</Label>
        <p className="font-mono text-xs text-text-muted mb-6">
          Static prose-image grid (Phase 19.6.2). Four items render as a 2x2 grid that stacks
          to one column below 600px. Not interactive: no carousel, no fullscreen.
        </p>
        <ImageGrid items={IMAGE_GRID_DEMO} ariaLabel="ImageGrid demo" />
      </section>

      <section>
        <Label>Multi-gallery test</Label>
        <p className="font-mono text-xs text-text-muted mb-6">
          Two galleries on one page (Phase 19.6.3). Regression surface for multi-instance behavior:
          arrow keys are inert on inline strips; fullscreen is one-at-a-time; state is isolated per
          gallery.
        </p>
        <h3 className="font-mono text-xs text-text-muted mb-3">Gallery X</h3>
        <Gallery items={MULTI_GALLERY_X} ariaLabel="Multi-gallery test X" />
        <h3 className="font-mono text-xs text-text-muted mb-3 mt-10">Gallery Y</h3>
        <Gallery items={MULTI_GALLERY_Y} ariaLabel="Multi-gallery test Y" />
      </section>

    </main>
  )
}
