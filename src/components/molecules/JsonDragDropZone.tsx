import { HiddenJsonFileInput } from '@/components/atoms/HiddenJsonFileInput'
import { FileJson, Upload } from 'lucide-react'
import { useCallback, useRef, useState, type DragEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const isLikelyJsonFile = (file: File) => {
  const name = file.name.toLowerCase()
  return file.type === 'application/json' || name.endsWith('.json')
}

type JsonDragDropZoneProps = {
  onJsonFile: (file: File) => void
}

export function JsonDragDropZone({ onJsonFile }: JsonDragDropZoneProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const dragDepthRef = useRef(0)

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file || !isLikelyJsonFile(file)) {
        return
      }
      onJsonFile(file)
    },
    [onJsonFile],
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
    <>
      <div
        className={dropZoneClass}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <Upload className="json-drop-zone-icon size-10 shrink-0" aria-hidden />
        <p className="json-drop-zone-text">
          <Trans
            i18nKey="import.dropTitle"
            components={{ 1: <span className="font-medium" /> }}
          />
        </p>
        <p className="json-drop-zone-hint">{t('import.dropHint')}</p>
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileJson className="size-4 shrink-0" aria-hidden />
          {t('import.browseFile')}
        </button>
      </div>

      <HiddenJsonFileInput
        ref={fileInputRef}
        onFileChange={(file) => handleFile(file ?? undefined)}
        clearValueAfterPick
      />
    </>
  )
}
