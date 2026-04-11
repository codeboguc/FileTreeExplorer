import { ImportSessionStatus } from '@/components/atoms/ImportSessionStatus'
import type { ImportStatusTone } from '@/components/atoms/importStatus'
import { Trans, useTranslation } from 'react-i18next'

type ToolbarFooterProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
  suppressSessionStatus?: boolean
}

export function ToolbarFooter({
  selectedFileName,
  statusMessage,
  statusType,
  suppressSessionStatus = false,
}: ToolbarFooterProps) {
  const { t } = useTranslation()

  return (
    <div
      className={
        suppressSessionStatus
          ? 'app-toolbar-sub app-toolbar-sub--import-on-home'
          : 'app-toolbar-sub'
      }
    >
      <p className="app-toolbar-sub-hint">
        {suppressSessionStatus ? (
          <Trans
            i18nKey="toolbar.footerHintHome"
            components={{
              1: <strong className="font-medium text-primary" />,
            }}
          />
        ) : (
          t('toolbar.footerHintDefault')
        )}
      </p>
      {!suppressSessionStatus ? (
        <div className="app-toolbar-sub-status">
          <span className="helper-text-xs">
            {selectedFileName
              ? t('toolbar.filePrefix', { name: selectedFileName })
              : t('toolbar.noCustomFileLoaded')}
          </span>
          <ImportSessionStatus
            message={statusMessage}
            statusType={statusType}
            className="text-right"
          />
        </div>
      ) : null}
    </div>
  )
}
