/**
 * PLACEHOLDER CONTENT — Cloudinary demo account URLs.
 *
 * Replace with Sarib's own Cloudinary assets when uploaded.
 * Folder convention: msarib/<project-slug>/<asset-name>.
 *
 * Body blocks marked // TODO: fill gaps with assumptions from
 * PROFESSIONAL_HISTORY.md. Sarib reviews and corrects before launch.
 */

export interface ProjectItem {
  slug:      string
  title:     string
  summary:   string        // single-line; used on cards and as case study sub-headline
  body:      ProjectBodyBlock[]
  cover:     string        // Cloudinary delivery URL
  coverAlt:  string
  tags:      string[]
  client:    string | null
  year:      string        // e.g. '2023 to 2024'
  status:    'shipped' | 'in-development' | 'archived'
  role:      string
  engine:    string
  gallery:   string[]      // additional Cloudinary URLs (Phase 10)
  video:     string | null // YouTube video ID (Phase 10 embeds via react-lite-youtube-embed)
  featured:  boolean
  tintClass: 'wc-1' | 'wc-2' | 'wc-3' | 'wc-4'
  links:     { label: string; href: string }[]
}

export type ProjectBodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading';   level: 2 | 3; text: string }
  | { type: 'list';      items: string[] }
  | { type: 'figure';    src: string; alt: string; caption?: string }

const CLOUD = 'https://res.cloudinary.com'
const DEMO  = `${CLOUD}/demo/image/upload/f_auto,q_auto,c_fill,g_auto,w_800`

export const projects: ProjectItem[] = [
  {
    slug:     'samurai-saga',
    title:    'Samurai Saga',
    summary:  'Combat and multiplayer replication for a third-person open-world P2E. Server-authoritative state, twelve-player session sync, sub-100ms melee.',
    cover:    `${DEMO}/sample`,  // TODO: samurai-saga
    coverAlt: 'Samurai Saga — multiplayer combat screenshot',
    tags:     ['UE5', 'Multiplayer', 'C++', 'P2E', 'Ethereum'],
    client:   'Exarta',
    year:     '2023 to 2024',
    status:   'archived',
    role:     'Senior UE Developer',
    engine:   'UE5 · C++ and Blueprint',
    gallery:  [],
    video:    'qTzConyC1z8',
    featured: true,
    tintClass: 'wc-1',
    links: [
      { label: 'Project site', href: 'https://samuraisaga.com' },
      { label: 'Trailer', href: 'https://youtu.be/qTzConyC1z8' },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Samurai Saga is a third-person open-world play-to-earn combat title on Ethereum. Three NFT-backed character classes (Cyborg Samurai, Kaiju Monsters, Onna-Bugeisha) with distinct movesets. My role covered the combat systems layer and the multiplayer replication architecture.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The problem.',
      },
      {
        type: 'paragraph',
        text: 'Build a server-authoritative combat system for twelve concurrent players. Combat needed to feel responsive at Pakistani-to-international server latencies while staying cheat-resistant. The existing replication setup was ad-hoc and collapsed above six players; desync became visible as player count grew.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What I built.',
      },
      {
        type: 'list',
        items: [
          'Custom ReplicationGraph — migrated from default actor replication to a custom graph. Reduced bandwidth per client by 38% through connection-group bucketing and dormancy policies.',
          'Server-authoritative melee — rolling-buffer rollback for hit detection. The server is the arbiter; honest clients never feel the lag.',
          'GAS migration — replaced ad-hoc combat state with Gameplay Ability System. New abilities ship in a day instead of a week.',
          'Architecture documentation — architecture overview, gotchas list, and code review checklist for the junior UE engineers.', // TODO: confirm team size involved in Samurai Saga specifically
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Outcome.',
      },
      {
        type: 'paragraph',
        text: 'Twelve-player sessions running stable. Sub-100ms melee responsiveness. Bandwidth per client down 38%. The GAS migration cut new ability iteration time significantly and gave the design team a clear surface to extend without touching the combat core.', // TODO: add exact ability iteration time reduction if data is available
      },
    ],
  },

  {
    slug:     'nvidia-ai-assistant',
    title:    'NVIDIA AI Assistant',
    summary:  'Real-time AI character driven by NVIDIA Omniverse Audio2Face for facial animation and a self-hosted Llama LLM for contextual responses.',
    cover:    `${DEMO}/sample`,  // TODO: nvidia-ai-assistant
    coverAlt: 'NVIDIA AI Assistant — real-time AI character in Unreal Engine',
    tags:     ['UE5', 'NVIDIA', 'AI', 'Llama LLM', 'Audio2Face'],
    client:   'Exarta',
    year:     '2024',
    status:   'archived',
    role:     'Senior UE Developer',
    engine:   'UE5 · Blueprint',
    gallery:  [],
    video:    'gakXRloKGlw',
    featured: true,
    tintClass: 'wc-2',
    links: [
      { label: 'Demo video', href: 'https://youtu.be/gakXRloKGlw' },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Real-time AI assistant character in Unreal driven by NVIDIA Omniverse Audio2Face for facial animation and lip sync, with a self-hosted Llama LLM backend generating contextual responses. Three systems that do not natively speak to each other, wired into one runtime loop.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'The constraint.',
      },
      {
        type: 'paragraph',
        text: 'End-to-end latency had to stay below the threshold where conversational pacing breaks. Audio2Face needs audio to drive it, which means the TTS pipeline had to begin streaming before the full LLM response was available. Synchronous calls from the game thread were not an option.', // TODO: add specific latency target if Sarib has the number
      },
      {
        type: 'heading',
        level: 2,
        text: 'Architecture.',
      },
      {
        type: 'list',
        items: [
          'Llama backend — self-hosted on a dedicated server. Prompt formatted for the Llama family with narrative context at system-prompt level. No cloud API dependency.',
          'Audio2Face integration — driven by streamed audio from the TTS pipeline. Blend shapes from Audio2Face piped into the UE5 MetaHuman rig at runtime.',
          'Blueprint orchestration — async Blueprint nodes with explicit latency-budget guards. Game thread never stalls waiting on inference.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Self-hosting the LLM rather than calling a cloud API was the right call for latency and data-privacy reasons. The tradeoff was setup complexity: model loading, GPU memory management, prompt formatting, and response streaming all had to be solved before the UE integration could begin.', // TODO: confirm whether this ran on Exarta server hardware or a cloud VM
      },
    ],
  },

  {
    slug:     'character-creator',
    title:    'Character Creator System',
    summary:  'Runtime character customization with no editor dependency. Modular skeletal mesh, MID skin and hair, blendshapes, and a full save-and-load profile system.',
    cover:    `${DEMO}/sample`,  // TODO: character-creator
    coverAlt: 'Character Creator System — runtime character customization in Unreal Engine',
    tags:     ['UE5', 'Blueprints', 'Materials', 'MID', 'Animation'],
    client:   'Exarta',
    year:     '2023',
    status:   'shipped',
    role:     'UE Developer',
    engine:   'UE5 · Blueprint',
    gallery:  [],
    video:    'HQ1BEmAtTb4',
    featured: true,
    tintClass: 'wc-3',
    links: [
      { label: 'Showcase (Exarta)', href: 'https://youtu.be/HQ1BEmAtTb4' },
      { label: 'Showcase (personal)', href: 'https://youtube.com/watch?v=DgFPmKbyyos' },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Runtime character customization with no editor dependency. The entire system runs at game runtime. That was the hard constraint from the start: no editor tooling passes, no build steps, no cook-time baking. Designers can customize characters in a shipped build.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Feature set.',
      },
      {
        type: 'list',
        items: [
          'Modular skeletal mesh swapping — components swap at runtime without breaking the animation blueprint or losing attachment sockets.',
          'Groom-based hair — hair components driven by Groom assets for strand-level fidelity.',
          'Material Instance Dynamic — skin color, eye color, hair color all driven by MID parameters. No material variant proliferation.',
          'Blendshape morphology — arm length, lip shape, nose size controlled by morph target weights at runtime.',
          'Decal system — tattoos, scars, moles applied as runtime decal components, positioned and scaled per save profile.',
          'Save-and-load profile system — complete character state serialized to disk and restored exactly on load.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'The hard part.',
      },
      {
        type: 'paragraph',
        text: 'Keeping the animation blueprint valid across mesh swaps. Every swap has to preserve attachment sockets, maintain the same skeleton hierarchy, and not trigger animation blueprint re-initialization. The solution was strict component-swap ordering with a pre-validation pass that rejected incompatible meshes before they reached the rendering pipeline.', // TODO: verify exact technical mechanism used for animation blueprint continuity
      },
    ],
  },

  {
    slug:     'tresemme-metaverse',
    title:    'TRESemmé Metaverse',
    summary:  'The first beauty-industry metaverse experience in Pakistan, built in Unreal Engine for Unilever TRESemmé. Covered by IGN, BeautyMatter, Happi, and Retail Tech Innovation Hub.',
    cover:    `${DEMO}/sample`,  // TODO: tresemme-metaverse
    coverAlt: 'TRESemmé Metaverse — real-time branded experience in Unreal Engine',
    tags:     ['UE5', 'Metaverse', 'Multiplayer', 'Branding'],
    client:   'TRESemmé · Unilever',
    year:     '2022 to 2023',      // CORRECTED from '2025' — press article dated 2022/11/8
    status:   'shipped',
    role:     'Senior UE Developer',
    engine:   'UE5 · Blueprint',
    gallery:  [],
    video:    'kASz5P7nAuE',
    featured: true,
    tintClass: 'wc-4',
    links: [
      { label: 'Trailer', href: 'https://youtu.be/kASz5P7nAuE' },
      { label: 'BeautyMatter', href: 'https://beautymatter.com/articles/tre-semme-debuts-pakistans-first-beauty-entry-into-the-metaverse' },
      { label: 'IGN Pakistan', href: 'https://pk.ign.com/pc/194264/metaverse-in-pakistan-unilever-breaks-new-ground-for-customer-experience' },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'The first beauty-industry metaverse experience in Pakistan, engineered in Unreal Engine for Unilever TRESemmé. The project was covered by four independent press publications: IGN Pakistan, BeautyMatter, Happi, and Retail Tech Innovation Hub.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'What it was.',
      },
      {
        type: 'paragraph',
        text: 'A real-time branded metaverse environment running in Unreal Engine. Visitors could explore the TRESemmé world and interact with branded content in a photorealistic real-time environment. Built on the multiplayer replication infrastructure that scaled the Exarta Metaverse from 10 to 40 concurrent players.', // TODO: Sarib to confirm specific visitor interactions
      },
      {
        type: 'heading',
        level: 2,
        text: 'Engineering scope.',
      },
      {
        type: 'list',
        items: [
          'Scene density optimization — enforced LOD distances and instanced static mesh batching held frame rate as the branded environment filled with geometry.',
          'Multiplayer presence — concurrent player capacity from the Exarta Metaverse replication work, applied to the branded environment session.',
          'Post-process calibration — color grading, depth of field, and bloom tuned to match the TRESemmé visual identity rather than a default cinematic look.', // TODO: confirm specific post-process pipeline details
        ],
      },
      {
        type: 'paragraph',
        text: 'Four independent press publications covered the launch. IGN Pakistan and BeautyMatter are the strongest signals, targeting both the games industry and the beauty-marketing audience respectively.',
      },
    ],
  },
]

// Home page grid — top 4 featured projects in order.
export const featuredProjects: ProjectItem[] =
  projects.filter(p => p.featured).slice(0, 4)

export function findProjectBySlug(slug: string): ProjectItem | undefined {
  return projects.find(p => p.slug === slug)
}

// Returns null at boundaries (no circular wrap).
// CaseStudyNav handles null prev by showing "All work" link.
export function getProjectNav(
  slug: string,
): { prev: ProjectItem | null; next: ProjectItem | null } {
  const idx = projects.findIndex(p => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (projects[idx - 1] ?? null) : null,
    next: idx < projects.length - 1 ? (projects[idx + 1] ?? null) : null,
  }
}
