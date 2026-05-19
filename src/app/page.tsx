import { Cursor }          from '@/components/Cursor'
import { Hero }            from '@/components/Hero'
import { FeaturedWork }    from '@/components/FeaturedWork'
import { FeatureShowcase } from '@/components/FeatureShowcase'
import { ExpertiseGrid }   from '@/components/ExpertiseGrid'
import { WhatIBring }      from '@/components/WhatIBring'
import { ContactCTA }      from '@/components/ContactCTA'

export default function Home() {
  return (
    <>
      <Cursor />
      <Hero />
      <FeaturedWork />
      <FeatureShowcase />
      <ExpertiseGrid />
      <WhatIBring />
      <ContactCTA />
    </>
  )
}
