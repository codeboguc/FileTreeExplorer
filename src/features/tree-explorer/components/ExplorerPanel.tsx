import { Panel } from '@/components/organisms/Panel'
import { TreeExplorer } from '@/features/tree-explorer/components/TreeExplorer'
import type { TreeNode } from '@/features/tree-explorer/types'
import { useTranslation } from 'react-i18next'

type ExplorerPanelProps = {
  tree: TreeNode | null
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
}

export function ExplorerPanel({ tree, selectedPath, onSelectNode }: ExplorerPanelProps) {
  const { t } = useTranslation()

  if (!tree) {
    return (
      <Panel
        title={t('explorer.panelTitle')}
        className="h-full min-h-0"
        fillScrollBody
        fillScrollAxes="xy"
        bodyClassName="p-3"
      >
        <p className="text-sm text-muted">{t('explorer.emptyState')}</p>
      </Panel>
    )
  }

  return (
    <Panel
      title={t('explorer.panelTitle')}
      className="h-full min-h-0"
      fillScrollBody
      fillScrollAxes="xy"
      bodyClassName="min-w-0"
    >
      <TreeExplorer root={tree} selectedPath={selectedPath} onSelectNode={onSelectNode} />
    </Panel>
  )
}
