/*
 * TODO: copy for each card is locked per MASTER_CONTEXT.
 * Update only via a content-only commit when Sarib approves edits.
 */
export interface WhatIBringItem {
  slug:     string
  tone:     'grad-1' | 'grad-2' | 'grad-3'
  label:    string
  headline: string
  body:     string
  details:  string[]
}

export const whatIBring: WhatIBringItem[] = [
  {
    slug:     'technical-depth',
    tone:     'grad-1',
    label:    'Technical depth',
    headline: 'Seven years in engine, across UE4 and UE5.',
    body:     'C++ exposed to Blueprint, GAS, replication graph, behavior trees, Niagara, Lumen, Nanite. Mobile performance discipline trained from indie. I read the codebase before I touch it.',
    details:  [
      'C++ and Blueprint code architecture',
      'Server-authoritative netcode',
      'GLES / Vulkan / Metal draw budgets',
    ],
  },
  {
    slug:     'engineering-leadership',
    tone:     'grad-2',
    label:    'Engineering leadership',
    headline: 'Standards that survive my exit.',
    body:     'Currently leading engineering at SwiftNine. I write the coding standards, set the hiring rubrics, run the code reviews, and document the architecture so the next developer is not stuck in tribal knowledge.',
    details:  [
      'Blueprint code review and mentoring',
      'Per-device performance budgets',
      'Hiring rubrics and onboarding',
    ],
  },
  {
    slug:     'shipped-products',
    tone:     'grad-3',
    label:    'Shipped products',
    headline: 'Real titles, real scope, real polish.',
    body:     'Ten titles across five studios. A Steam release. A Tokyo Game Show 2024 anime title where I owned the gameplay layer. Six UEFN titles. NVIDIA Omniverse integrations. Production, not demos.',
    details:  [
      'Steam release · TGS 2024 floor',
      'Six UEFN titles with Verse',
      'NVIDIA Omniverse · Cesium integrations',
    ],
  },
]
