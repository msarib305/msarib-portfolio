export interface ExperienceItem {
  slug:     string
  years:    string
  role:     string
  company:  string
  location: string
  summary:  string
  bullets:  string[]
  tags:     string[]
  current:  boolean
}

export const experience: ExperienceItem[] = [
  {
    slug:     'swiftnine',
    years:    '07/2025 to Present',
    role:     'Lead Unreal Engine Developer',
    company:  'SwiftNine LLC',
    location: 'Clutched Studios · Lahore, PK (On-site)',
    summary:  'Leading engineering on a mobile UE5 portfolio.',
    bullets: [
      'Blueprint coding standards and code review process',
      'Per-device draw call budgets (GLES 3.1, Vulkan, Metal)',
      'Hiring rubrics and onboarding for new engineers',
      'C++ infrastructure exposed to the Blueprint layer',
    ],
    tags:    ['UE5', 'Mobile', 'C++', 'Blueprint', 'Leadership'],
    current: true,
  },
  {
    slug:     'vmmersion',
    years:    '04/2024 to 04/2025',
    role:     'Lead Software Developer',
    company:  'Vmmersion LLC',
    location: 'Richmond, KY, US (Remote)',
    summary:  'Gameplay systems for an anime-stylized action title showcased at Tokyo Game Show 2024 and released on Steam.',
    bullets: [
      'Locked 60 FPS on mid-range hardware (i7-14700K, RTX 3060 8 GB) for the TGS 2024 demo',
      'Cut frame-time hitches by 98% and load times by 40%',
      'Wrapped third-party C++ SDKs as typed Blueprint nodes',
      'Migrated project to Soft Object References and Data Assets',
    ],
    tags:    ['UE5', 'C++', 'Blueprint', 'PC', 'Steam'],
    current: false,
  },
  {
    slug:     'exarta-senior',
    years:    '11/2022 to 03/2024',
    role:     'Senior Unreal Engine Developer',
    company:  'Exarta',
    location: 'Lahore, PK (On-site)',
    summary:  'Led seven direct reports across UE engineering and 3D art. Scaled the Exarta Metaverse from 10 to 40 concurrent players.',
    bullets: [
      'Custom ReplicationGraph reducing per-client bandwidth by 38%',
      'Real-time AI assistant character with NVIDIA Audio2Face and self-hosted Llama LLM',
      'TRESemmé Metaverse for Unilever, covered by IGN Pakistan and BeautyMatter',
      'Six concurrent UEFN titles including Enigmara (~100 daily active users)',
    ],
    tags:    ['UE5', 'Multiplayer', 'GAS', 'UEFN', 'Leadership'],
    current: false,
  },
  {
    slug:     'ideofuzion',
    years:    '06/2022 to 10/2022',
    role:     'Unreal Engine Developer',
    company:  'Ideofuzion',
    location: 'Rawalpindi, PK (On-site, fixed-scope contract)',
    summary:  'Mobile VR specialist on a Meta Quest 2 standalone corporate application (NDA).',
    bullets: [
      'Held budget under 1M triangles, 150 draw calls per eye, 200 shader instructions per material',
      '72Hz locked with dynamic 120Hz mode for UI; built spatial interaction Blueprints from scratch',
    ],
    tags:    ['UE4', 'VR', 'Quest 2', 'Blueprint', 'Mobile VR'],
    current: false,
  },
  {
    slug:     'exarta-first',
    years:    '12/2021 to 05/2022',
    role:     'Unreal Engine Developer',
    company:  'Exarta',
    location: 'Lahore, PK (On-site)',
    summary:  'Built the multiplayer replication foundations and Solana blockchain integration for the Exarta Metaverse.',
    bullets: [
      'Replicated variables, multicast RPCs, and session management for the metaverse prototype',
      'Solana REST API wrapped as async Blueprint nodes for designer-accessible blockchain interactions',
    ],
    tags:    ['UE4', 'UE5', 'Multiplayer', 'Solana', 'Blueprint'],
    current: false,
  },
  {
    slug:     'hashtech',
    years:    '06/2019 to 07/2021',
    role:     'Mobile Application Developer',
    company:  'HashTech Systems Inc.',
    location: 'Islamabad, PK (On-site)',
    summary:  'Parallel tracks: Flutter cross-platform apps for App Store and Play Store, and UE4 indie games for Android.',
    bullets: [
      'Flutter / Dart production apps with full certification cycles on both stores',
      'UE4 indie games end-to-end: Blueprints, packaging, APK signing, Play Store submission',
    ],
    tags:    ['UE4', 'Blueprint', 'Flutter', 'Mobile', 'Android'],
    current: false,
  },
]
