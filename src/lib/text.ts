// Shared text helpers over Markdoc ASTs, used by the project and writing data
// readers. Extracted from writings.ts in Phase 23.4 so case studies and writings
// compute reading time the same way.

// Recursively counts words in a Markdoc AST node: walks `text` nodes and counts
// whitespace-separated tokens in their content attribute.
export function countWords(node: unknown): number {
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

// Estimated reading time in whole minutes (200 words per minute, floor 1).
export function readingTimeMinutes(node: unknown): number {
  return Math.max(1, Math.round(countWords(node) / 200))
}
