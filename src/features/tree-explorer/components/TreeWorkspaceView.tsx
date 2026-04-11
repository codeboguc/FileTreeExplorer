import type { SetSelectedNodeOptions } from '@/contexts/workspaceContext'
import { ExplorerPanel } from '@/features/tree-explorer/components/ExplorerPanel'
import { NodeDetailsPanel } from '@/features/tree-explorer/components/details/NodeDetailsPanel'
import { useResizableExplorerPaneWidth } from '@/features/tree-explorer/hooks/useResizableExplorerPaneWidth'
import type { TreeNode } from '@/features/tree-explorer/types'
import {
  encodeRelativeTreePathForUrl,
  findNodeByRelativePath,
  type NodeSelection,
} from '@/lib/fileTree'
import { GripVertical } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type TreeWorkspaceViewProps = {
  treeRoot: TreeNode
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null, options?: SetSelectedNodeOptions) => void
}

export function TreeWorkspaceView({
  treeRoot,
  selectedNode,
  setSelectedNode,
}: TreeWorkspaceViewProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const workspaceRef = useRef<HTMLDivElement>(null)
  const { explorerWidthPx, explorerMaxAllowedPx, separatorProps } =
    useResizableExplorerPaneWidth(workspaceRef)

  const handleSelectNode = (payload: NodeSelection) => {
    setSelectedNode(payload)
    const relativePath = payload.fullPath.split('/').slice(1).join('/')
    if (relativePath.length === 0) {
      void navigate('/tree')
      return
    }
    const encoded = encodeRelativeTreePathForUrl(relativePath)
    void navigate(encoded ? `/tree/${encoded}` : '/tree')
  }

  const handleSelectDetailsPath = (fullPath: string) => {
    const relativePath = fullPath.split('/').slice(1).join('/')
    const resolved = findNodeByRelativePath(treeRoot, relativePath)
    if (!resolved) {
      return
    }

    setSelectedNode(resolved, { collapseExplorerFoldersToSelection: true })
    if (relativePath.length === 0) {
      void navigate('/tree')
      return
    }
    const encoded = encodeRelativeTreePathForUrl(relativePath)
    void navigate(encoded ? `/tree/${encoded}` : '/tree')
  }

  return (
    <div ref={workspaceRef} className="app-tree-workspace">
      <section
        className="app-main-grid app-main-grid--split-resizable"
        style={
          {
            ['--explorer-pane-px' as string]: `${explorerWidthPx}px`,
          } as CSSProperties
        }
      >
        <ExplorerPanel
          tree={treeRoot}
          selectedPath={selectedNode?.fullPath ?? null}
          onSelectNode={handleSelectNode}
        />
        <div
          className="app-split-pane-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label={t('explorer.resizeHandle')}
          aria-valuenow={Math.round(explorerWidthPx)}
          aria-valuemin={220}
          aria-valuemax={Math.round(explorerMaxAllowedPx)}
          tabIndex={0}
          {...separatorProps}
        >
          <GripVertical
            className="app-split-pane-handle-icon"
            aria-hidden
            strokeWidth={2}
            size={16}
          />
        </div>
        <div className="app-tree-details-pane">
          <NodeDetailsPanel
            selected={selectedNode}
            onSelectPath={handleSelectDetailsPath}
          />
        </div>
      </section>
    </div>
  )
}
