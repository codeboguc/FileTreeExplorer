import { FileJson } from 'lucide-react'

type LoadSampleToolbarButtonProps = {
  onClick: () => void
}

export function LoadSampleToolbarButton({ onClick }: LoadSampleToolbarButtonProps) {
  return (
    <button type="button" className="app-toolbar-primary-action" onClick={onClick}>
      <FileJson className="size-4 shrink-0" aria-hidden />
      Load sample JSON
    </button>
  )
}
