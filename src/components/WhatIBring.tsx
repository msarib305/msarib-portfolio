import { whatIBring }           from '@/data/what-i-bring'
import { WhatIBringCard }       from '@/components/WhatIBringCard'
import { AtmosphericGradient }  from '@/components/AtmosphericGradient'

export function WhatIBring() {
  return (
    <section className="wib-section" aria-labelledby="wib-heading">
      <AtmosphericGradient />
      <div className="wib-head">
        <p className="eyebrow">Why hire me</p>
        <h2 id="wib-heading">What I bring to your team.</h2>
        <p className="wib-lede">
          Three things that hold across studio engineering roles, mid-sized
          contracts, and senior-engineer mentoring. Each backed by shipped work.
        </p>
      </div>
      <div className="wib-grid">
        {whatIBring.map((card) => (
          <WhatIBringCard key={card.slug} card={card} />
        ))}
      </div>
    </section>
  )
}
