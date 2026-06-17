'use client'

// Footer entry point into the keyboard-shortcuts modal: a discoverable trigger
// for people who would never guess the "?" shortcut. Dispatches the same custom
// event the global KeyboardShortcuts listener handles.
export function KeyboardShortcutsLink() {
  return (
    <button
      type="button"
      className="footer-link-button"
      onClick={() => window.dispatchEvent(new CustomEvent('open-keyboard-shortcuts'))}
    >
      Keyboard shortcuts
    </button>
  )
}
