// Reducer for the Gallery shell. Kept in its own module (not inline in Gallery.tsx)
// so the action/state types are importable by the keyboard hook and the context
// without a circular dependency. Pure functions and types only.

export interface GalleryState {
  currentIndex:    number
  isFullscreen:    boolean
  activatedEmbeds: ReadonlySet<number>            // indexes whose live embed (YT/IG) was clicked to activate
  igScriptStatus:  'idle' | 'loading' | 'ready' | 'error'
}

export type GalleryAction =
  | { type: 'GO_TO'; index: number }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'FIRST' }
  | { type: 'LAST' }
  | { type: 'OPEN_FULLSCREEN' }
  | { type: 'CLOSE_FULLSCREEN' }
  | { type: 'ACTIVATE_EMBED'; index: number }
  | { type: 'IG_SCRIPT'; status: GalleryState['igScriptStatus'] }

export function initialGalleryState(): GalleryState {
  return {
    currentIndex:    0,
    isFullscreen:    false,
    activatedEmbeds: new Set<number>(),
    igScriptStatus:  'idle',
  }
}

function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0
  return Math.max(0, Math.min(index, count - 1))
}

// itemCount is closed over so NEXT/PREV/LAST clamp correctly (no wrap, so the
// prev/next controls disable cleanly at the ends). Recreate via useMemo when the
// count changes.
export function makeGalleryReducer(itemCount: number) {
  return function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
    switch (action.type) {
      case 'GO_TO':  return { ...state, currentIndex: clampIndex(action.index, itemCount) }
      case 'NEXT':   return { ...state, currentIndex: clampIndex(state.currentIndex + 1, itemCount) }
      case 'PREV':   return { ...state, currentIndex: clampIndex(state.currentIndex - 1, itemCount) }
      case 'FIRST':  return { ...state, currentIndex: 0 }
      case 'LAST':   return { ...state, currentIndex: clampIndex(itemCount - 1, itemCount) }
      case 'OPEN_FULLSCREEN':  return state.isFullscreen ? state : { ...state, isFullscreen: true }
      case 'CLOSE_FULLSCREEN': return state.isFullscreen ? { ...state, isFullscreen: false } : state
      case 'ACTIVATE_EMBED': {
        if (state.activatedEmbeds.has(action.index)) return state
        const next = new Set(state.activatedEmbeds)
        next.add(action.index)
        return { ...state, activatedEmbeds: next }
      }
      case 'IG_SCRIPT': return { ...state, igScriptStatus: action.status }
      default:          return state
    }
  }
}
