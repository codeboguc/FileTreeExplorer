import { IconButton } from '@/components/atoms/IconButton'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type ToolbarThemeMode = 'light' | 'dark'

type ThemeToggleProps = {
  theme: ToolbarThemeMode
  onThemeChange: (theme: ToolbarThemeMode) => void
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const { t } = useTranslation()

  return (
    <IconButton
      className="app-toolbar-icon-btn"
      onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
      aria-label={
        theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')
      }
    >
      {theme === 'dark' ? (
        <Sun className="size-[18px]" aria-hidden />
      ) : (
        <Moon className="size-[18px]" aria-hidden />
      )}
    </IconButton>
  )
}
