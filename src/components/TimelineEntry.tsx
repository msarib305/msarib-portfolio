import { PillBadge }           from '@/components/PillBadge'
import type { ExperienceItem } from '@/data/experience'

interface TimelineEntryProps {
  item: ExperienceItem
}

export function TimelineEntry({ item }: TimelineEntryProps) {
  return (
    <div className={`exp-row${item.current ? ' current' : ''}`}>
      <div className="when">
        {item.years}
        {item.current && (
          <div className="now-wrap">
            <PillBadge tone="grad-1">Current</PillBadge>
          </div>
        )}
      </div>
      <div className="role">
        <div className="role-title">{item.role}</div>
        <div className="company">
          <strong>{item.company}</strong>
          {item.location ? ` · ${item.location}` : ''}
        </div>
        <div className="deets">
          <p className="deets-summary">{item.summary}</p>
          {item.bullets.length > 0 && (
            <ul>
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="tags">
        {item.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  )
}
