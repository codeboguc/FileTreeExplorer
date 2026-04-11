import { Panel } from '@/components/organisms/Panel'
import { TreeExplorer } from '@/features/tree-explorer/components/TreeExplorer'
import type { TreeNode } from '@/features/tree-explorer/types'

type ExplorerPanelProps = {
  tree: TreeNode | null
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
}

export function ExplorerPanel({ tree, selectedPath, onSelectNode }: ExplorerPanelProps) {
  if (!tree) {
    return (
      <Panel
        title="Explorer"
        className="h-full min-h-0"
        fillScrollBody
        fillScrollAxes="xy"
        bodyClassName="p-3"
      >
        <p className="text-sm text-muted">
          No validated tree loaded yet. Use &quot;Load sample JSON&quot; in the toolbar or
          import a file from Home.
        </p>
      </Panel>
    )
  }

  return (
    <Panel
      title="Explorer"
      className="h-full min-h-0"
      fillScrollBody
      fillScrollAxes="xy"
      bodyClassName="min-w-0"
    >
      <TreeExplorer root={tree} selectedPath={selectedPath} onSelectNode={onSelectNode} />
    </Panel>
  )
}
