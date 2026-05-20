import { PillButton } from '@/components/PillButton'

interface ContactSuccessProps {
  name: string
}

export function ContactSuccess({ name }: ContactSuccessProps) {
  return (
    <div className="contact-success">
      <p className="contact-success-eyebrow">Sent</p>
      <h2 className="contact-success-heading">Message received.</h2>
      <p className="contact-success-body">
        Thanks, {name}. I&apos;ll reply within two working days.
      </p>
      <PillButton variant="secondary" size="md" href="/">
        Back to home
      </PillButton>
    </div>
  )
}
