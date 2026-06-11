import { getProjects } from '@/data/projects'

// llms.txt: a concise, machine-readable site overview for AI tools (Phase 19.7,
// DEC-082). Same delivery pattern as feed.xml. The case-study list is generated
// from Keystatic content so it stays in sync; the rest is editorial. All facts
// trace to MASTER_CONTEXT.md. No em-dashes, no en-dashes.

const SITE = 'https://msarib.dev'

// First sentence of a summary, for a one-line description per case study.
function firstSentence(summary: string): string {
  const trimmed = summary.trim()
  const end = trimmed.indexOf('. ')
  return end === -1 ? trimmed : trimmed.slice(0, end + 1)
}

export async function GET() {
  const projects = await getProjects()

  const caseStudies = projects
    .map((p) => `- [${p.title}](${SITE}/projects/${p.slug}): ${firstSentence(p.summary)}`)
    .join('\n')

  const body = `# Muhammad Sarib (Sarib)

> Lead Unreal Engine 5 developer with seven years in engine and ten shipped titles across six studios. Focus on PC and Steam game development: C++, Blueprints, Gameplay Ability System, multiplayer replication, and performance optimization.

Sarib leads engineering at SwiftNine LLC in Lahore, Pakistan. He has shipped on every Unreal Engine 5 version from 5.0 to 5.7 and on Unreal Engine 4 from 4.22 to 4.27. The portfolio includes a Steam release, a Tokyo Game Show 2024 floor demo, six live UEFN titles, and an NVIDIA-powered in-engine AI assistant. He is open to senior and lead engineering roles at studios in Germany and Japan, and to freelance contracts worldwide.

## Core pages
- [Home](${SITE}): Portfolio overview and showreel.
- [About](${SITE}/about): Background, career timeline, and skills.
- [Work](${SITE}/work): Case studies across the portfolio.
- [Contact](${SITE}/contact): Availability and how to get in touch.

## Case studies
${caseStudies}

## More
- [Resume (PDF)](${SITE}/resume.pdf): Full professional history.
- [RSS feed](${SITE}/feed.xml): Engineering writings.
- [LinkedIn](https://www.linkedin.com/in/msarib/)
- [YouTube](https://www.youtube.com/@msarib305)
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
