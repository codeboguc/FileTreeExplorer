const STORAGE_KEY = 'filetree-explorer:tree-search-query'

function migrateFromSessionStorage(): string {
  try {
    const legacy = sessionStorage.getItem(STORAGE_KEY)
    if (legacy != null && legacy !== '') {
      sessionStorage.removeItem(STORAGE_KEY)
      localStorage.setItem(STORAGE_KEY, legacy)
      return legacy
    }
  } catch {
    /* ignore */
  }
  return ''
}

export function readPersistedTreeSearchQuery(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      return stored
    }
    return migrateFromSessionStorage()
  } catch {
    return ''
  }
}

export function persistTreeSearchQuery(query: string): void {
  try {
    const trimmed = query.trim()
    if (trimmed.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
      try {
        sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* ignore */
      }
      return
    }
    localStorage.setItem(STORAGE_KEY, query)
  } catch {
    /* quota / private mode */
  }
}
