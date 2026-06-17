import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPublishedSlugs, findWritingBySlug, getWritingNav } from '@/data/writings'
import { WritingMeta } from '@/components/WritingMeta'
import { WritingBody } from '@/components/WritingBody'
import { WritingNav }  from '@/components/WritingNav'
import { TableOfContents } from '@/components/TableOfContents'
import { PillButton }  from '@/components/PillButton'
import { JsonLd }      from '@/components/JsonLd'
import { ReadingProgress } from '@/components/ReadingProgress'

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map(slug => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug }  = await params
  const writing   = await findWritingBySlug(slug)
  if (!writing || writing.status !== 'published') return {}

  const ogUrl = `/og?title=${encodeURIComponent(writing.title)}&eyebrow=${encodeURIComponent(writing.tags[0] ?? 'UE5')}`

  return {
    title:       writing.title,
    description: writing.summary,
    alternates:  { canonical: `https://msarib.dev/writings/${slug}` },
    openGraph: {
      type:          'article',
      url:           `https://msarib.dev/writings/${slug}`,
      title:         `${writing.title} · Sarib`,
      description:   writing.summary,
      publishedTime: writing.published,
      modifiedTime:  writing.updated ?? writing.published,
      authors:       ['https://msarib.dev/about'],
      tags:          [...writing.tags],
      images:        [{ url: ogUrl, width: 1200, height: 630, alt: writing.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${writing.title} · Sarib`,
      description: writing.summary,
      images:      [ogUrl],
    },
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

  const writingSchema = {
    '@context':         'https://schema.org',
    '@type':            'BlogPosting',
    '@id':              `https://msarib.dev/writings/${writing.slug}#post`,
    'headline':         writing.title,
    'description':      writing.summary,
    'url':              `https://msarib.dev/writings/${writing.slug}`,
    'datePublished':    writing.published,
    'dateModified':     writing.updated ?? writing.published,
    'author': {
      '@type': 'Person',
      '@id':   'https://msarib.dev/#person',
      'name':  'Muhammad Sarib',
      'url':   'https://msarib.dev/about',
    },
    'publisher':         { '@id': 'https://msarib.dev/#person' },
    'mainEntityOfPage':  { '@type': 'WebPage', '@id': `https://msarib.dev/writings/${writing.slug}` },
    'keywords':          writing.tags.join(', '),
    'timeRequired':      `PT${writing.readingTimeMinutes}M`,
    'inLanguage':        'en-US',
    'isPartOf':          { '@id': 'https://msarib.dev/writings#blog' },
  }

  return (
    <>
      <ReadingProgress />
      <JsonLd schema={writingSchema} />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="author" content="Muhammad Sarib" />
        <meta itemProp="datePublished" content={writing.published} />
        <meta itemProp="dateModified" content={writing.updated ?? writing.published} />
        <header className="post-hero">
          <WritingMeta
            published={writing.published}
            readingTimeMinutes={writing.readingTimeMinutes}
            tags={writing.tags}
          />
          <h1 itemProp="headline">{writing.title}</h1>
          <p className="post-byline">
            By <strong>Sarib</strong>, Lead Unreal Engine Developer
          </p>
          <p className="post-deck" itemProp="description">{writing.summary}</p>
        </header>
        <div className="toc-layout">
          <TableOfContents headings={writing.headings} />
          <WritingBody body={writing.body} />
        </div>
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
    </>
  )
}
