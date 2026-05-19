'use client'

import { useState, useEffect } from 'react'

type FontPref = 'right' | 'montreal'

const STORAGE_KEY = 'sarib-font-preference'

const LABELS: Record<FontPref, string> = {
  right:    'Right Grotesk',
  montreal: 'Neue Montreal',
}

export function FontToggle() {
  const [pref, setPref] = useState<FontPref>('right')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as FontPref | null
    if (stored === 'montreal') {
      document.body.dataset.font = 'montreal'
      Promise.resolve().then(() => setPref('montreal'))
    }
  }, [])

  const toggle = () => {
    const next: FontPref = pref === 'right' ? 'montreal' : 'right'
    setPref(next)
    if (next === 'montreal') {
      document.body.dataset.font = 'montreal'
    } else {
      delete document.body.dataset.font
    }
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <button
      className="font-toggle"
      onClick={toggle}
      aria-pressed={pref === 'montreal'}
      aria-label={`Switch typeface. Current: ${LABELS[pref]}`}
    >
      <span>Typeface:</span>
      <span className="ft-label">{LABELS[pref]}</span>
    </button>
  )
}
