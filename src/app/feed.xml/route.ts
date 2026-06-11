import { getPublishedWritings } from '@/data/writings'

const SITE_URL = 'https://msarib.dev'
const AUTHOR   = 'Muhammad Sarib'

function escapeCDATA(s: string): string {
  return s.replace(/\]\]>/g, ']]]]><![CDATA[>')
}

// Prerender at build time. getPublishedWritings() reads the Keystatic content/
// files, which exist at build but are not bundled into a dynamic serverless
// function, so a request-time render would emit an empty feed in production the
// moment a writing is published. Static generation runs the read at build, when
// the content is present, and regenerates on the next deploy (DEC-082).
export const dynamic = 'force-static'

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const writings = await getPublishedWritings()

  const items = writings.map(w => `
    <item>
      <title><![CDATA[${escapeCDATA(w.title)}]]></title>
      <link>${SITE_URL}/writings/${w.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writings/${w.slug}</guid>
      <description><![CDATA[${escapeCDATA(w.summary)}]]></description>
      <pubDate>${new Date(w.published).toUTCString()}</pubDate>
      ${w.tags.map(t => `<category>${xmlEscape(t)}</category>`).join('\n      ')}
    </item>`).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writings · Sarib</title>
    <link>${SITE_URL}/writings</link>
    <description>Technical notes on Unreal Engine 5: multiplayer replication, performance, editor tools, and the systems work that doesn&apos;t show up in a screenshot reel.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>contact@msarib.dev (${AUTHOR})</managingEditor>
    <webMaster>contact@msarib.dev (${AUTHOR})</webMaster>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
