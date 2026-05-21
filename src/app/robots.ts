import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/keystatic/', '/api/', '/design-system/'],
      },
    ],
    sitemap: 'https://msarib.dev/sitemap.xml',
  }
}
