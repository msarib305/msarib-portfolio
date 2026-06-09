import type { Metadata } from 'next'
import { JsonLd }          from '@/components/JsonLd'
import { Hero }            from '@/components/Hero'
import { FeaturedWork }    from '@/components/FeaturedWork'
import { FeatureShowcase } from '@/components/FeatureShowcase'
import { ExpertiseGrid }   from '@/components/ExpertiseGrid'
import { WhatIBring }      from '@/components/WhatIBring'
import { ContactCTA }      from '@/components/ContactCTA'

export const metadata: Metadata = {
  title: {
    absolute: 'Sarib · Lead UE5 Developer',
  },
  description: 'Lead Unreal Engine 5 developer based in Lahore. Seven years in engine, ten shipped titles. Available for senior and lead engineering roles at studios in Germany and Japan.',
  alternates: { canonical: 'https://msarib.dev' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev',
    title:       'Sarib · Lead UE5 Developer',
    description: 'Lead Unreal Engine 5 developer based in Lahore. Seven years in engine, ten shipped titles.',
    images: [{ url: '/og?title=Lead+UE5+Developer&eyebrow=msarib.dev', width: 1200, height: 630, alt: 'Sarib' }],
  },
}

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':         'Person',
      '@id':           'https://msarib.dev/#person',
      'name':          'Muhammad Sarib',
      'alternateName': 'Sarib',
      'url':           'https://msarib.dev',
      'email':         'contact@msarib.dev',
      'jobTitle':      'Lead Unreal Engine 5 Developer',
      'worksFor':      { '@type': 'Organization', 'name': 'SwiftNine LLC' },
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
    },
    {
      '@type':       'WebSite',
      '@id':         'https://msarib.dev/#website',
      'url':         'https://msarib.dev',
      'name':        'msarib.dev',
      'description': 'Lead Unreal Engine 5 developer portfolio: C++, GAS, multiplayer, VR, mobile.',
      'publisher':   { '@id': 'https://msarib.dev/#person' },
    },
    {
      '@type':       'ProfessionalService',
      '@id':         'https://msarib.dev/#service',
      'name':        'Muhammad Sarib · UE5 Engineering',
      'url':         'https://msarib.dev',
      'description': 'Senior and lead Unreal Engine 5 engineering. Studio roles in Germany and Japan, freelance worldwide.',
      'provider':    { '@id': 'https://msarib.dev/#person' },
      'areaServed':  'Worldwide',
      'serviceType': 'Game Development Engineering',
    },
  ],
}

// Showreel poster — same URL as Hero/ShowreelGlow uses. Preloaded
// here so it begins fetching alongside the HTML, not after the
// video element is constructed. This is the LCP element on mobile.
const SHOWREEL_POSTER = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_jpg,q_auto:eco,w_960,so_0/portfolio-showreel'

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={SHOWREEL_POSTER}
        fetchPriority="high"
      />
      <JsonLd schema={homeSchema} />
      <Hero />
      <FeaturedWork />
      <FeatureShowcase />
      <ExpertiseGrid />
      <WhatIBring />
      <ContactCTA />
    </>
  )
}
