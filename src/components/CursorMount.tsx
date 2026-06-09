'use client'

import dynamic          from 'next/dynamic'
import { usePathname } from 'next/navigation'

const Cursor = dynamic(
  () => import('@/components/Cursor').then(m => ({ default: m.Cursor })),
)

export function CursorMount() {
  const pathname = usePathname()
  if (pathname.startsWith('/keystatic')) return null
  return <Cursor />
}
