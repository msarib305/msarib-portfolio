import { createReader } from '@keystatic/core/reader'
import type { Node as MarkdocNode } from '@markdoc/markdoc'
import keystaticConfig from '../../keystatic.config'
import { readingTimeMinutes, extractHeadings, type Heading } from '@/lib/text'

const reader = createReader(process.cwd(), keystaticConfig)

export type ProjectCover =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; youtubeId: string; title: string }

export interface ProjectItem {
  slug:         string
  title:        string
  displayOrder: number
  summary:      string
  date:         string
  status:       'released' | 'wip' | 'archived' | 'cancelled'
  role:         string
  engine:       string
  tags:         readonly string[]
  client:       string | null
  featured:     boolean
  thumbnail:    { src: string; alt: string }
  cover:        ProjectCover
  links:        readonly { label: string; url: string }[]
  spoilerLinks: readonly { label: string; url: string; warning: string }[]
  tintClass:    'wc-1' | 'wc-2' | 'wc-3' | 'wc-4'
  body:         { node: MarkdocNode }
  readingTimeMinutes: number
  headings:     Heading[]
}

type RawConditional = { discriminant: string; value: Record<string, string | undefined> }

function normalizeCover(raw: RawConditional): ProjectCover {
  if (raw.discriminant === 'image') {
    return { type: 'image', src: raw.value.src ?? '', alt: raw.value.alt ?? '' }
  }
  return { type: 'video', youtubeId: raw.value.youtubeId ?? '', title: raw.value.title ?? '' }
}

async function readAll(): Promise<ProjectItem[]> {
  const entries = await reader.collections.projects.all({ resolveLinkedFiles: true })
  return entries
    .map(e => {
      const body = e.entry.body as unknown as { node: MarkdocNode }
      return {
        slug:         e.slug,
        title:        e.entry.title as string,
        displayOrder: e.entry.displayOrder ?? 99,
        summary:      e.entry.summary,
        date:         e.entry.date,
        status:       e.entry.status as ProjectItem['status'],
        role:         e.entry.role,
        engine:       e.entry.engine,
        tags:         e.entry.tags,
        client:       e.entry.client || null,
        featured:     e.entry.featured,
        thumbnail:    e.entry.thumbnail as { src: string; alt: string },
        cover:        normalizeCover(e.entry.cover as RawConditional),
        links:        e.entry.links as readonly { label: string; url: string }[],
        spoilerLinks: e.entry.spoilerLinks as readonly { label: string; url: string; warning: string }[],
        tintClass:    e.entry.tintClass as ProjectItem['tintClass'],
        body,
        readingTimeMinutes: readingTimeMinutes(body.node),
        headings:           extractHeadings(body.node),
      }
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

export async function getProjects(): Promise<ProjectItem[]> {
  return readAll()
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const all = await readAll()
  return all.filter(p => p.featured)
}

export async function findProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const all = await readAll()
  return all.find(p => p.slug === slug) ?? null
}

export async function getProjectNav(
  slug: string,
): Promise<{ prev: ProjectItem | null; next: ProjectItem | null }> {
  const all = await readAll()
  const idx = all.findIndex(p => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (all[idx - 1] ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1] ?? null) : null,
  }
}
