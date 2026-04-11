/** Persists the draggable explorer column width; details width is the remaining track. */
const STORAGE_KEY = 'filetree-explorer-pane-width-px'

function migrateFromSessionStorage(): number | null {
  if (typeof sessionStorage === 'undefined') {
    return null
  }
  try {
    const legacy = sessionStorage.getItem(STORAGE_KEY)
    if (legacy === null) {
      return null
    }
    sessionStorage.removeItem(STORAGE_KEY)
    const n = Number.parseInt(legacy, 10)
    if (!Number.isFinite(n)) {
      return null
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(Math.round(n)))
    } catch {
      /* ignore */
    }
    return n
  } catch {
    return null
  }
}

export function readExplorerPaneWidthPx(): number | null {
  if (typeof localStorage === 'undefined') {
    return null
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const n = Number.parseInt(raw, 10)
      return Number.isFinite(n) ? n : null
    }
    return migrateFromSessionStorage()
  } catch {
    return migrateFromSessionStorage()
  }
}

export function writeExplorerPaneWidthPx(px: number): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.round(px)))
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  } catch {
    /* quota / private mode */
  }
}
