import { ImportSessionStatus } from '@/components/atoms/ImportSessionStatus'
import { SectionDividerLabel } from '@/components/atoms/SectionDividerLabel'
import type { ImportStatusTone } from '@/components/atoms/importStatus'
import { JsonDragDropZone } from '@/components/molecules/JsonDragDropZone'
import { JsonPastePanel } from '@/components/molecules/JsonPastePanel'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

type JsonImportDropzoneProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
  onFileSelect: (file: File | null) => void
  onImportPastedJson: (text: string) => void
}

export function JsonImportDropzone({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
  onImportPastedJson,
}: JsonImportDropzoneProps) {
  const { t } = useTranslation()
  const [pastedJson, setPastedJson] = useState('')

  const loadPastedJson = useCallback(() => {
    onImportPastedJson(pastedJson)
  }, [onImportPastedJson, pastedJson])

  return (
    <div className="json-import-dropzone-root">
      <JsonDragDropZone onJsonFile={(file) => onFileSelect(file)} />

      <p className="helper-text-xs json-import-file-hint">
        {selectedFileName
          ? t('import.selectedFile', { name: selectedFileName })
          : t('import.noFileSelectedYet')}
      </p>

      <SectionDividerLabel>{t('import.dividerPaste')}</SectionDividerLabel>

      <JsonPastePanel value={pastedJson} onChange={setPastedJson} onLoadPasted={loadPastedJson} />

      <ImportSessionStatus announce message={statusMessage} statusType={statusType} />
    </div>
  )
}
