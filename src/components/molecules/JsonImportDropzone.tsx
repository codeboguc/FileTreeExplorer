import type { ImportStatusTone } from '@/components/molecules/import-status'
import { importStatusClassName } from '@/components/molecules/importStatusClassName'
import { FileJson, Upload } from 'lucide-react'
import { useCallback, useRef, useState, type DragEvent } from 'react'

type JsonImportDropzoneProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
  onFileSelect: (file: File | null) => void
}

const isLikelyJsonFile = (file: File) => {
  const name = file.name.toLowerCase()
  return file.type === 'application/json' || name.endsWith('.json')
}

export function JsonImportDropzone({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
}: JsonImportDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const dragDepthRef = useRef(0)

  const statusClassName = importStatusClassName(statusType)

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) {
        return
      }
      if (!isLikelyJsonFile(file)) {
        return
      }
      onFileSelect(file)
    },
    [onFileSelect],
  )

  const onDragEnter = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current += 1
    setIsDragActive(true)
  }, [])

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const onDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    dragDepthRef.current -= 1
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0
      setIsDragActive(false)
    }
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
      dragDepthRef.current = 0
      setIsDragActive(false)
      const file = event.dataTransfer.files?.[0]
      handleFile(file ?? undefined)
    },
    [handleFile],
  )

  const dropZoneClass = ['json-drop-zone', isDragActive ? 'json-drop-zone--active' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="json-import-dropzone-root">
      <div
        className={dropZoneClass}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="json-drop-zone-icon size-10 shrink-0" aria-hidden />
        <p className="json-drop-zone-text">
          Drag and drop a <span className="font-medium">.json</span> file here
        </p>
        <p className="json-drop-zone-hint">
          Tree format: root object or array of nodes with name, type, and children.
        </p>
        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileJson className="size-4 shrink-0" aria-hidden />
          Browse JSON file
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0] ?? undefined)
          event.target.value = ''
        }}
      />

      <p className="helper-text-xs mt-3">
        {selectedFileName ? `Selected: ${selectedFileName}` : 'No file selected yet'}
      </p>
      <p className={`mt-1 text-sm ${statusClassName}`}>{statusMessage}</p>
    </div>
  )
}
