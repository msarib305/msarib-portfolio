import { getFeaturedProjects } from '@/data/projects'
import { WorkCard }     from '@/components/WorkCard'
import { PillButton }   from '@/components/PillButton'

export async function FeaturedWork() {
  const featured = await getFeaturedProjects()
  return (
    <section className="section section-container" aria-labelledby="selected-work-heading">
      <div className="section-head">
        <h2 id="selected-work-heading">Selected work</h2>
        <PillButton variant="secondary" size="sm" href="/work">
          View all projects
        </PillButton>
      </div>
      <div className="work-grid">
        {featured.map((project) => (
          /* No priority hint: on the home page, work cards sit below
             the hero and showreel, so they are below the fold on
             mobile. Preloading them would steal bandwidth from the
             showreel poster, which is the LCP element. */
          <WorkCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
