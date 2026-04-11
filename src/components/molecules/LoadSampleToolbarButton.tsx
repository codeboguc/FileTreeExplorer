import { FileJson } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type LoadSampleToolbarButtonProps = {
  onClick: () => void
}

export function LoadSampleToolbarButton({ onClick }: LoadSampleToolbarButtonProps) {
  const { t } = useTranslation()

  return (
    <button type="button" className="app-toolbar-primary-action" onClick={onClick}>
      <FileJson className="size-4 shrink-0" aria-hidden />
      {t('toolbar.loadSample')}
    </button>
  )
}
