import type { Metadata }  from 'next'
import { AboutHero }      from '@/components/AboutHero'
import { AboutNarrative } from '@/components/AboutNarrative'
import { AboutPillars }   from '@/components/AboutPillars'
import { Timeline }       from '@/components/Timeline'
import { SkillsGrid }     from '@/components/SkillsGrid'
import { ContactCTA }     from '@/components/ContactCTA'
import { JsonLd }         from '@/components/JsonLd'

export const metadata: Metadata = {
  title:       'About',
  description: 'Lead Unreal Engine 5 developer. Seven years in engine, ten shipped titles across six studios. Currently leading engineering at SwiftNine in Lahore.',
  alternates:  { canonical: 'https://msarib.dev/about' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev/about',
    title:       'About · Sarib',
    description: 'Lead UE5 developer. Seven years in engine, ten shipped titles across six studios. Leading engineering at SwiftNine in Lahore.',
    images: [{ url: '/og?title=About&eyebrow=Muhammad+Sarib', width: 1200, height: 630, alt: 'About · Sarib' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'About · Sarib',
    description: 'Lead UE5 developer. Seven years in engine, ten shipped titles across six studios. Leading engineering at SwiftNine in Lahore.',
    images:      ['/og?title=About&eyebrow=Muhammad+Sarib'],
  },
}

const aboutSchema = {
  '@context':      'https://schema.org',
  '@type':         'Person',
  '@id':           'https://msarib.dev/#person',
  'name':          'Muhammad Sarib',
  'alternateName': 'Sarib',
  'url':           'https://msarib.dev',
  'email':         'contact@msarib.dev',
  'jobTitle':      'Lead Unreal Engine 5 Developer',
  'worksFor':      { '@type': 'Organization', 'name': 'SwiftNine LLC' },
  'address':       { '@type': 'PostalAddress', 'addressLocality': 'Lahore', 'addressCountry': 'PK' },
  'knowsLanguage': ['en', 'ur'],
  'knowsAbout': [
    'Unreal Engine 5', 'Unreal Engine 4', 'C++', 'Blueprint', 'Verse',
    'UEFN', 'Multiplayer replication', 'Replication Graph',
    'Gameplay Ability System', 'Performance optimization',
    'Mobile game development', 'VR development', 'Meta Quest',
    'Steam', 'Niagara VFX', 'Behavior Trees', 'State Trees',
    'Smart Objects', 'Animation Blueprints', 'Engineering leadership',
  ],
  'sameAs': [
    'https://www.linkedin.com/in/msarib/',
    'https://www.youtube.com/@msarib305',
  ],
}

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={aboutSchema} />
      <AboutHero />
      <AboutNarrative />
      <AboutPillars />
      <Timeline />
      <SkillsGrid />
      <ContactCTA />
    </>
  )
}
