import type { Metadata }  from 'next'
import { notFound }        from 'next/navigation'
import Image               from 'next/image'
import { getProjects, findProjectBySlug, getProjectNav } from '@/data/projects'
import { CaseStudyHeader } from '@/components/CaseStudyHeader'
import { CaseStudySpecs }  from '@/components/CaseStudySpecs'
import { ProjectBody }     from '@/components/ProjectBody'
import { CaseStudyNav }    from '@/components/CaseStudyNav'

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
  const { slug } = await params
  const project = await findProjectBySlug(slug)
  if (!project) return {}
  return {
    title:       `${project.title} — Sarib`,
    description: project.summary,
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

  return (
    <>
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
