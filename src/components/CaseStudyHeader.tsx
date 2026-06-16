interface CaseStudyHeaderProps {
  tags:  readonly string[]
  title: string
}

export function CaseStudyHeader({ tags, title }: CaseStudyHeaderProps) {
  return (
    <>
      <div className="case-meta-row" aria-label="Project tags">
        {tags.map((tag) => (
          <span key={tag} className="case-chip">{tag}</span>
        ))}
      </div>
      <h1 className="case-title" itemProp="name">{title}</h1>
    </>
  )
}
