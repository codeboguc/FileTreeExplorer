import { useWorkspace } from '@/contexts'
import { TreeWorkspaceView } from '@/features/tree-explorer/components/TreeWorkspaceView'
import { encodeRelativeTreePathForUrl, findNodeByRelativePath } from '@/lib/fileTree'
import { Navigate, useParams } from 'react-router-dom'

export function TreeNodePage() {
  const params = useParams()
  const { state, resolvedSelectedNode, setSelectedNode } = useWorkspace()

  if (!state.treeRoot) {
    return null
  }

  const paramPath = params['*']?.trim() ?? ''
  const resolvedFromUrl = paramPath.length
    ? findNodeByRelativePath(state.treeRoot, paramPath)
    : { node: state.treeRoot, fullPath: state.treeRoot.name }

  if (paramPath.length > 0 && !resolvedFromUrl) {
    return <Navigate to="/tree" replace />
  }

  if (paramPath.length > 0 && resolvedFromUrl) {
    const canonicalRel =
      resolvedFromUrl.fullPath === state.treeRoot.name
        ? ''
        : resolvedFromUrl.fullPath.slice(state.treeRoot.name.length + 1)
    if (canonicalRel !== paramPath) {
      const encoded = encodeRelativeTreePathForUrl(canonicalRel)
      return <Navigate to={encoded ? `/tree/${encoded}` : '/tree'} replace />
    }
  }

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <TreeWorkspaceView
        treeRoot={state.treeRoot}
        selectedNode={resolvedFromUrl ?? resolvedSelectedNode}
        setSelectedNode={setSelectedNode}
      />
    </div>
  )
}
