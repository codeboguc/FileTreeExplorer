import { DetailsMetaGrid } from '@/components/molecules/DetailsMetaGrid'
import { DetailsPanelHeaderPath } from '@/components/molecules/DetailsPanelHeaderPath'
import { DetailsPathLinks } from '@/components/molecules/DetailsPathLinks'
import { Panel } from '@/components/organisms/Panel'
import { FolderChildrenList } from '@/features/tree-explorer/components/details/FolderChildrenList'
import type { TreeNode } from '@/features/tree-explorer/types'
import type { ReactNode } from 'react'
import { formatBytes } from '@/lib'
import { formatNodePathForDisplay, TreeNodeType } from '@/lib/fileTree'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  if (!selected) {
    return (
      <Panel title={t('details.panelEmpty')} className="h-full min-h-0" fillScrollBody>
        <DetailsPanelInner>
          <p className="text-muted text-sm">{t('details.selectPrompt')}</p>
        </DetailsPanelInner>
      </Panel>
    )
  }

  const { node, fullPath } = selected
  const pathForDisplay = formatNodePathForDisplay(fullPath)

  if (node.type === TreeNodeType.File) {
    return (
      <Panel
        title={t('details.panelFile')}
        className="h-full min-h-0"
        fillScrollBody
        rightSlot={<DetailsPanelHeaderPath pathForDisplay={pathForDisplay} />}
      >
        <DetailsPanelInner>
          <DetailsMetaGrid
            items={[
              { label: t('details.name'), value: node.name },
              { label: t('details.size'), value: formatBytes(node.size) },
              {
                label: t('details.fullPath'),
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
      title={t('details.panelFolder')}
      className="h-full min-h-0"
      fillScrollBody
      rightSlot={<DetailsPanelHeaderPath pathForDisplay={pathForDisplay} />}
    >
      <DetailsPanelInner>
        <DetailsMetaGrid
          className="mb-4"
          items={[
            { label: t('details.name'), value: node.name },
            { label: t('details.directChildren'), value: node.children.length },
            { label: t('details.subtreeSize'), value: formatBytes(totalSubtreeSize) },
            {
              label: t('details.fullPath'),
              value: <DetailsPathLinks fullPath={fullPath} onSelectPath={onSelectPath} />,
            },
          ]}
        />

        <div className="text-left">
          <p className="details-section-label">{t('details.childrenHeading')}</p>
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
