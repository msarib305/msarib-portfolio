import { getFeaturedProjects } from '@/data/projects'
import { WorkCard }     from '@/components/WorkCard'
import { PillButton }   from '@/components/PillButton'

export async function FeaturedWork() {
  const featured = await getFeaturedProjects()
  return (
    <section className="section" aria-labelledby="selected-work-heading">
      <div className="section-head">
        <h2 id="selected-work-heading">Selected work</h2>
        <PillButton variant="secondary" size="sm" href="/work">
          View all projects
        </PillButton>
      </div>
      <div className="work-grid">
        {featured.map((project) => (
          <WorkCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
