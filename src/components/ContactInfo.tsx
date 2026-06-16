interface InfoLinkProps {
  href:  string
  label: string
}

function InfoLink({ href, label }: InfoLinkProps) {
  return (
    <li>
      <a
        href={href}
        className="info-list-link"
        target="_blank"
        rel="noopener noreferrer me"
      >
        <span>{label}</span>
        <span aria-hidden="true">&#8594;</span>
      </a>
    </li>
  )
}

export function ContactInfo() {
  return (
    <aside className="contact-info" aria-label="Direct contact links">
      <div className="info-block">
        <h3 className="info-block-heading">Find me</h3>
        <p className="info-block-sub">
          Prefer not to fill a form? Reach out directly on any of these.
        </p>
        <ul className="info-list">
          <InfoLink
            href="https://linkedin.com/in/msarib/"
            label="LinkedIn"
          />
          <InfoLink
            href="https://youtube.com/@msarib305"
            label="YouTube"
          />
          <InfoLink
            href="https://www.upwork.com/freelancers/~0125a6700e2e34789a"
            label="Upwork"
          />
          <InfoLink
            href="https://www.fiverr.com/sarib16"
            label="Fiverr"
          />
          <InfoLink
            href="mailto:contact@msarib.dev"
            label="contact@msarib.dev"
          />
        </ul>
      </div>
      <div className="info-block">
        <h3 className="info-block-heading">Response time</h3>
        <p className="info-block-sub">Under two working days. Lahore PKT · UTC+5.</p>
      </div>
    </aside>
  )
}
