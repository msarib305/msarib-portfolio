interface ReadingTimeProps {
  minutes: number
}

// "N min read" badge with a clock icon. Server component (presentational).
export function ReadingTime({ minutes }: ReadingTimeProps) {
  if (minutes < 1) return null
  return (
    <span className="reading-time" aria-label={`${minutes} minute read`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{minutes} min read</span>
    </span>
  )
}
