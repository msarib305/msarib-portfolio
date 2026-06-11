import { getProjects } from '@/data/projects'

// llms-full.txt: a dense, machine-readable profile for AI tools doing deep research
// on Sarib (Phase 19.7, DEC-082). Every fact traces to MASTER_CONTEXT.md or
// PROFESSIONAL_HISTORY.md (see the fact-source map in the phase plan). Locked
// redaction rules: the Vmmersion title is never named (framed as an anime-stylized
// action title at TGS 2024 on Steam), the AI antagonist is "the AI pursuer," the
// Steam URL is not included, and Web3 work is named inside bullets, never led with.
// No em-dashes, no en-dashes.

const SITE = 'https://msarib.dev'

// Prerender at build time. getProjects() reads the Keystatic content/ files,
// which exist in the build environment but are NOT bundled into a dynamic
// serverless function, so a request-time render returns an empty case-study
// list in production. Static generation (matching sitemap.ts) runs the read at
// build, when the content is present, and serves the baked result. (DEC-082)
export const dynamic = 'force-static'

// Editorial per-slug prose, keyed by case-study slug. The route emits these in the
// site's display order from getProjects(); a missing slug falls back to its summary.
const CASE_STUDY_PROSE: Record<string, string> = {
  'anime-stylized-action-tgs2024':
    'Lead Software Developer at Vmmersion LLC, a US studio, remote, for twelve months. An anime-stylized action title that showcased on the Tokyo Game Show 2024 floor and shipped on Steam. Owned ten gameplay systems: behavior trees, localization, abilities, Quick Time Events, AI navigation, combat state machines, minimap, objectives, dialog, settings, and game states. The AI pursuer, the antagonist who hunts the player through the level, was the most engineering-heavy character, with her own behavior tree, navigation pipeline, and movement-naturalness pass. Locked the TGS demo at 60 FPS on mid-range PC hardware (i7-14700K, RTX 3060 8GB), cut frame-time hitches by 98 percent through PSO caching and shader warmup, and reduced level-transition load times by 40 percent via soft-reference migration and async loading. Unreal Engine 5.5 to 5.6.',

  'character-creator-system':
    'Runtime character customization system built solo on Unreal Engine 4.27 during the first Exarta engagement, with no editor dependency: it runs in the packaged game client, not as an editor tool. 18 customization categories, 22 morph sliders driving 34 hand-authored Maya blendshapes, three custom shaders (skin, hair groom, eye color), and 16 premade characters. A modular subsystem architecture let future titles inherit individual parts, and a replicated config struct assembled the final avatar across connected clients. Base meshes were Epic Metahuman skeletons.',

  'exarta-metaverse':
    'Multiplayer engineering on the Exarta Metaverse (internal name Valayt) across two engagements: UE 4.27 replication foundations in the first, UE 5.2 to 5.3 scaling in the Senior return. Lifted concurrent player capacity from 10 to 40 by fixing replication topology (differential replication, relevancy and owner filtering, dirty-flag patterns) and rebuilding ad-hoc client logic as server-authoritative RPCs, reclaiming network bandwidth per client. Dedicated servers ran on AWS GameLift.',

  'exarta-uefn-portfolio':
    'Lead UEFN Developer on six concurrent titles live in Fortnite Creative under the @exarta channel, built on UEFN 5.1 to 5.3 from Q1 2023 to Q1 2024. The flagship, Enigmara, is a Domination game across two factions and four capture points; it pulled around 100 daily active users in steady state with peaks near 200, and ran a PKR 100,000 tournament in October 2023 across eight teams on a Verse spectator mode and a Discord-driven leaderboard. The other five titles span parkour racing, class-based team deathmatch, a wave-survival mode, a seasonal Christmas variant, and a central hub. Architectural rule across the portfolio: lean on UEFN devices where they cover the case, and write Verse where they hit their limit (Enigmara needed real Verse for matchmaking and faction balancing).',

  'nvidia-ai-assistant':
    'A real-time AI assistant character in an AR retail-shop tech demo, built during the Exarta Senior return on UE 5.3 in Q1 2024. Two-machine architecture: the UE client captured player microphone audio through a custom C++ plugin and sent it over a custom C++ WebSocket plugin to an AI machine running Llama 2, NVIDIA Riva (speech to text and text to speech), and NVIDIA Audio2Face; synthesized audio and facial animation returned over WebSocket and Live Link. Sarib owned the C++ mic-capture and WebSocket plugins, the Metahuman Animation Blueprint receiving the Audio2Face blendshape stream, the AR overlay UI, and demo scripting. End-to-end latency under 2 seconds, 1 to 1.5 seconds under simulated 4G.',

  'samurai-saga':
    'Multiplayer Combat Developer on contract (via Upwork) for Samurai Saga, a third-person multiplayer combat game with three NFT-backed character classes on Ethereum. Unreal Engine 5.3. Built the combat systems and the server-authoritative replication topology for real-time state sync across players in fast-paced melee. Under NDA until public release; in private playtesting as of 2026.',

  'tresemme-tresverse':
    'The Unilever TRESemmé TRESverse, the first beauty-industry metaverse experience in Pakistan, engineered on Unreal Engine 5.0 during the Exarta Senior return and launched November 10, 2022. Browser-based pixel streaming via Eagle 3D Streaming on AWS, with rendered frames streamed to browsers and inputs returned over WebRTC. Co-engineered with two other UE5 engineers plus web-client and UX leads. Avatar customization, a treatment-driven hair mechanic on Metahuman grooms with dynamic material instances, two environments, and 10-per-session multiplayer presence. Covered by five press publications: BeautyMatter, IGN Pakistan, Happi, Retail Tech Innovation Hub, and parlayme.',

  'xandar':
    'Sole MVP developer on contract (via Upwork for ArgonTeq Inc) on Xandar, a turn-based combat game with NFT-linked roster management on Solana. Unreal Engine 4.27, three months, delivered on schedule. Built the entire Blueprint framework: a round state machine with deterministic phase transitions, a hero ability framework with inheritance, NFT-linked roster management with a mocked Solana lookup behind a real integration surface, combat resolution, and trailer-ready UI (six heroes, three abilities each). ArgonTeq engineers built on the framework after handoff; the game is live on GameSwift.',
}

export async function GET() {
  const projects = await getProjects()

  const caseStudies = projects
    .map((p) => {
      const prose = CASE_STUDY_PROSE[p.slug] ?? p.summary
      return `### ${p.title}\n${prose}\n${SITE}/projects/${p.slug}`
    })
    .join('\n\n')

  const body = `# Muhammad Sarib (Sarib): full profile

## Overview
Sarib (legal name Muhammad Sarib) is a Lead Unreal Engine 5 developer with seven years in engine, currently leading engineering at SwiftNine LLC in Lahore, Pakistan. His primary strength is PC and Steam game development. His range, mentioned but not led with, covers mobile, VR on Meta Quest, UEFN and Verse, pixel streaming, AI integrations (NVIDIA Audio2Face and Riva, Llama LLM), and geospatial work (Cesium for Unreal).

## Professional positioning
Role: Lead Unreal Engine 5 Developer. Location: Lahore, Pakistan, on-site. Current employer: SwiftNine LLC, a subsidiary of Clutched Studios, since July 2025. Seven years in engine across ten shipped titles and six studios. Shipped on every Unreal Engine 5 version from 5.0 to 5.7 and on Unreal Engine 4 from 4.22 to 4.27. At SwiftNine he is the sole UE engineer, setting technical direction, performance budgets, and the Blueprint coding standard, and has shipped two mobile titles, Multihop and Quizlume, on the App Store and Play Store. Target markets, in priority order: senior and lead engineering roles at German AAA studios first, Japanese AAA studios second, other regions third, and freelance contracts worldwide in parallel.

## Case studies
${caseStudies}

## Skills
- Engine and languages: Unreal Engine 5 (5.0 to 5.7) and Unreal Engine 4 (4.22 to 4.27); Blueprint at expert level; C++ in the UE context (exposing native functions to Blueprints, reading source, debugging callstacks, engine subsystems); Verse for UEFN; Flutter and Dart from early mobile work.
- Gameplay systems: multiplayer and replication (RPCs, replication policies, network prediction, server-authoritative validation, Online Subsystem Steam); AI (Behavior Trees, Environment Query System, utility state machines); Gameplay Ability System; Enhanced Input; character controllers and animation; Blueprint Interfaces and Event Dispatchers; data-driven design (DataTables, DataAssets, Soft Object References); gameplay tags; custom Blueprint nodes; editor utility widgets.
- Mobile, VR, and performance: Android (SDK 26 and above) and iOS (15 and above); OpenGL ES 3.1 and Vulkan; draw-call and overdraw reduction; instanced static mesh batching; texture streaming and LOD authoring; PSO caching and shader warmup; profiling with Unreal Insights, Stat Unit, Stat GPU, and RenderDoc; Meta Quest 2 standalone VR.
- Rendering, VFX, and AI integration: Niagara particle systems; Material Editor and custom shaders; post-process, baked and dynamic lighting, Sequencer; NVIDIA Audio2Face and Riva; Llama LLM integration in engine; Cesium for Unreal (3D Tiles); pixel streaming (Eagle 3D Streaming on AWS).
- Tools and workflow: Perforce (primary VCS), Git, Jira, Confluence, Agile and Scrum, CI/CD, Visual Studio, Rider, Figma, Blender, Adobe Substance 3D Painter, Quixel Bridge and Megascans, Photoshop, Maya, DaVinci Resolve.

## Notable shipped work
- Steam release: an anime-stylized action title showcased on the Tokyo Game Show 2024 floor, with Vmmersion LLC.
- Six live UEFN titles under fortnite.com/@exarta; the flagship, Enigmara, ran around 100 daily active users and a PKR 100,000 tournament.
- TRESemmé TRESverse for Unilever, the first beauty-industry metaverse experience in Pakistan, covered by five press publications.
- An NVIDIA-powered in-engine AI assistant: Llama 2, Riva, and Audio2Face, with end-to-end latency under 2 seconds.
- Exarta Metaverse (Valayt): concurrent player capacity scaled from 10 to 40 through replication work.
- Two mobile titles at SwiftNine, Multihop and Quizlume, live on the App Store and Play Store.

## Background
Bachelor of Computer Software Engineering, Foundation University Islamabad, 2021. Worked professionally at HashTech Systems from 2019 while completing the degree. English at C2 level; Urdu is his native language.

## Contact
- Portfolio: ${SITE}
- Contact page: ${SITE}/contact
- Email: contact@msarib.dev
- LinkedIn: https://www.linkedin.com/in/msarib/
- YouTube: https://www.youtube.com/@msarib305
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
