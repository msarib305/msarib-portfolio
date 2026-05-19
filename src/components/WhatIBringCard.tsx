import { PillBadge }           from '@/components/PillBadge'
import type { WhatIBringItem } from '@/data/what-i-bring'

export function WhatIBringCard({ card }: { card: WhatIBringItem }) {
  return (
    <article className="wib-card">
      <PillBadge tone={card.tone}>{card.label}</PillBadge>
      <h3 className="wib-card-headline">{card.headline}</h3>
      <p className="wib-card-body">{card.body}</p>
      <ul className="wib-card-detail">
        {card.details.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
