import { NodeIcon } from '@/features/tree-explorer/components/NodeIcon'
import { formatBytes } from '@/lib'
import { TreeNodeType } from '@/lib/fileTree'
import { forwardRef, type KeyboardEvent } from 'react'

/** Left gutter before the first depth step (px). */
const TREE_ROW_INDENT_BASE_PX = 6
/** Horizontal offset per nesting level (px) — keep narrow for dense trees. */
const TREE_ROW_INDENT_PER_DEPTH_PX = 10

type TreeNodeRowProps = {
  /** Stable path for scroll alignment fallback (`data-tree-path`). */
  dataTreePath: string
  name: string
  type: TreeNodeType
  depth: number
  size?: number
  isEmptyFolder?: boolean
  isSelected?: boolean
  isFocused?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  onSelect: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
}

export const TreeNodeRow = forwardRef<HTMLLIElement, TreeNodeRowProps>(function TreeNodeRow(
  {
    dataTreePath,
    name,
    type,
    depth,
    size,
    isEmptyFolder,
    isSelected,
    isFocused,
    isExpanded,
    onToggle,
    onSelect,
    onKeyDown,
  },
  ref,
) {
  const paddingLeft = TREE_ROW_INDENT_BASE_PX + depth * TREE_ROW_INDENT_PER_DEPTH_PX
  const isFolder = type === TreeNodeType.Folder
  const isToggleableFolder = isFolder && !isEmptyFolder
  const handleRowClick = () => {
    onSelect()
    if (isToggleableFolder) {
      onToggle?.()
    }
  }

  return (
    <li
      ref={ref}
      className={`tree-row ${isSelected ? 'tree-row-selected' : ''}`}
      data-tree-path={dataTreePath}
    >
      <button
        type="button"
        onClick={handleRowClick}
        onKeyDown={onKeyDown}
        tabIndex={isFocused ? 0 : -1}
        className="tree-row-button"
        style={{ paddingLeft }}
      >
        <span className="tree-row-icon-slot shrink-0" data-tree-row-icon aria-hidden>
          <NodeIcon
            type={type}
            name={name}
            isExpanded={isExpanded}
            isEmptyFolder={isEmptyFolder}
          />
        </span>
        <span className="tree-row-name" title={name}>
          {name}
        </span>
      </button>
      {type === TreeNodeType.File ? (
        <span className="shrink-0 text-xs text-muted">{formatBytes(size ?? 0)}</span>
      ) : null}
    </li>
  )
})
