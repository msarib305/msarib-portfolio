import { createElement, Fragment } from 'react'
import type { ReactNode } from 'react'
import Markdoc from '@markdoc/markdoc'
import type { Node as MarkdocNode, Config } from '@markdoc/markdoc'
import Image from 'next/image'

const markdocConfig: Config = {
  nodes: {
    fence: {
      render: 'CodeBlock',
      attributes: {
        language: { type: String },
        content:  { type: String },
      },
    },
    blockquote: {
      render: 'Blockquote',
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
  },
}

function CodeBlock({ content, language, children }: { content?: string; language?: string; children?: ReactNode }) {
  void language
  return <pre><code>{content ?? children}</code></pre>
}

function Blockquote({ children }: { children: ReactNode }) {
  return <blockquote>{children}</blockquote>
}

function FigureBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        sizes="(max-width: 720px) 100vw, 720px"
        className="w-full"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

const components = { CodeBlock, Blockquote, Figure: FigureBlock }

interface WritingBodyProps {
  body: { node: MarkdocNode }
}

export function WritingBody({ body }: WritingBodyProps) {
  const renderable = Markdoc.transform(body.node, markdocConfig)
  return (
    <div className="post-body">
      {Markdoc.renderers.react(renderable, { createElement, Fragment }, { components })}
    </div>
  )
}
