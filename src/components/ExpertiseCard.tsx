import Image from 'next/image'
import type { ExpertiseItem } from '@/data/expertise'

interface ExpertiseCardProps {
  item: ExpertiseItem
}

export function ExpertiseCard({ item }: ExpertiseCardProps) {
  return (
    <div className={`exp-card ${item.tintClass}`}>
      <div className="exp-media">
        <Image
          src={item.bwImage}
          alt={item.bwImageAlt}
          className="exp-img"
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 25vw"
          quality={55}
          loading="lazy"
        />
      </div>
      <div className="exp-tint" aria-hidden="true" />
      <h3 className="ec-title">{item.title}</h3>
    </div>
  )
}
