'use client'

import { useEffect, type RefObject } from 'react'

// Same focusable selector MobileMenu uses, extended with textarea/select for
// completeness. Mirrors the proven focus-trap pattern in MobileMenu.tsx
// (Tab/Shift+Tab wrap + focus restoration). Escape is handled separately by
// useGalleryKeyboard, not here.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface FocusTrapOptions {
  active:           boolean
  containerRef:     RefObject<HTMLElement | null>
  triggerRef?:      RefObject<HTMLElement | null>   // element to restore focus to on close
  initialFocusRef?: RefObject<HTMLElement | null>   // element to focus on open (else first focusable)
}

export function useFocusTrap({ active, containerRef, triggerRef, initialFocusRef }: FocusTrapOptions): void {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    // Capture the trigger now (it was set before this modal mounted) so the cleanup
    // does not read a ref that may have changed by unmount time.
    const restoreTarget = triggerRef?.current ?? previouslyFocused

    const visibleFocusable = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
        .filter((el) => el.offsetParent !== null || el === document.activeElement)

    // Initial focus: explicit target, else first focusable, else the container itself.
    const initial =
      initialFocusRef?.current ?? visibleFocusable()[0] ?? container
    initial.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = visibleFocusable()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      const activeEl = document.activeElement
      const outside  = !container.contains(activeEl)

      if (e.shiftKey) {
        if (activeEl === first || outside) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (activeEl === last || outside) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // Restore focus only if it is still inside the (closing) container, on body,
      // or lost. Prevents stealing focus when the user clicked something outside.
      const activeEl = document.activeElement
      const focusIsHere =
        activeEl === document.body || activeEl === null || container.contains(activeEl)
      if (focusIsHere) {
        restoreTarget?.focus?.()
      }
    }
  }, [active, containerRef, triggerRef, initialFocusRef])
}
