import type { Metadata }  from 'next'
import { notFound }        from 'next/navigation'
import { getProjects, findProjectBySlug, getProjectNav } from '@/data/projects'
import { CaseStudyHeader }  from '@/components/CaseStudyHeader'
import { CaseStudySpecs }   from '@/components/CaseStudySpecs'
import { CaseStudyCover }   from '@/components/CaseStudyCover'
import { ProjectBody }      from '@/components/ProjectBody'
import { CaseStudyNav }     from '@/components/CaseStudyNav'
import { SpoilerLink }      from '@/components/SpoilerLink'
import { JsonLd }           from '@/components/JsonLd'
import { ReadingProgress }  from '@/components/ReadingProgress'
import { ReadingTime }       from '@/components/ReadingTime'
import { platformIconForUrl } from '@/icons/PlatformIcon'

// Per-slug VideoGame typing (Phase 19.7, DEC-082). The four game projects render
// as schema.org VideoGame with a platform; every other case study stays
// CreativeWork. The anime title is never named: the redacted case-study title is
// used as the schema name, and Web3 details are not surfaced in the type.
const VIDEO_GAME_PLATFORMS: Record<string, string> = {
  'exarta-uefn-portfolio':         'Fortnite (UEFN)',
  'anime-stylized-action-tgs2024': 'PC, Steam',
  'samurai-saga':                  'PC',
  'xandar':                        'PC',
}

// project.date is a human string such as "Q1 2023 to Q1 2024". schema.org Date
// expects ISO 8601, so emit the first 4-digit year, or omit dateCreated entirely
// rather than ship an invalid value.
function extractIsoYear(dateString: string): string | undefined {
  const match = dateString.match(/\b(\d{4})\b/)
  return match ? match[1] : undefined
}

export const dynamicParams = false

export async function generateStaticParams() {
  const all = await getProjects()
  return all.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug }  = await params
  const project   = await findProjectBySlug(slug)
  if (!project) return {}

  const ogImage = project.cover.type === 'image'
    ? project.cover.src
    : `/og?title=${encodeURIComponent(project.title)}&eyebrow=${encodeURIComponent(project.tags[0] ?? 'Project')}`

  return {
    title:       project.title,
    description: project.summary,
    alternates:  { canonical: `https://msarib.dev/projects/${slug}` },
    openGraph: {
      type:        'article',
      url:         `https://msarib.dev/projects/${slug}`,
      title:       `${project.title} · Sarib`,
      description: project.summary,
      images:      [{ url: ogImage, width: 1200, height: 630, alt: project.thumbnail.alt }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${project.title} · Sarib`,
      description: project.summary,
      images:      [ogImage],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, nav] = await Promise.all([
    findProjectBySlug(slug),
    getProjectNav(slug),
  ])
  if (!project) notFound()

  const gamePlatform = VIDEO_GAME_PLATFORMS[project.slug]
  const isoYear      = extractIsoYear(project.date)

  const projectSchema: Record<string, unknown> = {
    '@context':    'https://schema.org',
    '@type':       gamePlatform ? 'VideoGame' : 'CreativeWork',
    '@id':         `https://msarib.dev/projects/${project.slug}#work`,
    'name':        project.title,
    'description': project.summary,
    'url':         `https://msarib.dev/projects/${project.slug}`,
    'image':       project.thumbnail.src,
    'author':      { '@id': 'https://msarib.dev/#person' },
    'creator':     { '@id': 'https://msarib.dev/#person' },
    'keywords':    project.tags.join(', '),
    'isPartOf':    { '@id': 'https://msarib.dev/work#collection' },
  }
  if (isoYear) projectSchema.dateCreated = isoYear
  if (gamePlatform) {
    projectSchema.gamePlatform        = gamePlatform
    projectSchema.applicationCategory = 'Game'
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msarib.dev' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Work', 'item': 'https://msarib.dev/work' },
      { '@type': 'ListItem', 'position': 3, 'name': project.title, 'item': `https://msarib.dev/projects/${project.slug}` },
    ],
  }

  return (
    <>
      <ReadingProgress />
      <JsonLd schema={projectSchema} />
      <JsonLd schema={breadcrumbSchema} />

      {/* <article> + schema.org CreativeWork microdata: gives browser reading
          modes (Edge Immersive Reader, Chrome Reading Mode) a clean content
          root, and mirrors the CreativeWork JSON-LD for crawlers. Nav and the
          JSON-LD scripts stay outside so the reader view excludes them. */}
      <article itemScope itemType="https://schema.org/CreativeWork">
        {isoYear && <meta itemProp="dateCreated" content={isoYear} />}
        <meta itemProp="author" content="Muhammad Sarib" />

        <div className="case-hero section-container section-container--hero">
          <CaseStudyHeader tags={project.tags} title={project.title} />
          <div className="case-summary">
            <p className="case-summary-text" itemProp="description">{project.summary}</p>
            <ReadingTime minutes={project.readingTimeMinutes} />
            <CaseStudySpecs
              date={project.date}
              client={project.client}
              role={project.role}
              engine={project.engine}
              status={project.status}
            />
          </div>
        </div>

        <div className="case-media">
          <CaseStudyCover cover={project.cover} />
        </div>

        {project.links.length > 0 && (
          <div className="case-links">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-link-pill"
              >
                {platformIconForUrl(link.url)}
                {link.label}
              </a>
            ))}
          </div>
        )}

        {project.spoilerLinks.length > 0 && (
          <div className="case-spoiler-links">
            {project.spoilerLinks.map((sl) => (
              <SpoilerLink
                key={sl.url}
                label={sl.label}
                url={sl.url}
                warning={sl.warning}
              />
            ))}
          </div>
        )}

        <ProjectBody body={project.body} />
      </article>

      <CaseStudyNav prev={nav.prev} next={nav.next} />
    </>
  )
}
