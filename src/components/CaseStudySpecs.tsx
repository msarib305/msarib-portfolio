interface CaseStudySpecsProps {
  year:   string
  client: string | null
  role:   string
  engine: string
  status: 'shipped' | 'in-development' | 'archived'
}

const statusLabel: Record<CaseStudySpecsProps['status'], string> = {
  shipped:          'Shipped',
  'in-development': 'In development',
  archived:         'Archived',
}

export function CaseStudySpecs({ year, client, role, engine, status }: CaseStudySpecsProps) {
  return (
    <dl className="case-specs">
      <div className="case-spec-row">
        <dt className="case-spec-key">Year</dt>
        <dd className="case-spec-val">{year}</dd>
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
