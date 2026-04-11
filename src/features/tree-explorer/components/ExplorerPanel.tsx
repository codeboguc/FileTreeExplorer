import { Panel } from '../../../components/organisms/Panel'
import { TreeExplorer } from './TreeExplorer'
import type { TreeNode } from '../types'

type ExplorerPanelProps = {
  tree: TreeNode | null
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
  searchQuery?: string
}

export function ExplorerPanel({
  tree,
  selectedPath,
  onSelectNode,
  searchQuery = '',
}: ExplorerPanelProps) {
  if (!tree) {
    return (
      <Panel title="Explorer" bodyClassName="p-3">
        <p className="text-sm text-muted">
          No validated tree loaded yet. Use &quot;Load sample JSON&quot; in the toolbar or import a file
          from Home.
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
      <TreeExplorer
        root={tree}
        selectedPath={selectedPath}
        onSelectNode={onSelectNode}
        searchQuery={searchQuery}
      />
    </Panel>
  )
}
