import type { Metadata }  from 'next'
import { notFound }        from 'next/navigation'
import Image               from 'next/image'
import { getProjects, findProjectBySlug, getProjectNav } from '@/data/projects'
import { CaseStudyHeader } from '@/components/CaseStudyHeader'
import { CaseStudySpecs }  from '@/components/CaseStudySpecs'
import { ProjectBody }     from '@/components/ProjectBody'
import { CaseStudyNav }    from '@/components/CaseStudyNav'
import { JsonLd }          from '@/components/JsonLd'

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

  const coverIsAbsolute = project.cover.startsWith('http')
  const ogImage = coverIsAbsolute
    ? project.cover
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
      images:      [{ url: ogImage, width: 1200, height: 630, alt: project.coverAlt || project.title }],
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

  const projectSchema = {
    '@context':    'https://schema.org',
    '@type':       'CreativeWork',
    '@id':         `https://msarib.dev/projects/${project.slug}#work`,
    'name':        project.title,
    'description': project.summary,
    'url':         `https://msarib.dev/projects/${project.slug}`,
    'image':       project.cover,
    'dateCreated': project.year,
    'author':      { '@id': 'https://msarib.dev/#person' },
    'creator':     { '@id': 'https://msarib.dev/#person' },
    'keywords':    project.tags.join(', '),
    'isPartOf':    { '@id': 'https://msarib.dev/work#collection' },
  }

  return (
    <>
      <JsonLd schema={projectSchema} />
      <div className="case-hero">
        <CaseStudyHeader tags={project.tags} title={project.title} />
        <div className="case-summary">
          <p className="case-summary-text">{project.summary}</p>
          <CaseStudySpecs
            year={project.year}
            client={project.client}
            role={project.role}
            engine={project.engine}
            status={project.status}
          />
        </div>
      </div>

      <div className="case-media">
        <div className="case-media-frame">
          <Image
            src={project.cover}
            alt={project.coverAlt}
            fill
            sizes="(max-width: 900px) 100vw, 1600px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <ProjectBody body={project.body} />

      <CaseStudyNav prev={nav.prev} next={nav.next} />
    </>
  )
}
