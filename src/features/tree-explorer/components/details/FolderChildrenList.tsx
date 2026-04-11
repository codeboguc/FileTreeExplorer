import { NodeIcon } from '@/features/tree-explorer/components/NodeIcon'
import type { TreeNode } from '@/features/tree-explorer/types'
import { formatBytes } from '@/lib'
import { sortTreeChildrenForDisplay, TreeNodeType } from '@/lib/fileTree'
import { useMemo } from 'react'

type FolderChildrenListProps = {
  childrenNodes: TreeNode[]
  fullPath: string
  onSelectPath?: (path: string) => void
}

export function FolderChildrenList({
  childrenNodes,
  fullPath,
  onSelectPath,
}: FolderChildrenListProps) {
  const sortedChildren = useMemo(
    () => sortTreeChildrenForDisplay(childrenNodes),
    [childrenNodes],
  )

  if (sortedChildren.length === 0) {
    return <p className="text-left text-muted text-sm">This folder has no children.</p>
  }

  return (
    <ul className="details-children-list">
      {sortedChildren.map((child) => {
        const childPath = `${fullPath}/${child.name}`
        const isEmptyFolder =
          child.type === TreeNodeType.Folder && child.children.length === 0

        return (
          <li key={childPath}>
            <button
              type="button"
              onClick={() => onSelectPath?.(childPath)}
              className="interactive-list-item"
            >
              <NodeIcon
                type={child.type}
                name={child.name}
                isExpanded={false}
                isEmptyFolder={isEmptyFolder}
              />
              <span className="details-children-name" title={child.name}>
                {child.name}
              </span>
              {child.type === TreeNodeType.File ? (
                <span className="details-file-size">{formatBytes(child.size)}</span>
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
