import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

type AppHeaderProps = {
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
  rightSlot?: ReactNode
}

export function AppHeader({ theme, onThemeChange, rightSlot }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1
          className="text-left text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          FileTree Explorer
        </h1>
        <p className="helper-text-xs mt-1">
          Import JSON and inspect file/folder details.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="helper-text-xs">Palette:</span>
          <button
            type="button"
            className={theme === 'light' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onThemeChange('light')}
          >
            Light
          </button>
          <button
            type="button"
            className={theme === 'dark' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onThemeChange('dark')}
          >
            Dark
          </button>
        </div>
      </div>
      {rightSlot}
    </header>
  )
}
