interface CaseStudySpecsProps {
  date:   string
  client: string | null
  role:   string
  engine: string
  status: 'released' | 'wip' | 'archived' | 'cancelled'
}

const statusLabel: Record<CaseStudySpecsProps['status'], string> = {
  released:  'Released',
  wip:       'In progress',
  archived:  'Archived',
  cancelled: 'Cancelled',
}

export function CaseStudySpecs({ date, client, role, engine, status }: CaseStudySpecsProps) {
  return (
    <dl className="case-specs">
      <div className="case-spec-row">
        <dt className="case-spec-key">Date</dt>
        <dd className="case-spec-val">{date}</dd>
      </div>
      {client && (
        <div className="case-spec-row">
          <dt className="case-spec-key">Client</dt>
          <dd className="case-spec-val">{client}</dd>
        </div>
      )}
      <div className="case-spec-row">
        <dt className="case-spec-key">Role</dt>
        <dd className="case-spec-val">{role}</dd>
      </div>
      <div className="case-spec-row">
        <dt className="case-spec-key">Engine</dt>
        <dd className="case-spec-val">{engine}</dd>
      </div>
      <div className="case-spec-row">
        <dt className="case-spec-key">Status</dt>
        <dd className="case-spec-val">{statusLabel[status]}</dd>
      </div>
    </dl>
  )
}
