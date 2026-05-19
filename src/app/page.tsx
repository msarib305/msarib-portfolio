import { Cursor } from '@/components/Cursor'

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-8">
      <Cursor />
      <h1 className="font-display text-hero font-black tracking-hero text-text-primary text-center">
        Sarib
      </h1>
      <p className="font-base text-base text-text-secondary text-center">
        Lead Unreal Engine 5 Developer. Site shipping in phases.
      </p>
      <time
        dateTime="2026-05-19"
        className="font-mono text-xs text-text-muted"
      >
        2026-05-19
      </time>
    </main>
  )
}
