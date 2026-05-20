import { createReader } from '@keystatic/core/reader'
import type { Node as MarkdocNode } from '@markdoc/markdoc'
import keystaticConfig from '../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

export interface WritingItem {
  slug:               string
  title:              string
  summary:            string
  published:          string
  updated:            string | null
  status:             'published' | 'draft'
  tags:               readonly string[]
  featured:           boolean
  body:               { node: MarkdocNode }
  readingTimeMinutes: number
}

function countWords(node: unknown): number {
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

async function readAll(): Promise<WritingItem[]> {
  const entries = await reader.collections.writings.all({ resolveLinkedFiles: true })
  return entries.map(e => {
    const body = e.entry.body as unknown as { node: MarkdocNode }
    return {
      slug:               e.slug,
      title:              e.entry.title as string,
      summary:            e.entry.summary,
      published:          e.entry.published ?? '',
      updated:            e.entry.updated || null,
      status:             e.entry.status as WritingItem['status'],
      tags:               e.entry.tags,
      featured:           e.entry.featured,
      body,
      readingTimeMinutes: Math.max(1, Math.round(countWords(body.node) / 200)),
    }
  }).sort((a, b) => b.published.localeCompare(a.published))
}

export async function getAllWritings(): Promise<WritingItem[]> {
  return readAll()
}

export async function getPublishedWritings(): Promise<WritingItem[]> {
  const all = await readAll()
  return all.filter(w => w.status === 'published')
}

export async function findWritingBySlug(slug: string): Promise<WritingItem | null> {
  const all = await readAll()
  return all.find(w => w.slug === slug) ?? null
}

export async function getWritingNav(
  slug: string,
): Promise<{ prev: WritingItem | null; next: WritingItem | null }> {
  const published = await getPublishedWritings()
  const idx = published.findIndex(w => w.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (published[idx - 1] ?? null) : null,
    next: idx < published.length - 1 ? (published[idx + 1] ?? null) : null,
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const published = await getPublishedWritings()
  return published.map(w => w.slug)
}
