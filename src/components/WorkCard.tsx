import Link from 'next/link'
import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'
import type { ProjectItem } from '@/data/projects'

interface WorkCardProps {
  project: ProjectItem
  priority?: boolean
}

export function WorkCard({ project, priority = false }: WorkCardProps) {
  const { slug, title, summary, thumbnail, tags, client, date, tintClass } = project

  return (
    <Link href={`/projects/${slug}`} className={`work-card ${tintClass}`}>
      <div className="work-card-media">
        {/* CldImage adds f_auto + q_auto by default.
            Override per-instance via deliveryType or rawTransformations. */}
        <CldImage
          src={cloudinaryPublicId(thumbnail.src)}
          alt={thumbnail.alt}
          className="work-card-img"
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 90vw, 50vw"
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
        />
        <div className="work-card-overlay" aria-hidden="true" />
        <span className="work-card-tag-img">{tags[0]}</span>
      </div>
      <div className="work-card-body">
        <span className="work-card-meta">
          {date}{client ? ` · ${client}` : ''}
        </span>
        <h3 className="work-card-title">{title}</h3>
        <p className="work-card-summary">{summary}</p>
      </div>
    </Link>
  )
}
