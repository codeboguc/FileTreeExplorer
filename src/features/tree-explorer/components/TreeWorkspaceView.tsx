import { useNavigate } from 'react-router-dom'
import { findNodeByRelativePath, type NodeSelection } from '../../../lib/fileTree'
import type { TreeNode } from '../types'
import { ExplorerPanel } from './ExplorerPanel'
import { NodeDetailsPanel } from './details/NodeDetailsPanel'

type TreeWorkspaceViewProps = {
  treeRoot: TreeNode
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null) => void
  searchQuery: string
}

export function TreeWorkspaceView({
  treeRoot,
  selectedNode,
  setSelectedNode,
  searchQuery,
}: TreeWorkspaceViewProps) {
  const navigate = useNavigate()

  const handleSelectNode = (payload: NodeSelection) => {
    setSelectedNode(payload)
    const relativePath = payload.fullPath.split('/').slice(1).join('/')
    if (relativePath.length === 0) {
      void navigate('/tree')
      return
    }
    void navigate(`/tree/${encodeURIComponent(relativePath)}`)
  }

  const handleSelectDetailsPath = (fullPath: string) => {
    const relativePath = fullPath.split('/').slice(1).join('/')
    const resolved = findNodeByRelativePath(treeRoot, relativePath)
    if (!resolved) {
      return
    }

    handleSelectNode(resolved)
  }

  return (
    <div className="app-tree-workspace">
      <section className="app-main-grid app-main-grid--split">
        <ExplorerPanel
          tree={treeRoot}
          selectedPath={selectedNode?.fullPath ?? null}
          onSelectNode={handleSelectNode}
          searchQuery={searchQuery}
        />
        <NodeDetailsPanel selected={selectedNode} onSelectPath={handleSelectDetailsPath} />
      </section>
    </div>
  )
}
