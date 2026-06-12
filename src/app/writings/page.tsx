import type { Metadata } from 'next'
import { getPublishedWritings } from '@/data/writings'
import { WritingCard }    from '@/components/WritingCard'
import { WritingsEmpty }  from '@/components/WritingsEmpty'
import { JsonLd }         from '@/components/JsonLd'

export const metadata: Metadata = {
  title:       'Writings',
  description: "Technical notes on Unreal Engine 5: multiplayer replication, performance, editor tools, and the systems work that doesn't show up in a screenshot reel.",
  alternates: { canonical: 'https://msarib.dev/writings' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev/writings',
    title:       'Writings · Sarib',
    description: "Technical notes on UE5: multiplayer replication, performance, editor tools.",
    images: [{ url: '/og?title=Writings&eyebrow=Engineering+Notes', width: 1200, height: 630, alt: 'Writings · Sarib' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Writings · Sarib',
    description: "Technical notes on UE5: multiplayer replication, performance, editor tools.",
    images:      ['/og?title=Writings&eyebrow=Engineering+Notes'],
  },
}

export default async function WritingsPage() {
  const writings = await getPublishedWritings()

  // If multiple writings are marked featured, the most recently
  // published wins the hero slot. Others appear as regular cards.
  const featuredWritings = writings.filter(w => w.featured)
  const featured = featuredWritings[0] ?? null
  const rest = writings.filter(w => w.slug !== featured?.slug)

  const writingsSchema = {
    '@context': 'https://schema.org',
    '@type':    'Blog',
    '@id':      'https://msarib.dev/writings#blog',
    'name':     'Writings · Sarib',
    'url':      'https://msarib.dev/writings',
    'author':   { '@id': 'https://msarib.dev/#person' },
    'blogPost': writings.map(w => ({
      '@type':         'BlogPosting',
      'headline':      w.title,
      'description':   w.summary,
      'url':           `https://msarib.dev/writings/${w.slug}`,
      'datePublished': w.published,
      'dateModified':  w.updated ?? w.published,
      'author':        { '@id': 'https://msarib.dev/#person' },
    })),
  }

  return (
    <main>
      <JsonLd schema={writingsSchema} />
      <section className="writings-hero section-container section-container--hero">
        <div className="writings-hero-grid">
          <div>
            <p className="eyebrow">Writings</p>
            <h1>Engineering notes.</h1>
            <p>
              Technical notes on Unreal Engine 5: multiplayer replication,
              performance, editor tools, and the systems work that doesn&apos;t
              show up in a screenshot reel.
            </p>
          </div>
          <div className="writings-meta">
            <div className="writings-meta-row">
              <span>POSTS:</span>
              <strong>{writings.length}</strong>
            </div>
            <div className="writings-meta-row">
              <span>RSS:</span>
              <strong>
                <a href="/feed.xml">/feed.xml</a>
              </strong>
            </div>
          </div>
        </div>
      </section>

      {writings.length === 0 ? (
        <WritingsEmpty />
      ) : (
        <section className="writings-grid section-container section-container--flush-top">
          {featured && (
            <WritingCard
              slug={featured.slug}
              title={featured.title}
              summary={featured.summary}
              published={featured.published}
              readingTimeMinutes={featured.readingTimeMinutes}
              tags={featured.tags}
              featured
            />
          )}
          {rest.map(w => (
            <WritingCard
              key={w.slug}
              slug={w.slug}
              title={w.title}
              summary={w.summary}
              published={w.published}
              readingTimeMinutes={w.readingTimeMinutes}
              tags={w.tags}
            />
          ))}
        </section>
      )}
    </main>
  )
}
