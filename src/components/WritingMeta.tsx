interface WritingMetaProps {
  published:          string
  readingTimeMinutes: number
  tags:               readonly string[]
}

export function WritingMeta({ published, readingTimeMinutes, tags }: WritingMetaProps) {
  const formatted = published.replace(/-/g, ' · ')
  return (
    <div className="post-hero-meta">
      <time dateTime={published}>{formatted}</time>
      <span>{readingTimeMinutes} min read</span>
      {tags.map(t => <span key={t}>{t}</span>)}
    </div>
  )
}
