import { Cursor }          from '@/components/Cursor'
import { Hero }            from '@/components/Hero'
import { FeaturedWork }    from '@/components/FeaturedWork'
import { FeatureShowcase } from '@/components/FeatureShowcase'
import { ExpertiseGrid }   from '@/components/ExpertiseGrid'

export default function Home() {
  return (
    <>
      <Cursor />
      <Hero />
      <FeaturedWork />
      <FeatureShowcase />
      <ExpertiseGrid />
    </>
  )
}
