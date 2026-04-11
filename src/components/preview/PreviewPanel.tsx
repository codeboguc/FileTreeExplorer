import { Panel } from '../layout/Panel'

type PreviewPanelProps = {
  imagePath: string
}

export function PreviewPanel({ imagePath }: PreviewPanelProps) {
  return (
    <Panel
      title="Preview"
      rightSlot={<span className="text-muted text-xs">{imagePath}</span>}
    >
      <img
        src={imagePath}
        alt="Preview"
        className="h-auto w-full rounded-md border"
        style={{ borderColor: 'var(--panel-border)' }}
      />
    </Panel>
  )
}
