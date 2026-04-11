import type { ImportStatusTone } from '@/components/molecules/import-status'
import { LoadSampleToolbarButton } from '@/components/molecules/LoadSampleToolbarButton'
import { ThemeToggle, type ToolbarThemeMode } from '@/components/molecules/ThemeToggle'
import { ToolbarFooter } from '@/components/molecules/ToolbarFooter'
import type { ToolbarSearchHit } from '@/components/molecules/ToolbarTreeSearch'
import { ToolbarTreeSearch } from '@/components/molecules/ToolbarTreeSearch'
import { Link } from 'react-router-dom'

export type ThemeMode = ToolbarThemeMode

export type AppToolbarProps = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
  /** When true, a valid JSON tree is loaded — show search and wire Ctrl+Alt+F (⌃⌥F on Mac). */
  showTreeSearch: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  searchHits: ToolbarSearchHit[]
  onSelectSearchHit: (fullPath: string) => void
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
  searchHits,
  onSelectSearchHit,
  onLoadSample,
  selectedFileName,
  statusMessage,
  statusType,
}: AppToolbarProps) {
  return (
    <header className="app-toolbar">
      <div className="app-toolbar-main">
        <div className="app-toolbar-brand">
          <h1 className="m-0">
            <Link to="/" className="app-toolbar-title app-toolbar-title-link">
              FileTree Explorer
            </Link>
          </h1>
        </div>

        <ToolbarTreeSearch
          enabled={showTreeSearch}
          value={searchQuery}
          onChange={onSearchChange}
          results={searchHits}
          onSelectHit={onSelectSearchHit}
        />
        {!showTreeSearch ? <div className="app-toolbar-main-spacer" aria-hidden /> : null}

        <div className="app-toolbar-actions">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <LoadSampleToolbarButton onClick={onLoadSample} />
        </div>
      </div>

      <ToolbarFooter
        selectedFileName={selectedFileName}
        statusMessage={statusMessage}
        statusType={statusType}
      />
    </header>
  )
}
