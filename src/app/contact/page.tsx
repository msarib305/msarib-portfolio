import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { ContactInfo } from '@/components/ContactInfo'

export const metadata: Metadata = {
  title:       'Contact — Sarib',
  description: 'Get in touch. Available for senior and lead Unreal Engine 5 engineering roles at studios in Germany and Japan. Freelance contracts welcomed worldwide.',
}

export default function ContactPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  return (
    <main>
      <section className="contact-hero">
        <div className="contact-hero-grid">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h1>Let&apos;s talk.</h1>
            <p>
              Studio roles in Germany and Japan are my priority. Freelance
              contracts welcomed worldwide. I read every message and respond
              within two working days.
            </p>
          </div>
          <div className="contact-hero-meta">
            <div className="contact-meta-row">
              <span>RESPONSE:</span>
              <strong>under 2 working days</strong>
            </div>
            <div className="contact-meta-row">
              <span>TIMEZONE:</span>
              <strong>Lahore PKT · UTC+5</strong>
            </div>
            <div className="contact-meta-row">
              <span>LANGUAGES:</span>
              <strong>EN · UR</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-grid">
        <ContactForm turnstileSiteKey={turnstileSiteKey} />
        <ContactInfo />
      </div>
    </main>
  )
}
