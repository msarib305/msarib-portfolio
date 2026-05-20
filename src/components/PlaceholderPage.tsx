import { PillButton } from '@/components/PillButton'

interface PlaceholderPageProps {
  title:       string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="placeholder-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <PillButton variant="secondary" size="md" href="/">
        Back to home
      </PillButton>
    </section>
  )
}
