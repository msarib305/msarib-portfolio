export interface SkillCategoryItem {
  slug:  string
  label: string
  items: string[]
}

export const skills: SkillCategoryItem[] = [
  {
    slug:  'engines-languages',
    label: 'Engines & Languages',
    items: [
      'Unreal Engine 5 (production)',
      'Unreal Engine 4 (legacy)',
      'C++ (engine-exposed)',
      'Blueprint (architecture level)',
      'Verse (UEFN scripting)',
      'Python (tooling)',
    ],
  },
  {
    slug:  'systems-frameworks',
    label: 'Systems & Frameworks',
    items: [
      'Gameplay Ability System (GAS)',
      'Replication Graph',
      'Smart Objects & State Trees',
      'Behavior Trees & EQS',
      'Niagara FX',
      'Animation Blueprints',
    ],
  },
  {
    slug:  'platforms-tools',
    label: 'Platforms & Tools',
    items: [
      'Windows · Steam',
      'iOS & Android (GLES, Vulkan, Metal)',
      'Meta Quest (standalone VR)',
      'UEFN (Fortnite)',
      'NVIDIA Omniverse',
      'Cesium for Unreal',
    ],
  },
  {
    slug:  'practice',
    label: 'Practice',
    items: [
      'Code review and mentoring',
      'Architecture documentation',
      'Hiring rubrics & interviewing',
      'Per-device performance budgeting',
      'English (full professional)',
      'Urdu (native)',
    ],
  },
]
