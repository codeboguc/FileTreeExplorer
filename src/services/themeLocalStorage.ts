import type { ThemeMode } from '@/contexts/workspaceContext'

/** Keep in sync with the inline script in `index.html` (FOUC avoidance). */
export const THEME_STORAGE_KEY = 'filetree-explorer:theme'

export function readPersistedThemeMode(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') {
      return raw
    }
  } catch {
    /* private mode / disabled */
  }
  return 'light'
}

export function persistThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    /* quota / private mode */
  }
}
