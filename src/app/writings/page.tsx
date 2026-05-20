import type { Metadata }    from 'next'
import { PlaceholderPage } from '@/components/PlaceholderPage'

export const metadata: Metadata = {
  title:       'Writings — Sarib',
  description: 'Notes on Unreal Engine, multiplayer systems, performance, and the craft of shipping games.',
}

export default function WritingsPage() {
  return (
    <PlaceholderPage
      title="Writings"
      description="Technical notes on Unreal Engine, multiplayer, and performance. Shipping in a later phase."
    />
  )
}
