import type { Metadata }  from 'next'
import { notFound }        from 'next/navigation'
import { getProjects, findProjectBySlug, getProjectNav } from '@/data/projects'
import { CaseStudyHeader }  from '@/components/CaseStudyHeader'
import { CaseStudySpecs }   from '@/components/CaseStudySpecs'
import { CaseStudyCover }   from '@/components/CaseStudyCover'
import { CaseStudyGallery } from '@/components/CaseStudyGallery'
import { ProjectBody }      from '@/components/ProjectBody'
import { CaseStudyNav }     from '@/components/CaseStudyNav'
import { SpoilerLink }      from '@/components/SpoilerLink'
import { JsonLd }           from '@/components/JsonLd'

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
    'image':       project.thumbnail.src,
    'dateCreated': project.date,
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

      {project.gallery.length > 0 && (
        <section aria-label="Project gallery">
          <CaseStudyGallery items={project.gallery} />
        </section>
      )}

      <CaseStudyNav prev={nav.prev} next={nav.next} />
    </>
  )
}
