import { featuredWork } from '@/data/featured-work'
import { WorkCard }     from '@/components/WorkCard'
import { PillButton }   from '@/components/PillButton'

export function FeaturedWork() {
  return (
    <section className="section" aria-labelledby="selected-work-heading">
      <div className="section-head">
        <h2 id="selected-work-heading">Selected work</h2>
        <PillButton variant="secondary" size="sm" href="/work">
          View all projects
        </PillButton>
      </div>
      <div className="work-grid">
        {featuredWork.map((project) => (
          <WorkCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
