import { Navigate, useParams } from 'react-router-dom'
import { TreeWorkspaceView } from '../features/tree-explorer/components/TreeWorkspaceView'
import { useWorkspace } from '../contexts'
import { findNodeByRelativePath } from '../lib/fileTree'

export function TreeNodePage() {
  const params = useParams<{ nodePath: string }>()
  const { state, resolvedSelectedNode, setSelectedNode, searchQuery } = useWorkspace()

  if (!state.treeRoot) {
    return null
  }

  const resolvedFromUrl = params.nodePath
    ? findNodeByRelativePath(state.treeRoot, params.nodePath)
    : { node: state.treeRoot, fullPath: state.treeRoot.name }

  if (params.nodePath && !resolvedFromUrl) {
    return <Navigate to="/tree" replace />
  }

  return (
    <TreeWorkspaceView
      treeRoot={state.treeRoot}
      selectedNode={resolvedFromUrl ?? resolvedSelectedNode}
      setSelectedNode={setSelectedNode}
      searchQuery={searchQuery}
    />
  )
}
