import type { TreeNode } from '../../features/tree-explorer'
import { NodeIcon } from '../../features/tree-explorer'
import { TreeNodeType } from '../../lib/fileTree'

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
  if (childrenNodes.length === 0) {
    return <p className="text-muted text-sm">This folder has no children.</p>
  }

  return (
    <ul className="details-children-list">
      {childrenNodes.map((child) => {
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
              <span className="font-mono">{child.name}</span>
              {child.type === TreeNodeType.File ? (
                <span className="details-file-size">{child.size} B</span>
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
