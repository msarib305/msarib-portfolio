import Link from 'next/link'
import type { ProjectItem } from '@/data/projects'

interface WorkCardProps {
  project: ProjectItem
}

export function WorkCard({ project }: WorkCardProps) {
  const { slug, title, summary, cover, coverAlt, tags, client, year, tintClass } = project

  return (
    <Link href={`/projects/${slug}`} className={`work-card ${tintClass}`}>
      <div className="work-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={coverAlt}
          className="work-card-img"
          loading="lazy"
          decoding="async"
        />
        <div className="work-card-overlay" aria-hidden="true" />
        <span className="work-card-tag-img">{tags[0]}</span>
      </div>
      <div className="work-card-body">
        <span className="work-card-meta">
          {year}{client ? ` · ${client}` : ''}
        </span>
        <h3 className="work-card-title">{title}</h3>
        <p className="work-card-summary">{summary}</p>
      </div>
    </Link>
  )
}
