import Link from 'next/link'
import type { ProjectItem } from '@/data/projects'

interface CaseStudyNavProps {
  prev: ProjectItem | null
  next: ProjectItem | null
}

export function CaseStudyNav({ prev, next }: CaseStudyNavProps) {
  return (
    <nav className="case-nav" aria-label="Project navigation">
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className="case-nav-link">
          <span className="case-nav-dir">&#8592; Previous</span>
          <span className="case-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <Link href="/work" className="case-nav-link">
          <span className="case-nav-dir">&#8592; All work</span>
          <span className="case-nav-title">Back to projects</span>
        </Link>
      )}

      {next ? (
        <Link href={`/projects/${next.slug}`} className="case-nav-link is-next">
          <span className="case-nav-dir">Next &#8594;</span>
          <span className="case-nav-title">{next.title}</span>
        </Link>
      ) : (
        <div className="case-nav-empty" aria-hidden="true" />
      )}
    </nav>
  )
}
