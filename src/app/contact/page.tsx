import type { Metadata }    from 'next'
import { PlaceholderPage } from '@/components/PlaceholderPage'

export const metadata: Metadata = {
  title:       'Contact — Sarib',
  description: 'Get in touch. Available for senior and lead Unreal Engine 5 engineering roles.',
}

export default function ContactPage() {
  return (
    <PlaceholderPage
      title="Contact"
      description="Contact form and direct email. Shipping in a later phase."
    />
  )
}
