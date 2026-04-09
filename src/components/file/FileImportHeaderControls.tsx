import { useRef } from 'react'
import type { ImportStatusType } from '../../features/file-import'

type FileImportHeaderControlsProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusType
  onFileSelect: (file: File | null) => void
  onLoadSample: () => void
}

export function FileImportHeaderControls({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
  onLoadSample,
}: FileImportHeaderControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const statusClassName =
    statusType === 'success'
      ? 'status-text-success'
      : statusType === 'error'
        ? 'status-text-error'
        : 'status-text-idle'

  return (
    <div className="flex min-w-[360px] max-w-[520px] flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose JSON file
        </button>
        <button type="button" className="btn-primary" onClick={onLoadSample}>
          Load sample
        </button>
        <span className="helper-text-xs">{selectedFileName ?? 'No file selected'}</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
      />

      <p className={`text-right text-xs ${statusClassName}`}>{statusMessage}</p>
    </div>
  )
}
