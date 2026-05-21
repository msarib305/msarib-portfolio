import type { Metadata } from 'next'
import { ContactForm }    from '@/components/ContactForm'
import { ContactInfo }    from '@/components/ContactInfo'
import { JsonLd }         from '@/components/JsonLd'

export const metadata: Metadata = {
  title:       'Contact',
  description: 'Get in touch. Available for senior and lead UE5 engineering roles at studios in Germany and Japan. Freelance contracts welcomed worldwide.',
  alternates:  { canonical: 'https://msarib.dev/contact' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev/contact',
    title:       'Contact · Sarib',
    description: 'Available for senior and lead UE5 roles in Germany and Japan. Freelance worldwide.',
    images: [{ url: '/og?title=Contact&eyebrow=Get+in+Touch', width: 1200, height: 630, alt: 'Contact · Sarib' }],
  },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type':    'ContactPage',
  '@id':      'https://msarib.dev/contact#page',
  'name':     'Contact · Muhammad Sarib',
  'url':      'https://msarib.dev/contact',
  'mainEntity': {
    '@type':    'Person',
    '@id':      'https://msarib.dev/#person',
    'name':     'Muhammad Sarib',
    'email':    'contact@msarib.dev',
    'jobTitle': 'Lead Unreal Engine 5 Developer',
  },
}

export default function ContactPage() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

  return (
    <main>
      <JsonLd schema={contactSchema} />
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
