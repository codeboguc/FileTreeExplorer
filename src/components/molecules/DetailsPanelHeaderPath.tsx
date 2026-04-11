import { IconButton } from '@/components/atoms/IconButton'
import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

type DetailsPanelHeaderPathProps = {
  /** Display path (e.g. for toolbar search / browser); copied to clipboard. */
  pathForDisplay: string
}

export function DetailsPanelHeaderPath({ pathForDisplay }: DetailsPanelHeaderPathProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pathForDisplay)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      /* Clipboard unavailable (permissions / non-secure context). */
    }
  }, [pathForDisplay])

  return (
    <div className="details-panel-header-path">
      <span className="details-panel-header-path__text text-xs" title={pathForDisplay}>
        {pathForDisplay}
      </span>
      <IconButton
        type="button"
        className="details-panel-header-path__copy"
        onClick={() => {
          void handleCopy()
        }}
        aria-label={
          copied
            ? t('details.copyPathCopiedAria')
            : t('details.copyPathAria', { path: pathForDisplay })
        }
        title={copied ? t('details.copiedTitle') : t('details.copyPathTitle')}
      >
        {copied ? (
          <Check className="size-4" aria-hidden strokeWidth={2.25} />
        ) : (
          <Copy className="size-4" aria-hidden strokeWidth={2} />
        )}
      </IconButton>
    </div>
  )
}
