import type { MetadataRoute } from 'next'

// AI crawlers allowed explicitly. The wildcard rule below already permits them
// (allow '/'), so these entries are an intentional, legible signal that training,
// retrieval, and AI-search bots are welcome, not a policy override. Recruiters
// increasingly research candidates through these tools (Phase 19.7, DEC-082).
const AI_CRAWLERS = [
  'GPTBot',            // OpenAI training
  'Google-Extended',   // Google AI training (Gemini)
  'ClaudeBot',         // Anthropic training
  'anthropic-ai',      // legacy Anthropic UA
  'CCBot',             // Common Crawl (base dataset for many AI products)
  'PerplexityBot',     // Perplexity indexing and retrieval
  'ChatGPT-User',      // ChatGPT on-demand retrieval
  'Claude-User',       // Claude on-demand retrieval
  'OAI-SearchBot',     // OpenAI search product
  'Applebot-Extended', // Apple Intelligence
  'Bytespider',        // ByteDance (TikTok / Doubao)
  'Meta-ExternalAgent', // Meta Llama training
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  ['/keystatic/', '/api/', '/design-system/', '/_next/', '/og'],
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://msarib.dev/sitemap.xml',
  }
}
