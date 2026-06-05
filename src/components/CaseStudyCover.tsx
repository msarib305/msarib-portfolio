import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'
import type { ProjectCover } from '@/data/projects'
import { YouTubeEmbed } from './YouTubeEmbed'

interface CaseStudyCoverProps {
  cover: ProjectCover
}

export function CaseStudyCover({ cover }: CaseStudyCoverProps) {
  return (
    <div className="case-media-frame">
      {cover.type === 'video' ? (
        <YouTubeEmbed youtubeId={cover.youtubeId} title={cover.title} priority />
      ) : (
        <div style={{ position: 'relative', aspectRatio: '16/9' }}>
          {/* CldImage adds f_auto + q_auto by default.
              Override per-instance via deliveryType or rawTransformations. */}
          <CldImage
            src={cloudinaryPublicId(cover.src)}
            alt={cover.alt}
            fill
            sizes="(max-width: 900px) 100vw, 1600px"
            className="object-cover"
            priority
          />
        </div>
      )}
    </div>
  )
}
