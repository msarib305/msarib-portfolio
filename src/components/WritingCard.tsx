import Link from 'next/link'

interface WritingCardProps {
  slug:               string
  title:              string
  summary:            string
  published:          string
  readingTimeMinutes: number
  tags:               readonly string[]
  featured?:          boolean
}

export function WritingCard({
  slug,
  title,
  summary,
  published,
  readingTimeMinutes,
  tags,
  featured,
}: WritingCardProps) {
  const formatted = published.replace(/-/g, ' · ')
  return (
    <Link
      href={`/writings/${slug}`}
      className={`write-card${featured ? ' is-featured' : ''}`}
    >
      <div className="write-card-meta">
        <time dateTime={published}>{formatted}</time>
        <span>{readingTimeMinutes} min read</span>
        {tags[0] && <span>{tags[0]}</span>}
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
    </Link>
  )
}
