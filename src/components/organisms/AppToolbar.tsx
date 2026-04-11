import type { ImportStatusTone } from '../molecules/import-status'
import { LoadSampleToolbarButton } from '../molecules/LoadSampleToolbarButton'
import { ThemeToggle, type ToolbarThemeMode } from '../molecules/ThemeToggle'
import { ToolbarFooter } from '../molecules/ToolbarFooter'
import { ToolbarSearchField } from '../molecules/ToolbarSearchField'

export type ThemeMode = ToolbarThemeMode

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
  return (
    <header className="app-toolbar">
      <div className="app-toolbar-main">
        <div className="app-toolbar-brand">
          <h1 className="app-toolbar-title">FileTree Explorer</h1>
        </div>

        <ToolbarSearchField
          enabled={showTreeSearch}
          value={searchQuery}
          onChange={onSearchChange}
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
