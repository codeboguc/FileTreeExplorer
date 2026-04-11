const STORAGE_KEY = 'filetree-explorer:imported-tree'
const VERSION = 1 as const

export type PersistedImportedTree = {
  v: typeof VERSION
  sourceName: string
  /** Original JSON text from the last successful import (re-validated on load). */
  rawText: string
}

export function readPersistedImportedTree(): PersistedImportedTree | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null || raw === '') {
      return null
    }
    const parsed = JSON.parse(raw) as unknown
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('v' in parsed) ||
      !('sourceName' in parsed) ||
      !('rawText' in parsed)
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const rec = parsed as Record<string, unknown>
    if (
      rec.v !== VERSION ||
      typeof rec.sourceName !== 'string' ||
      typeof rec.rawText !== 'string'
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return {
      v: VERSION,
      sourceName: rec.sourceName,
      rawText: rec.rawText,
    }
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    return null
  }
}

export function persistImportedTree(sourceName: string, rawText: string): void {
  try {
    const payload: PersistedImportedTree = {
      v: VERSION,
      sourceName,
      rawText,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* quota / private mode */
  }
}

export function clearPersistedImportedTree(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
