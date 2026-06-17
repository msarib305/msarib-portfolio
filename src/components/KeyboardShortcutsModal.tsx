'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/components/Gallery/hooks/useFocusTrap'

interface KeyboardShortcutsModalProps {
  onClose: () => void
}

const NAV_SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['g', 'h'], label: 'Home' },
  { keys: ['g', 'w'], label: 'Work' },
  { keys: ['g', 'a'], label: 'About' },
  { keys: ['g', 'r'], label: 'Writings' },
  { keys: ['g', 'c'], label: 'Contact' },
]

const HELP_SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['?'], label: 'Open this dialog' },
  { keys: ['Esc'], label: 'Close dialog' },
]

export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // useFocusTrap handles initial focus, Tab wrapping, and focus restoration on
  // close (Escape is handled by the parent KeyboardShortcuts window listener).
  useFocusTrap({ active: true, containerRef })

  // Lock body scroll while open (mirrors GalleryFullscreen).
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  if (typeof document === 'undefined') return null

  const Row = ({ keys, label }: { keys: string[]; label: string }) => (
    <div className="kbd-row">
      <dt>{keys.map(k => <kbd key={k}>{k}</kbd>)}</dt>
      <dd>{label}</dd>
    </div>
  )

  return createPortal(
    <div
      className="keyboard-shortcuts-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="keyboard-shortcuts-modal" ref={containerRef}>
        <h2 id="shortcuts-modal-title">Keyboard shortcuts</h2>

        <h3>Navigation</h3>
        <dl>{NAV_SHORTCUTS.map(s => <Row key={s.label} {...s} />)}</dl>

        <h3>Help</h3>
        <dl>{HELP_SHORTCUTS.map(s => <Row key={s.label} {...s} />)}</dl>

        <button
          type="button"
          className="keyboard-shortcuts-modal-close"
          onClick={onClose}
          aria-label="Close keyboard shortcuts"
        >
          Close
        </button>
        <p className="keyboard-shortcuts-modal-footer">
          Press <kbd>Esc</kbd> to close
        </p>
      </div>
    </div>,
    document.body,
  )
}
