'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'

const SEQUENCE_TIMEOUT = 1500

// g-prefix navigation sequences. "g r" -> writings (r for reading).
const SEQUENCES: Record<string, string> = {
  'g h': '/',
  'g w': '/work',
  'g a': '/about',
  'g r': '/writings',
  'g c': '/contact',
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function KeyboardShortcuts() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const sequenceRef = useRef('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reset = () => {
      sequenceRef.current = ''
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      // Never hijack typing or browser/OS shortcuts.
      if (isEditableTarget(e.target)) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'Escape') {
        setOpen(prev => {
          if (prev) return false
          return prev
        })
        reset()
        return
      }

      // While the modal is open, only Escape is active (above); ignore sequences.
      if (open) return

      if (e.key === '?') {
        e.preventDefault()
        setOpen(true)
        reset()
        return
      }

      const next = sequenceRef.current
        ? `${sequenceRef.current} ${e.key.toLowerCase()}`
        : e.key.toLowerCase()
      sequenceRef.current = next

      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(reset, SEQUENCE_TIMEOUT)

      const dest = SEQUENCES[next]
      if (dest) {
        e.preventDefault()
        reset()
        router.push(dest)
      }
    }

    const onOpenEvent = () => setOpen(true)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('open-keyboard-shortcuts', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('open-keyboard-shortcuts', onOpenEvent)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [router, open])

  if (!open) return null
  return <KeyboardShortcutsModal onClose={() => setOpen(false)} />
}
