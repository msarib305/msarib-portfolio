import Link from 'next/link'

interface WritingNavItem {
  slug:  string
  title: string
}

interface WritingNavProps {
  prev: WritingNavItem | null
  next: WritingNavItem | null
}

export function WritingNav({ prev, next }: WritingNavProps) {
  if (!prev && !next) return null
  return (
    <nav className="writing-nav" aria-label="Post navigation">
      {prev ? (
        <Link href={`/writings/${prev.slug}`} className="writing-nav-item">
          <span className="writing-nav-label">Previous</span>
          <span className="writing-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={`/writings/${next.slug}`} className="writing-nav-item is-next">
          <span className="writing-nav-label">Next</span>
          <span className="writing-nav-title">{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
