import type { TreeNode } from '../../features/tree-explorer'
import { TreeNodeType } from '../../lib/fileTree'
import { Panel } from '../layout/Panel'
import { DetailsMetaGrid } from './DetailsMetaGrid'
import { FolderChildrenList } from './FolderChildrenList'

type SelectionPayload = {
  node: TreeNode
  fullPath: string
}

type NodeDetailsPanelProps = {
  selected: SelectionPayload | null
  onSelectPath?: (path: string) => void
}

const formatBytes = (size: number) => {
  if (size < 1024) {
    return `${size} B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

const getSubtreeFileSize = (node: TreeNode): number => {
  if (node.type === TreeNodeType.File) {
    return node.size
  }
  return node.children.reduce((sum, child) => sum + getSubtreeFileSize(child), 0)
}

export function NodeDetailsPanel({ selected, onSelectPath }: NodeDetailsPanelProps) {
  if (!selected) {
    return (
      <Panel title="Details">
        <p className="text-muted text-sm">
          Select a node in Explorer to see file or folder details.
        </p>
      </Panel>
    )
  }

  const { node, fullPath } = selected

  if (node.type === TreeNodeType.File) {
    return (
      <Panel
        title="File Details"
        rightSlot={<span className="text-muted text-xs">{fullPath}</span>}
      >
        <DetailsMetaGrid
          items={[
            { label: 'Name', value: node.name },
            { label: 'Size', value: formatBytes(node.size) },
            { label: 'Full path', value: <span className="font-mono">{fullPath}</span> },
          ]}
        />
      </Panel>
    )
  }

  const totalSubtreeSize = getSubtreeFileSize(node)

  return (
    <Panel
      title="Folder Details"
      rightSlot={<span className="text-muted text-xs">{fullPath}</span>}
    >
      <DetailsMetaGrid
        className="mb-4"
        items={[
          { label: 'Name', value: node.name },
          { label: 'Direct children', value: node.children.length },
          { label: 'Subtree size', value: formatBytes(totalSubtreeSize) },
          { label: 'Full path', value: <span className="font-mono">{fullPath}</span> },
        ]}
      />

      <div>
        <p className="details-section-label">Children</p>
        <FolderChildrenList
          childrenNodes={node.children}
          fullPath={fullPath}
          onSelectPath={onSelectPath}
        />
      </div>
    </Panel>
  )
}
