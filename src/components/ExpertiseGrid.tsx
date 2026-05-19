import { expertise }    from '@/data/expertise'
import { ExpertiseCard } from '@/components/ExpertiseCard'

export function ExpertiseGrid() {
  return (
    <section className="expertise-section" aria-labelledby="expertise-heading">
      <div className="expertise-head">
        <h2 id="expertise-heading">
          Ships fully loaded across the stack.
        </h2>
        <p>
          The full range of UE5 disciplines, sharpened over seven years across
          six studios. These are categories I have shipped to production, not
          buzzwords on a resume.
        </p>
      </div>
      <div className="expertise-grid">
        {expertise.map((item) => (
          <ExpertiseCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}
