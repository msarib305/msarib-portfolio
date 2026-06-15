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

export interface ExpertiseItem {
  slug:       string
  title:      string
  bwImage:    string    /* Cloudinary URL — colour source, CSS applies grayscale */
  bwImageAlt: string
  video:      string    /* Cloudinary video URL */
  poster:     string    /* Still frame URL for video first-paint */
  tintClass:  'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8'
}

const CLOUD = 'https://res.cloudinary.com'
// Phase 21.1: bwImage now ships real per-card art from Sarib's ddgwzcrim cloud.
// Same delivery transform as before (f_auto serves WebP/AVIF, c_fill,g_auto
// crops to the card frame). Public_ids carry no extension so f_auto picks format.
const CARD_BASE = `${CLOUD}/ddgwzcrim/image/upload/f_auto,q_auto,c_fill,g_auto,w_600`
const VID   = `${CLOUD}/demo/video/upload/f_auto,q_auto`
const POST  = `${CLOUD}/demo/video/upload/f_jpg,q_auto,so_0`

export const expertise: ExpertiseItem[] = [
  {
    slug:       'combat-gameplay',
    title:      'Combat & Gameplay Systems',
    bwImage:    `${CARD_BASE}/CombatAndGameplay_fdjwr2`,
    bwImageAlt: 'Combat and gameplay systems — Unreal Engine development',
    video:      `${VID}/sea_turtle`,     // TODO: combat-gameplay
    poster:     `${POST}/sea_turtle`,    // TODO: combat-gameplay
    tintClass:  'c1',
  },
  {
    slug:       'multiplayer-replication',
    title:      'Multiplayer Replication',
    bwImage:    `${CARD_BASE}/MultiplayerReplication_lvwbzs`,
    bwImageAlt: 'Multiplayer and replication — server-authoritative UE5 networking',
    video:      `${VID}/sea_turtle`,     // TODO: multiplayer-replication
    poster:     `${POST}/sea_turtle`,    // TODO: multiplayer-replication
    tintClass:  'c2',
  },
  {
    slug:       'performance-profiling',
    title:      'Performance Profiling',
    bwImage:    `${CARD_BASE}/PerformanceAndProfiling_zfnmnu`,
    bwImageAlt: 'Performance profiling — Unreal Insights, Stat GPU, RenderDoc',
    video:      `${VID}/sea_turtle`,     // TODO: performance-profiling
    poster:     `${POST}/sea_turtle`,    // TODO: performance-profiling
    tintClass:  'c3',
  },
  {
    slug:       'virtual-reality',
    title:      'Virtual Reality',
    bwImage:    `${CARD_BASE}/VirtualReality_g1tlwh`,
    bwImageAlt: 'Virtual Reality — Meta Quest 2 standalone UE5 development',
    video:      `${VID}/sea_turtle`,     // TODO: virtual-reality
    poster:     `${POST}/sea_turtle`,    // TODO: virtual-reality
    tintClass:  'c4',
  },
  {
    slug:       'artificial-intelligence',
    title:      'Artificial Intelligence',
    bwImage:    `${CARD_BASE}/ArtificialIntelligence_qfadgm`,
    bwImageAlt: 'AI in Unreal Engine — Behavior Trees, EQS, GAS, Convai, Llama LLM',
    video:      `${VID}/sea_turtle`,     // TODO: artificial-intelligence
    poster:     `${POST}/sea_turtle`,    // TODO: artificial-intelligence
    tintClass:  'c5',
  },
  {
    slug:       'rendering',
    title:      'Rendering',
    bwImage:    `${CARD_BASE}/Rendering_trejpe`,
    bwImageAlt: 'Rendering — Niagara VFX, materials, post-process, Sequencer',
    video:      `${VID}/sea_turtle`,     // TODO: rendering
    poster:     `${POST}/sea_turtle`,    // TODO: rendering
    tintClass:  'c6',
  },
  {
    slug:       'metaverse',
    title:      'Metaverse',
    bwImage:    `${CARD_BASE}/Metaverse_ennvmp`,
    bwImageAlt: 'Metaverse — Pixel Streaming, Cesium 3D Tiles, branded real-time experiences',
    video:      `${VID}/sea_turtle`,     // TODO: metaverse
    poster:     `${POST}/sea_turtle`,    // TODO: metaverse
    tintClass:  'c7',
  },
  {
    slug:       'editor-tools-verse',
    title:      'Editor Tools & Verse',
    bwImage:    `${CARD_BASE}/EditorToolsAndVerse_xh49xm`,
    bwImageAlt: 'Editor tools and Verse — UEFN, Fortnite Creative, utility widgets',
    video:      `${VID}/sea_turtle`,     // TODO: editor-tools-verse
    poster:     `${POST}/sea_turtle`,    // TODO: editor-tools-verse
    tintClass:  'c8',
  },
]
