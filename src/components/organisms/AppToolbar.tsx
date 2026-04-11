import { FileJson, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import type { ImportStatusTone } from '../molecules/import-status'

type ThemeMode = 'light' | 'dark'

export type AppToolbarProps = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
  /** When true, a valid JSON tree is loaded — show search and wire Ctrl/⌘K. */
  showTreeSearch: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onLoadSample: () => void
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
}

export function AppToolbar({
  theme,
  onThemeChange,
  showTreeSearch,
  searchQuery,
  onSearchChange,
  onLoadSample,
  selectedFileName,
  statusMessage,
  statusType,
}: AppToolbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchShortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return '⌘K'
    }
    return /Mac|iPhone|iPad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K'
  }, [])

  const statusClassName =
    statusType === 'success'
      ? 'status-text-success'
      : statusType === 'error'
        ? 'status-text-error'
        : 'status-text-idle'

  useEffect(() => {
    if (!showTreeSearch) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showTreeSearch])

  return (
    <header className="app-toolbar">
      <div className="app-toolbar-main">
        <div className="app-toolbar-brand">
          <h1 className="app-toolbar-title">FileTree Explorer</h1>
        </div>

        {showTreeSearch ? (
          <div className="app-toolbar-search-field">
            <Search className="app-toolbar-search-icon size-4" aria-hidden />
            <label className="sr-only" htmlFor="app-tree-search">
              Search tree by name
            </label>
            <input
              ref={searchInputRef}
              id="app-tree-search"
              type="search"
              className="app-toolbar-search"
              placeholder="Search files and folders…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
            <span
              className="app-toolbar-search-kbd"
              title="Focus search (Ctrl+K or ⌘K)"
              aria-hidden
            >
              {searchShortcutLabel}
            </span>
          </div>
        ) : (
          <div className="app-toolbar-main-spacer" aria-hidden />
        )}

        <div className="app-toolbar-actions">
          <button
            type="button"
            className="app-toolbar-icon-btn"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <Sun className="size-[18px]" aria-hidden />
            ) : (
              <Moon className="size-[18px]" aria-hidden />
            )}
          </button>
          <button type="button" className="app-toolbar-primary-action" onClick={onLoadSample}>
            <FileJson className="size-4 shrink-0" aria-hidden />
            Load sample JSON
          </button>
        </div>
      </div>

      <div className="app-toolbar-sub">
        <p className="app-toolbar-sub-hint">
          Load sample JSON above, or open Home to import your own file. Status for the current
          session appears on the right.
        </p>
        <div className="app-toolbar-sub-status">
          <span className="helper-text-xs">
            {selectedFileName ? `File: ${selectedFileName}` : 'No custom JSON file loaded'}
          </span>
          <p className={`text-xs ${statusClassName}`}>{statusMessage}</p>
        </div>
      </div>
    </header>
  )
}
