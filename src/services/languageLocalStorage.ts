const STORAGE_KEY = 'filetree-explorer:language'

export const SUPPORTED_LANGUAGES = ['en', 'pl'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export function isAppLanguage(value: string): value is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}

export function readPersistedLanguage(): AppLanguage | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null && isAppLanguage(stored)) {
      return stored
    }
  } catch {
    /* ignore */
  }
  return null
}

export function persistLanguage(lng: string): void {
  if (!isAppLanguage(lng)) {
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
}
