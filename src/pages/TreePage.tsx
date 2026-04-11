import { TreeWorkspaceView } from '../features/tree-explorer/components/TreeWorkspaceView'
import { useWorkspace } from '../contexts'

export function TreePage() {
  const { state, resolvedSelectedNode, setSelectedNode, searchQuery } = useWorkspace()

  if (!state.treeRoot) {
    return null
  }

  return (
    <TreeWorkspaceView
      treeRoot={state.treeRoot}
      selectedNode={resolvedSelectedNode}
      setSelectedNode={setSelectedNode}
      searchQuery={searchQuery}
    />
  )
}
