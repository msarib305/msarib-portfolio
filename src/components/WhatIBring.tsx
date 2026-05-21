import { whatIBring }      from '@/data/what-i-bring'
import { WhatIBringCard }  from '@/components/WhatIBringCard'

export function WhatIBring() {
  return (
    <section className="wib-section" aria-labelledby="wib-heading">
      <div className="wib-bg" aria-hidden="true">
        <div className="wib-blob3" />
      </div>
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
