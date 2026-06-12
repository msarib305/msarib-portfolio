import { PillButton } from '@/components/PillButton'

const HEADING = 'Ready to talk?'
const BODY    = 'Studio roles in Germany and Japan. Freelance contracts worldwide. I read every message and reply within two working days.'

export function ContactCTA() {
  return (
    <section className="contact-cta-section section-container" aria-labelledby="cta-home-heading">
      <div className="contact-cta-card">
        <p className="eyebrow">Get in touch</p>
        <h2 id="cta-home-heading">{HEADING}</h2>
        <p className="contact-cta-body">{BODY}</p>
        <div className="contact-cta-actions">
          <PillButton variant="primary" size="lg" href="/contact">
            Contact me
          </PillButton>
          <PillButton variant="secondary" size="lg" href="/resume.pdf" download="Muhammad_Sarib_Lead_UE5_Developer_Resume.pdf">
            Download resume
          </PillButton>
        </div>
      </div>
    </section>
  )
}
