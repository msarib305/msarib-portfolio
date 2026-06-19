import type { MetadataRoute } from 'next'
import { getProjects }          from '@/data/projects'
import { getPublishedWritings } from '@/data/writings'

const BASE = 'https://msarib.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writings] = await Promise.all([
    getProjects(),
    getPublishedWritings(),
  ])

  const SITE_LAUNCH = new Date('2025-04-01')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/work`,     lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: SITE_LAUNCH, changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${BASE}/writings`, lastModified: SITE_LAUNCH, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,  lastModified: SITE_LAUNCH, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${BASE}/resilience`, lastModified: SITE_LAUNCH, changeFrequency: 'yearly', priority: 0.5 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url:             `${BASE}/projects/${p.slug}`,
    lastModified:    SITE_LAUNCH,
    changeFrequency: 'yearly' as const,
    priority:        0.8,
    images:          [p.cover.type === 'image' ? p.cover.src : p.thumbnail.src],
  }))

  const writingRoutes: MetadataRoute.Sitemap = writings.map(w => ({
    url:             `${BASE}/writings/${w.slug}`,
    lastModified:    w.updated ? new Date(w.updated) : new Date(w.published),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...writingRoutes]
}
