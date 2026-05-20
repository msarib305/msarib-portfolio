import type { Metadata }    from 'next'
import { PlaceholderPage } from '@/components/PlaceholderPage'

export const metadata: Metadata = {
  title:       'About — Sarib',
  description: 'Lead Unreal Engine 5 developer. Seven years in engine, ten shipped titles across six studios.',
}

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About"
      description="Full biography, timeline, and the tools I rely on. Shipping in a later phase."
    />
  )
}
