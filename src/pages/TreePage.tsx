import { useWorkspace } from '@/contexts'
import { TreeWorkspaceView } from '@/features/tree-explorer/components/TreeWorkspaceView'

export function TreePage() {
  const { state, resolvedSelectedNode, setSelectedNode } = useWorkspace()

  if (!state.treeRoot) {
    return null
  }

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <TreeWorkspaceView
        treeRoot={state.treeRoot}
        selectedNode={resolvedSelectedNode}
        setSelectedNode={setSelectedNode}
      />
    </div>
  )
}
