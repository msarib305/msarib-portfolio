import { getProjects } from '@/data/projects'
import { WorkCard }  from '@/components/WorkCard'

export async function WorkIndex() {
  const allProjects = await getProjects()
  return (
    <>
      <div className="work-index-hero">
        <div className="work-index-hero-grid">
          <div>
            <p className="eyebrow">All projects</p>
            <h1>Selected work, 2019 to present.</h1>
            <p>
              Nine shipped projects across five studios. C++, Blueprints, GAS,
              multiplayer, AI, geospatial, mobile, VR. Each entry links to a
              full case study of my role and contribution.
            </p>
          </div>
          <div className="work-index-meta">
            <div className="work-index-meta-row">
              <span>SHIPPED:</span>
              <strong>09 titles</strong>
            </div>
            <div className="work-index-meta-row">
              <span>STUDIOS:</span>
              <strong>05 engagements</strong>
            </div>
            <div className="work-index-meta-row">
              <span>PLATFORMS:</span>
              <strong>PC · Mobile · VR</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="work-index-cards">
        <div className="work-grid">
          {allProjects.map((project, i) => (
            <WorkCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>
      </div>
    </>
  )
}
