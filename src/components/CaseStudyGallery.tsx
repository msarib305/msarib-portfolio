import { CldImage } from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'
import type { ProjectGalleryItem } from '@/data/projects'
import { YouTubeEmbed } from './YouTubeEmbed'
import { InstagramEmbed } from './InstagramEmbed'

interface CaseStudyGalleryProps {
  items: readonly ProjectGalleryItem[]
}

export function CaseStudyGallery({ items }: CaseStudyGalleryProps) {
  if (items.length === 0) return null

  return (
    <div className="gallery-grid">
      {items.map((item, i) => {
        if (item.type === 'video') {
          return (
            <div key={i} className="gallery-item">
              <YouTubeEmbed youtubeId={item.youtubeId} title={item.title} />
            </div>
          )
        }
        if (item.type === 'instagram') {
          return (
            <div key={i} className="gallery-item" style={{ padding: '16px' }}>
              <InstagramEmbed permalink={item.permalink} title={item.title} />
            </div>
          )
        }
        return (
          <div key={i} className="gallery-item">
            {/* CldImage adds f_auto + q_auto by default.
                Override per-instance via deliveryType or rawTransformations. */}
            <CldImage
              src={cloudinaryPublicId(item.src)}
              alt={item.alt}
              width={800}
              height={450}
              className="gallery-image"
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          </div>
        )
      })}
    </div>
  )
}
