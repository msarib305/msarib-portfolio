/**
 * PLACEHOLDER CONTENT — Cloudinary demo account URLs.
 *
 * Replace these with Sarib's own Cloudinary assets when uploaded.
 * Folder convention: msarib/<project-slug>/<asset-name>.
 *
 * Each item below has a "// TODO: <slug>" comment indicating the
 * project or expertise area the placeholder represents.
 *
 * Swap is a content-only commit; no structural changes needed.
 */

export interface FeaturedWorkItem {
  slug:      string
  title:     string
  summary:   string
  cover:     string       /* Cloudinary URL — full delivery URL */
  coverAlt:  string
  tags:      string[]
  client:    string | null
  year:      string
  tintClass: 'wc-1' | 'wc-2' | 'wc-3' | 'wc-4'
}

const CLOUD = 'https://res.cloudinary.com'
const DEMO  = `${CLOUD}/demo/image/upload/f_auto,q_auto,c_fill,g_auto,w_800`

export const featuredWork: FeaturedWorkItem[] = [
  {
    slug:      'samurai-saga',
    title:     'Samurai Saga',
    summary:   'Combat and multiplayer replication for a third-person open-world P2E. Server-authoritative state, twelve-player session sync, sub-100ms melee.',
    cover:     `${DEMO}/sample`,  // TODO: samurai-saga
    coverAlt:  'Samurai Saga — multiplayer combat screenshot',
    tags:      ['UE5', 'Multiplayer', 'C++', 'P2E'],
    client:    'Exarta',
    year:      '2023 to 2024',
    tintClass: 'wc-1',
  },
  {
    slug:      'nvidia-ai-assistant',
    title:     'NVIDIA AI Assistant',
    summary:   'Real-time AI character driven by NVIDIA Omniverse Audio2Face for facial animation and a self-hosted Llama LLM for contextual responses.',
    cover:     `${DEMO}/sample`,  // TODO: nvidia-ai-assistant
    coverAlt:  'NVIDIA AI Assistant — real-time AI character in Unreal Engine',
    tags:      ['UE5', 'NVIDIA', 'AI', 'Llama LLM'],
    client:    'Exarta',
    year:      '2024',
    tintClass: 'wc-2',
  },
  {
    slug:      'character-creator',
    title:     'Character Creator System',
    summary:   'Runtime character customization with no editor dependency. Modular skeletal mesh, MID skin and hair, blendshapes, and a full save-and-load profile system.',
    cover:     `${DEMO}/sample`,  // TODO: character-creator
    coverAlt:  'Character Creator System — runtime character customization in Unreal Engine',
    tags:      ['UE5', 'Blueprints', 'Materials', 'MID'],
    client:    'Exarta',
    year:      '2023',
    tintClass: 'wc-3',
  },
  {
    slug:      'tresemme-metaverse',
    title:     'TRESemmé Metaverse',
    summary:   'Placeholder summary — to be filled when project details are confirmed.',
    cover:     `${DEMO}/sample`,  // TODO: tresemme-metaverse
    coverAlt:  'TRESemmé Metaverse — real-time branded experience in Unreal Engine',
    tags:      ['UE5', 'Metaverse', 'Real-time'],
    client:    'TRESemmé · HCL',
    year:      '2025',
    tintClass: 'wc-4',
  },
]
