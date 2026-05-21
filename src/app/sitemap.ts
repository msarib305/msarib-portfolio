import type { MetadataRoute } from 'next'
import { getProjects }          from '@/data/projects'
import { getPublishedWritings } from '@/data/writings'

const BASE = 'https://msarib.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, writings] = await Promise.all([
    getProjects(),
    getPublishedWritings(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/work`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${BASE}/writings`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url:             `${BASE}/projects/${p.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'yearly' as const,
    priority:        0.8,
  }))

  const writingRoutes: MetadataRoute.Sitemap = writings.map(w => ({
    url:             `${BASE}/writings/${w.slug}`,
    lastModified:    w.updated ? new Date(w.updated) : new Date(w.published),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...writingRoutes]
}
