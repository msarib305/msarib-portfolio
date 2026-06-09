interface Pillar {
  slug:     string
  pill:     string
  headline: string
  desc:     string
  tint:     't1' | 't2' | 't3'
}

const PILLARS: Pillar[] = [
  {
    slug:     'performance',
    pill:     'Performance is a feature',
    headline: 'Trained on mobile, applied everywhere.',
    desc:     'Mobile UE5 forces discipline that PC engineers learn the hard way later. I do the same arithmetic on a desktop target.',
    tint:     't1',
  },
  {
    slug:     'architecture',
    pill:     'Architecture before features',
    headline: 'The decisions that compound.',
    desc:     'The state machine is the codebase. The replication graph is the multiplayer experience. I will spend a week refactoring to save a quarter of downstream pain.',
    tint:     't2',
  },
  {
    slug:     'documentation',
    pill:     'Documentation as code',
    headline: 'The next engineer can read it.',
    desc:     'If the architecture decision is not written down, it does not exist. The work that lasts is the work that survives my exit.',
    tint:     't3',
  },
]

import { AtmosphericGradient } from '@/components/AtmosphericGradient'

export function AboutPillars() {
  return (
    <section className="three-card" aria-labelledby="pillars-heading">
      <AtmosphericGradient />
      <div className="three-card-head">
        <p className="eyebrow">Engineering pillars</p>
        <h2 id="pillars-heading">How I think about the work.</h2>
        <p className="lede">Three principles that have held across every role.</p>
      </div>
      <div className="three-grid">
        {PILLARS.map((pillar) => (
          <article key={pillar.slug} className={`t-card ${pillar.tint}`}>
            <span className="t-pill">{pillar.pill}</span>
            <h3>{pillar.headline}</h3>
            <p className="t-desc">{pillar.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
