/**
 * Expertise cards for the home-page grid. bwImage ships real per-card art from
 * Sarib's ddgwzcrim Cloudinary cloud; CSS applies the grayscale + tint treatment.
 */

export interface ExpertiseItem {
  slug:       string
  title:      string
  bwImage:    string    /* Cloudinary URL, colour source, CSS applies grayscale */
  bwImageAlt: string
  tintClass:  'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8'
}

const CLOUD = 'https://res.cloudinary.com'
// Phase 21.1: bwImage ships real per-card art from Sarib's ddgwzcrim cloud.
// Delivery transform: f_auto serves WebP/AVIF, c_fill,g_auto crops to the card
// frame. Public_ids carry no extension so f_auto picks the format.
const CARD_BASE = `${CLOUD}/ddgwzcrim/image/upload/f_auto,q_auto,c_fill,g_auto,w_600`

export const expertise: ExpertiseItem[] = [
  {
    slug:       'combat-gameplay',
    title:      'Combat & Gameplay Systems',
    bwImage:    `${CARD_BASE}/CombatAndGameplay_fdjwr2`,
    bwImageAlt: 'Combat and gameplay systems, Unreal Engine development',
    tintClass:  'c1',
  },
  {
    slug:       'multiplayer-replication',
    title:      'Multiplayer Replication',
    bwImage:    `${CARD_BASE}/MultiplayerReplication_lvwbzs`,
    bwImageAlt: 'Multiplayer and replication, server-authoritative UE5 networking',
    tintClass:  'c2',
  },
  {
    slug:       'performance-profiling',
    title:      'Performance Profiling',
    bwImage:    `${CARD_BASE}/PerformanceAndProfiling_zfnmnu`,
    bwImageAlt: 'Performance profiling, Unreal Insights, Stat GPU, RenderDoc',
    tintClass:  'c3',
  },
  {
    slug:       'virtual-reality',
    title:      'Virtual Reality',
    bwImage:    `${CARD_BASE}/VirtualReality_g1tlwh`,
    bwImageAlt: 'Virtual Reality, Meta Quest 2 standalone UE5 development',
    tintClass:  'c4',
  },
  {
    slug:       'artificial-intelligence',
    title:      'Artificial Intelligence',
    bwImage:    `${CARD_BASE}/ArtificialIntelligence_qfadgm`,
    bwImageAlt: 'AI in Unreal Engine, Behavior Trees, EQS, GAS, Convai, Llama LLM',
    tintClass:  'c5',
  },
  {
    slug:       'rendering',
    title:      'Rendering',
    bwImage:    `${CARD_BASE}/Rendering_trejpe`,
    bwImageAlt: 'Rendering, Niagara VFX, materials, post-process, Sequencer',
    tintClass:  'c6',
  },
  {
    slug:       'metaverse',
    title:      'Metaverse',
    bwImage:    `${CARD_BASE}/Metaverse_ennvmp`,
    bwImageAlt: 'Metaverse, Pixel Streaming, Cesium 3D Tiles, branded real-time experiences',
    tintClass:  'c7',
  },
  {
    slug:       'editor-tools-verse',
    title:      'Editor Tools & Verse',
    bwImage:    `${CARD_BASE}/EditorToolsAndVerse_xh49xm`,
    bwImageAlt: 'Editor tools and Verse, UEFN, Fortnite Creative, utility widgets',
    tintClass:  'c8',
  },
]
