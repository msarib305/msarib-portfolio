import type { Metadata } from 'next'
import { WorkIndex }    from '@/components/WorkIndex'

export const metadata: Metadata = {
  title:       'Work — Sarib',
  description: 'Ten shipped projects across six studios. C++, Blueprints, GAS, multiplayer, AI, geospatial, mobile, VR.',
}

export default function WorkPage() {
  return <WorkIndex />
}
