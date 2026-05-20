import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPublishedSlugs, findWritingBySlug, getWritingNav } from '@/data/writings'
import { WritingMeta } from '@/components/WritingMeta'
import { WritingBody } from '@/components/WritingBody'
import { WritingNav } from '@/components/WritingNav'
import { PillButton } from '@/components/PillButton'

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map(slug => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const writing = await findWritingBySlug(slug)
  if (!writing || writing.status !== 'published') return {}
  return {
    title: `${writing.title} — Sarib`,
    description: writing.summary,
  }
}

export default async function WritingPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const [writing, nav] = await Promise.all([
    findWritingBySlug(slug),
    getWritingNav(slug),
  ])

  if (!writing || writing.status !== 'published') notFound()

  return (
    <main>
      <article>
        <header className="post-hero">
          <WritingMeta
            published={writing.published}
            readingTimeMinutes={writing.readingTimeMinutes}
            tags={writing.tags}
          />
          <h1>{writing.title}</h1>
          <p className="post-byline">
            By <strong>Sarib</strong>, Lead Unreal Engine Developer
          </p>
          <p className="post-deck">{writing.summary}</p>
        </header>
        <WritingBody body={writing.body} />
      </article>

      <section className="post-cta">
        <h2>Found this useful?</h2>
        <p>I write about UE5 craft and engineering practice.</p>
        <div className="post-cta-actions">
          <PillButton variant="secondary" size="lg" href="/writings">
            All posts
          </PillButton>
          <PillButton variant="primary" size="lg" href="/contact">
            Get in touch
          </PillButton>
        </div>
      </section>

      <WritingNav prev={nav.prev} next={nav.next} />
    </main>
  )
}
