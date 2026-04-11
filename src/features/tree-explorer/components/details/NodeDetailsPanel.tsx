import { DetailsMetaGrid } from '@/components/molecules/DetailsMetaGrid'
import { DetailsPanelHeaderPath } from '@/components/molecules/DetailsPanelHeaderPath'
import { DetailsPathLinks } from '@/components/molecules/DetailsPathLinks'
import { Panel } from '@/components/organisms/Panel'
import { FolderChildrenList } from '@/features/tree-explorer/components/details/FolderChildrenList'
import type { TreeNode } from '@/features/tree-explorer/types'
import type { ReactNode } from 'react'
import { formatBytes } from '@/lib'
import { formatNodePathForDisplay, TreeNodeType } from '@/lib/fileTree'

type SelectionPayload = {
  node: TreeNode
  fullPath: string
}

type NodeDetailsPanelProps = {
  selected: SelectionPayload | null
  onSelectPath?: (path: string) => void
}

const getSubtreeFileSize = (node: TreeNode): number => {
  if (node.type === TreeNodeType.File) {
    return node.size
  }
  return node.children.reduce((sum, child) => sum + getSubtreeFileSize(child), 0)
}

function DetailsPanelInner({ children }: { children: ReactNode }) {
  return <div className="details-panel-inner">{children}</div>
}

export function NodeDetailsPanel({ selected, onSelectPath }: NodeDetailsPanelProps) {
  if (!selected) {
    return (
      <Panel title="Details" className="h-full min-h-0" fillScrollBody>
        <DetailsPanelInner>
          <p className="text-muted text-sm">
            Select a node in Explorer to see file or folder details.
          </p>
        </DetailsPanelInner>
      </Panel>
    )
  }

  const { node, fullPath } = selected
  const pathForDisplay = formatNodePathForDisplay(fullPath)

  if (node.type === TreeNodeType.File) {
    return (
      <Panel
        title="File Details"
        className="h-full min-h-0"
        fillScrollBody
        rightSlot={<DetailsPanelHeaderPath pathForDisplay={pathForDisplay} />}
      >
        <DetailsPanelInner>
          <DetailsMetaGrid
            items={[
              { label: 'Name', value: node.name },
              { label: 'Size', value: formatBytes(node.size) },
              {
                label: 'Full path',
                value: <DetailsPathLinks fullPath={fullPath} onSelectPath={onSelectPath} />,
              },
            ]}
          />
        </DetailsPanelInner>
      </Panel>
    )
  }

  const totalSubtreeSize = getSubtreeFileSize(node)

  return (
    <Panel
      title="Folder Details"
      className="h-full min-h-0"
      fillScrollBody
      rightSlot={<DetailsPanelHeaderPath pathForDisplay={pathForDisplay} />}
    >
      <DetailsPanelInner>
        <DetailsMetaGrid
          className="mb-4"
          items={[
            { label: 'Name', value: node.name },
            { label: 'Direct children', value: node.children.length },
            { label: 'Subtree size', value: formatBytes(totalSubtreeSize) },
            {
              label: 'Full path',
              value: <DetailsPathLinks fullPath={fullPath} onSelectPath={onSelectPath} />,
            },
          ]}
        />

        <div className="text-left">
          <p className="details-section-label">Children</p>
          <FolderChildrenList
            childrenNodes={node.children}
            fullPath={fullPath}
            onSelectPath={onSelectPath}
          />
        </div>
      </DetailsPanelInner>
    </Panel>
  )
}
