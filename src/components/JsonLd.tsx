interface JsonLdProps {
  schema: Record<string, unknown>
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted structured data, no user input
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
