import { createReader } from '@keystatic/core/reader'
import type { Node as MarkdocNode } from '@markdoc/markdoc'
import keystaticConfig from '../../keystatic.config'

const reader = createReader(process.cwd(), keystaticConfig)

export interface ProjectItem {
  slug:      string
  title:     string
  summary:   string
  body:      { node: MarkdocNode }
  cover:     string
  coverAlt:  string
  tags:      readonly string[]
  client:    string | null
  year:      string
  status:    'shipped' | 'in-development' | 'archived'
  role:      string
  engine:    string
  gallery:   readonly string[]
  video:     string | null
  featured:  boolean
  tintClass: 'wc-1' | 'wc-2' | 'wc-3' | 'wc-4'
  links:     readonly { label: string; href: string }[]
}

async function readAll(): Promise<ProjectItem[]> {
  const entries = await reader.collections.projects.all({ resolveLinkedFiles: true })
  return entries.map(e => ({
    slug:      e.slug,
    title:     e.entry.title as string,
    summary:   e.entry.summary,
    body:      e.entry.body as unknown as { node: MarkdocNode },
    cover:     e.entry.cover,
    coverAlt:  e.entry.coverAlt,
    tags:      e.entry.tags,
    client:    e.entry.client || null,
    year:      e.entry.year,
    status:    e.entry.status as ProjectItem['status'],
    role:      e.entry.role,
    engine:    e.entry.engine,
    gallery:   e.entry.gallery,
    video:     e.entry.video || null,
    featured:  e.entry.featured,
    tintClass: e.entry.tintClass as ProjectItem['tintClass'],
    links:     e.entry.links,
  }))
}

export async function getProjects(): Promise<ProjectItem[]> {
  return readAll()
}

export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const all = await readAll()
  return all.filter(p => p.featured).slice(0, 4)
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
