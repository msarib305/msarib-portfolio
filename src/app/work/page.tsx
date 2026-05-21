import type { Metadata } from 'next'
import { getProjects }    from '@/data/projects'
import { WorkIndex }      from '@/components/WorkIndex'
import { JsonLd }         from '@/components/JsonLd'

export const metadata: Metadata = {
  title:       'Work',
  description: 'Ten shipped projects across six studios. C++, Blueprints, GAS, multiplayer, AI, geospatial, mobile, VR.',
  alternates:  { canonical: 'https://msarib.dev/work' },
  openGraph: {
    type:        'website',
    url:         'https://msarib.dev/work',
    title:       'Work · Sarib',
    description: 'Ten shipped projects across six studios. C++, Blueprints, GAS, multiplayer, AI, geospatial, mobile, VR.',
    images: [{ url: '/og?title=Work&eyebrow=Selected+Projects', width: 1200, height: 630, alt: 'Work · Sarib' }],
  },
}

export default async function WorkPage() {
  const projects = await getProjects()

  const schema = {
    '@context': 'https://schema.org',
    '@type':    'CollectionPage',
    '@id':      'https://msarib.dev/work#collection',
    'name':     'Work · Muhammad Sarib',
    'url':      'https://msarib.dev/work',
    'author':   { '@id': 'https://msarib.dev/#person' },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': projects.map((p, i) => ({
        '@type':       'ListItem',
        'position':    i + 1,
        'name':        p.title,
        'url':         `https://msarib.dev/projects/${p.slug}`,
        'description': p.summary,
      })),
    },
  }

  return (
    <>
      <JsonLd schema={schema} />
      <WorkIndex />
    </>
  )
}
