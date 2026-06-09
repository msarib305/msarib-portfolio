import { createElement, Fragment } from 'react'
import type { ReactNode } from 'react'
import Markdoc from '@markdoc/markdoc'
import type { Node as MarkdocNode, Config } from '@markdoc/markdoc'
import Image from 'next/image'
import { YouTubeEmbed } from './YouTubeEmbed'
import { InstagramEmbed } from './InstagramEmbed'
import { Gallery } from '@/components/Gallery'
import { normalizeGalleryItems } from '@/components/Gallery/normalize'

const markdocConfig: Config = {
  nodes: {
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean },
      },
    },
    item: {
      render: 'ListItem',
    },
  },
  tags: {
    Figure: {
      render: 'Figure',
      attributes: {
        src:     { type: String },
        alt:     { type: String },
        caption: { type: String },
      },
    },
    YouTubeEmbed: {
      render: 'YouTubeEmbed',
      attributes: {
        id:    { type: String },
        title: { type: String },
      },
    },
    InstagramEmbed: {
      render: 'InstagramEmbed',
      attributes: {
        permalink: { type: String },
        title:     { type: String },
      },
    },
    Gallery: {
      render: 'Gallery',
      attributes: {
        items: { type: Array },
      },
    },
  },
}

function List({ ordered, children }: { ordered: boolean; children: ReactNode }) {
  if (ordered) return <ol className="case-list">{children}</ol>
  return <ul className="case-list">{children}</ul>
}

function ListItem({ children }: { children: ReactNode }) {
  return <li className="case-list-item"><p>{children}</p></li>
}

function FigureBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="case-figure">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        sizes="(max-width: 900px) 100vw, 1100px"
        className="w-full"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

function YouTubeEmbedBlock({ id, title }: { id: string; title: string }) {
  return (
    <div className="case-media-frame" style={{ marginBlock: '24px' }}>
      <YouTubeEmbed youtubeId={id} title={title} />
    </div>
  )
}

function InstagramEmbedBlock({ permalink, title }: { permalink: string; title: string }) {
  return <InstagramEmbed permalink={permalink} title={title} />
}

// Server wrapper: normalize the raw markdoc items array into the typed MediaItem
// union, then hand off to the client Gallery. Renders nothing for an empty array.
function GalleryBlock({ items }: { items?: unknown }) {
  const normalized = normalizeGalleryItems(items)
  if (normalized.length === 0) return null
  return <Gallery items={normalized} />
}

const components = {
  List,
  ListItem,
  Figure: FigureBlock,
  YouTubeEmbed: YouTubeEmbedBlock,
  InstagramEmbed: InstagramEmbedBlock,
  Gallery: GalleryBlock,
}

interface ProjectBodyProps {
  body: { node: MarkdocNode }
}

export function ProjectBody({ body }: ProjectBodyProps) {
  const renderable = Markdoc.transform(body.node, markdocConfig)
  return (
    <div className="case-body">
      {Markdoc.renderers.react(renderable, { createElement, Fragment }, { components })}
    </div>
  )
}
