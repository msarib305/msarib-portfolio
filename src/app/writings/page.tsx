import type { Metadata } from 'next'
import { getPublishedWritings } from '@/data/writings'
import { WritingCard } from '@/components/WritingCard'
import { WritingsEmpty } from '@/components/WritingsEmpty'

export const metadata: Metadata = {
  title: 'Writings — Sarib',
  description: "Technical notes on Unreal Engine 5: multiplayer replication, performance, editor tools, and the systems work that doesn't show up in a screenshot reel.",
}

export default async function WritingsPage() {
  const writings = await getPublishedWritings()

  // If multiple writings are marked featured, the most recently
  // published wins the hero slot. Others appear as regular cards.
  const featuredWritings = writings.filter(w => w.featured)
  const featured = featuredWritings[0] ?? null
  const rest = writings.filter(w => w.slug !== featured?.slug)

  return (
    <main>
      <section className="writings-hero">
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
        <section className="writings-grid">
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
