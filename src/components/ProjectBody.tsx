import Image from 'next/image'
import type { ProjectBodyBlock } from '@/data/projects'

interface ProjectBodyProps {
  blocks: ProjectBodyBlock[]
}

type HeadingBlock    = Extract<ProjectBodyBlock, { type: 'heading' }>
type NonHeadingBlock = Exclude<ProjectBodyBlock, { type: 'heading' }>

interface SectionGroup {
  heading?: HeadingBlock
  blocks:   NonHeadingBlock[]
}

// Groups consecutive non-heading blocks under their preceding heading.
// Blocks before the first heading form an unheaded group.
function groupBlocks(blocks: ProjectBodyBlock[]): SectionGroup[] {
  const groups: SectionGroup[] = []
  let current: SectionGroup = { blocks: [] }

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (current.heading || current.blocks.length > 0) {
        groups.push(current)
      }
      current = { heading: block, blocks: [] }
    } else {
      current.blocks.push(block as NonHeadingBlock)
    }
  }

  if (current.heading || current.blocks.length > 0) {
    groups.push(current)
  }

  return groups
}

function renderBlock(block: NonHeadingBlock, idx: number) {
  switch (block.type) {
    case 'paragraph':
      return <p key={idx}>{block.text}</p>

    case 'list':
      return (
        <ol key={idx} className="case-list">
          {block.items.map((item, j) => (
            <li key={j} className="case-list-item">
              <p>{item}</p>
            </li>
          ))}
        </ol>
      )

    case 'figure':
      return (
        <figure key={idx} className="case-figure">
          <Image
            src={block.src}
            alt={block.alt}
            width={1200}
            height={675}
            sizes="(max-width: 900px) 100vw, 1100px"
            className="w-full"
          />
          {block.caption && (
            <figcaption>{block.caption}</figcaption>
          )}
        </figure>
      )
  }
}

export function ProjectBody({ blocks }: ProjectBodyProps) {
  const groups = groupBlocks(blocks)

  return (
    <>
      {groups.map((group, i) => (
        <section key={i} className="case-section">
          {group.heading && (
            group.heading.level === 2
              ? <h2>{group.heading.text}</h2>
              : <h3>{group.heading.text}</h3>
          )}
          {group.blocks.map((block, j) => renderBlock(block, j))}
        </section>
      ))}
    </>
  )
}
