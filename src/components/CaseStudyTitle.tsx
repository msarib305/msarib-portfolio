interface CaseStudyTitleProps {
  title: string
}

// The case-study <h1>. Split out of the former CaseStudyHeader in Phase 24.5 so
// it can live inside the hero grid's left column (aligned with the specs column),
// with the tag row hoisted above the grid. Keeps itemProp="name" for the
// schema.org CreativeWork microdata. Server component (presentational).
export function CaseStudyTitle({ title }: CaseStudyTitleProps) {
  return (
    <h1 className="case-title" itemProp="name" translate="no">{title}</h1>
  )
}
