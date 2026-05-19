import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SLogo }      from '@/components/SLogo'
import { PillButton } from '@/components/PillButton'
import { PillBadge }  from '@/components/PillBadge'

export const metadata: Metadata = {
  title: 'Design System — internal',
  robots: { index: false, follow: false },
}

const ArrowRight = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 7h9M8 3.5L11.5 7 8 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs text-text-muted tracking-eyebrow uppercase mb-6">
      {children}
    </p>
  )
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-dvh bg-bg px-8 py-16 space-y-20 max-w-4xl mx-auto">

      <section>
        <Label>S-Logo / mark sizes</Label>
        <div className="flex flex-wrap items-center gap-8">
          <SLogo size={24} ariaLabel="S-logo 24px" />
          <SLogo size={48} ariaLabel="S-logo 48px" />
          <SLogo size={96} ariaLabel="S-logo 96px" />
        </div>
      </section>

      <section>
        <Label>S-Logo / with text label</Label>
        <div className="flex flex-wrap items-center gap-8">
          <SLogo ariaLabel="S-logo default" showText textLabel="SARIB" subText="Lead UE5 Developer" />
          <SLogo className="s-logo-lg" ariaLabel="S-logo lg" showText textLabel="SARIB" subText="Lead UE5 Developer" />
          <SLogo className="s-logo-xl" ariaLabel="S-logo xl" showText textLabel="SARIB" />
        </div>
        <p className="font-mono text-xs text-text-muted mt-4">
          Hover any mark to see the 720 deg spin.
        </p>
      </section>

      <section>
        <Label>Pill Button / primary</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="primary" size="sm">Primary sm</PillButton>
          <PillButton variant="primary" size="md">Primary md</PillButton>
          <PillButton variant="primary" size="lg">Primary lg</PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Button / secondary</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="secondary" size="sm">Secondary sm</PillButton>
          <PillButton variant="secondary" size="md">Secondary md</PillButton>
          <PillButton variant="secondary" size="lg">Secondary lg</PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Button / with icon + as link</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillButton variant="primary" size="md" icon={ArrowRight}>
            With icon
          </PillButton>
          <PillButton variant="secondary" size="md" icon={ArrowRight}>
            Secondary icon
          </PillButton>
          <PillButton variant="primary" size="md" href="/">
            As link (home)
          </PillButton>
        </div>
      </section>

      <section>
        <Label>Pill Badge / all gradient tones</Label>
        <div className="flex flex-wrap items-center gap-4">
          <PillBadge tone="grad-1">Technical depth</PillBadge>
          <PillBadge tone="grad-2">Engineering leadership</PillBadge>
          <PillBadge tone="grad-3">Shipped products</PillBadge>
        </div>
      </section>

    </main>
  )
}
