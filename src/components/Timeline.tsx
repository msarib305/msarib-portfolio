import { experience }    from '@/data/experience'
import { TimelineEntry } from '@/components/TimelineEntry'
import { PillButton }    from '@/components/PillButton'

export function Timeline() {
  return (
    <section className="timeline" aria-labelledby="experience-heading">
      <div className="timeline-head">
        <h2 id="experience-heading">Experience.</h2>
        <PillButton variant="secondary" size="sm" href="/resume.pdf" download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf">
          Download resume (PDF)
        </PillButton>
      </div>
      {experience.map((item) => (
        <TimelineEntry key={item.slug} item={item} />
      ))}
    </section>
  )
}
