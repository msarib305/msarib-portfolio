import { PillButton } from '@/components/PillButton'

export function WritingsEmpty() {
  return (
    <div className="writings-empty">
      <h2>First post in draft.</h2>
      <p>The RSS feed is live. Subscribe and you&apos;ll know when it lands.</p>
      <PillButton variant="secondary" size="md" href="/feed.xml">
        RSS feed
      </PillButton>
    </div>
  )
}
