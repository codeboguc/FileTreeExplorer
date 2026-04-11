import type { ImportStatusTone } from '@/components/molecules/import-status'
import { importStatusClassName } from '@/components/molecules/importStatusClassName'

type ToolbarFooterProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusTone
}

export function ToolbarFooter({
  selectedFileName,
  statusMessage,
  statusType,
}: ToolbarFooterProps) {
  const statusClassName = importStatusClassName(statusType)

  return (
    <div className="app-toolbar-sub">
      <p className="app-toolbar-sub-hint">
        Load sample JSON above, or open Home to import your own file. Status for the
        current session appears on the right.
      </p>
      <div className="app-toolbar-sub-status">
        <span className="helper-text-xs">
          {selectedFileName ? `File: ${selectedFileName}` : 'No custom JSON file loaded'}
        </span>
        <p className={`text-xs ${statusClassName}`}>{statusMessage}</p>
      </div>
    </div>
  )
}
