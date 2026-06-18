interface CaseStudyTagsProps {
  tags: readonly string[]
}

// The case-study tag row (chips). Split out of the former CaseStudyHeader in
// Phase 24.5 so the tags sit full-width above the two-column hero grid while the
// title lives inside the grid's left column. Server component (presentational).
export function CaseStudyTags({ tags }: CaseStudyTagsProps) {
  if (tags.length === 0) return null
  return (
    <div className="case-meta-row" aria-label="Project tags">
      {tags.map((tag) => (
        <span key={tag} className="case-chip" translate="no">{tag}</span>
      ))}
    </div>
  )
}
