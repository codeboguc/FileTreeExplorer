import { ClipboardPaste } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type JsonPastePanelProps = {
  textareaId?: string
  value: string
  onChange: (value: string) => void
  onLoadPasted: () => void
}

export function JsonPastePanel({
  textareaId = 'json-paste-textarea',
  value,
  onChange,
  onLoadPasted,
}: JsonPastePanelProps) {
  const { t } = useTranslation()

  return (
    <div className="json-paste-section">
      <label htmlFor={textareaId} className="json-paste-label">
        <ClipboardPaste className="json-paste-label-icon size-4 shrink-0" aria-hidden />
        {t('import.pasteLabel')}
      </label>
      <div className="json-paste-textarea-shell">
        <textarea
          id={textareaId}
          className="json-paste-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('import.pastePlaceholder')}
          spellCheck={false}
          rows={6}
          autoComplete="off"
        />
      </div>
      <button type="button" className="btn-secondary json-paste-submit" onClick={onLoadPasted}>
        {t('import.loadPasted')}
      </button>
      <p className="json-paste-hint">{t('import.pasteHint')}</p>
    </div>
  )
}
