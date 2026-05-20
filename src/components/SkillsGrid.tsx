import { skills }        from '@/data/skills'
import { SkillCategory } from '@/components/SkillCategory'

export function SkillsGrid() {
  return (
    <section className="skills-section" aria-labelledby="skills-heading">
      <div className="skills-section-head">
        <h2 id="skills-heading">Skills.</h2>
      </div>
      <div className="skills-grid">
        {skills.map((cat) => (
          <SkillCategory key={cat.slug} category={cat} />
        ))}
      </div>
    </section>
  )
}
