// Shared text helpers over Markdoc ASTs, used by the project and writing data
// readers. Extracted from writings.ts in Phase 23.4 so case studies and writings
// compute reading time the same way. Phase 23.6 added heading extraction + the
// shared slugger used both to build the table of contents and to inject matching
// ids into rendered headings.
import Markdoc from '@markdoc/markdoc'
import type { Node as MarkdocNode, Config, Schema } from '@markdoc/markdoc'

export interface Heading {
  id:    string
  text:  string
  level: 2 | 3
}

// Flatten a Markdoc node's text content (walks `text` nodes' content attribute).
function nodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const obj = node as { type?: string; attributes?: { content?: string }; children?: unknown[] }
  let s = ''
  if (obj.type === 'text' && typeof obj.attributes?.content === 'string') s += obj.attributes.content
  for (const c of obj.children ?? []) s += nodeText(c)
  return s
}

// Deterministic, per-document slugger with dedup counter. Create ONE per document
// and call it in document order; extractHeadings and the heading renderer both use
// this so a TOC link slug always matches its rendered heading id (including the
// -N suffix on duplicate headings).
export function createHeadingSlugger(): (text: string) => string {
  const seen = new Map<string, number>()
  return (text: string): string => {
    const base =
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'section'
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    return n === 0 ? base : `${base}-${n}`
  }
}

// All h2/h3 headings in document order, each with a slug id. One fresh slugger per
// call (matches the renderer, which also uses a fresh slugger per document).
export function extractHeadings(node: unknown): Heading[] {
  const slug = createHeadingSlugger()
  const out: Heading[] = []
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return
    const obj = n as { type?: string; attributes?: { level?: number }; children?: unknown[] }
    const level = obj.attributes?.level
    if (obj.type === 'heading' && (level === 2 || level === 3)) {
      out.push({ id: slug(nodeText(obj).trim()), text: nodeText(obj).trim(), level })
    }
    for (const c of obj.children ?? []) walk(c)
  }
  walk(node)
  return out
}

// Markdoc `heading` node schema that injects an id (slug) on h2/h3, using the
// supplied per-document slugger so ids match extractHeadings. Other levels render
// without an id and do not advance the slugger (matching extractHeadings).
export function headingMarkdocNode(slug: (text: string) => string): Schema {
  return {
    children: ['inline'],
    attributes: { level: { type: Number, required: true } },
    transform(node: MarkdocNode, config: Config) {
      const level = Number(node.attributes.level)
      const children = node.transformChildren(config)
      if (level === 2 || level === 3) {
        return new Markdoc.Tag(`h${level}`, { id: slug(nodeText(node).trim()) }, children)
      }
      return new Markdoc.Tag(`h${level}`, {}, children)
    },
  }
}


// Recursively counts words in a Markdoc AST node: walks `text` nodes and counts
// whitespace-separated tokens in their content attribute.
export function countWords(node: unknown): number {
  if (typeof node === 'string') {
    return node.split(/\s+/).filter(Boolean).length
  }
  if (!node || typeof node !== 'object') return 0
  const obj = node as {
    type?: string
    attributes?: { content?: string }
    children?: unknown[]
  }
  let count = 0
  if (obj.type === 'text' && typeof obj.attributes?.content === 'string') {
    count += obj.attributes.content.split(/\s+/).filter(Boolean).length
  }
  const children = obj.children ?? []
  return count + children.reduce((sum: number, c) => sum + countWords(c), 0)
}

// Estimated reading time in whole minutes (200 words per minute, floor 1).
export function readingTimeMinutes(node: unknown): number {
  return Math.max(1, Math.round(countWords(node) / 200))
}
