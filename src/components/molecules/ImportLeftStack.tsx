import { HiddenJsonFileInput } from '@/components/atoms/HiddenJsonFileInput'
import { ImportSessionStatus } from '@/components/atoms/ImportSessionStatus'
import type { ImportStatusTone } from '@/components/atoms/importStatus'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

type ImportLeftStackProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
  onFileSelect: (file: File | null) => void
  className?: string
}

export function ImportLeftStack({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
  className,
}: ImportLeftStackProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const rootClass = ['flex min-w-0 flex-col gap-1', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('import.chooseFile')}
        </button>
        <span className="helper-text-xs">
          {selectedFileName ?? t('import.noFileSelected')}
        </span>
      </div>

      <HiddenJsonFileInput ref={fileInputRef} onFileChange={onFileSelect} />

      <ImportSessionStatus message={statusMessage} statusType={statusType} />
    </div>
  )
}

type FileImportHeaderControlsProps = ImportLeftStackProps & {
  onLoadSample: () => void
}

export function FileImportHeaderControls({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
  onLoadSample,
}: FileImportHeaderControlsProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex min-w-[360px] max-w-[520px] flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          {t('import.chooseFile')}
        </button>
        <button type="button" className="btn-primary" onClick={onLoadSample}>
          {t('import.loadSampleShort')}
        </button>
        <span className="helper-text-xs">
          {selectedFileName ?? t('import.noFileSelected')}
        </span>
      </div>

      <HiddenJsonFileInput ref={fileInputRef} onFileChange={onFileSelect} />

      <ImportSessionStatus
        message={statusMessage}
        statusType={statusType}
        className="text-right"
      />
    </div>
  )
}
