interface InstagramEmbedProps {
  permalink: string
  title: string
}

export function InstagramEmbed({ permalink, title }: InstagramEmbedProps) {
  return (
    <a
      href={permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="instagram-embed"
    >
      <div className="instagram-embed-icon" aria-hidden="true">IG</div>
      <span className="instagram-embed-label">{title}</span>
    </a>
  )
}
