import { Moon, Sun } from 'lucide-react'
import { IconButton } from '../atoms/IconButton'

export type ToolbarThemeMode = 'light' | 'dark'

type ThemeToggleProps = {
  theme: ToolbarThemeMode
  onThemeChange: (theme: ToolbarThemeMode) => void
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <IconButton
      className="app-toolbar-icon-btn"
      onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? (
        <Sun className="size-[18px]" aria-hidden />
      ) : (
        <Moon className="size-[18px]" aria-hidden />
      )}
    </IconButton>
  )
}
