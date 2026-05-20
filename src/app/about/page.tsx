import type { Metadata }  from 'next'
import { AboutHero }      from '@/components/AboutHero'
import { AboutNarrative } from '@/components/AboutNarrative'
import { AboutPillars }   from '@/components/AboutPillars'
import { Timeline }       from '@/components/Timeline'
import { SkillsGrid }     from '@/components/SkillsGrid'
import { ContactCTA }     from '@/components/ContactCTA'

export const metadata: Metadata = {
  title:       'About — Sarib',
  description: 'Lead Unreal Engine 5 developer. Seven years in engine, ten shipped titles across six studios. Currently leading engineering at SwiftNine in Lahore.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutNarrative />
      <AboutPillars />
      <Timeline />
      <SkillsGrid />
      <ContactCTA />
    </>
  )
}
