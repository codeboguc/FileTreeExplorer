import { TreeExplorer, type TreeNode } from '../../features/tree-explorer'
import { Panel } from '../layout/Panel'

type ExplorerPanelProps = {
  tree: TreeNode | null
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
}

export function ExplorerPanel({ tree, selectedPath, onSelectNode }: ExplorerPanelProps) {
  if (!tree) {
    return (
      <Panel title="Explorer" bodyClassName="p-3">
        <p className="text-sm text-muted">
          No validated tree loaded yet. Use "Choose JSON file" or "Load sample".
        </p>
      </Panel>
    )
  }

  return (
    <Panel title="Explorer" bodyClassName="p-3">
      <div className="mb-3">
        <p className="text-muted text-xs uppercase tracking-wide">Current node</p>
        <p className="text-primary font-mono text-sm">{tree.name}</p>
      </div>
      <TreeExplorer root={tree} selectedPath={selectedPath} onSelectNode={onSelectNode} />
    </Panel>
  )
}
