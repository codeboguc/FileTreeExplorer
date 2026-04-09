import type { KeyboardEvent } from 'react'
import { TreeNodeType } from '../../../lib/fileTree'
import { NodeIcon } from './NodeIcon'

type TreeNodeRowProps = {
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

export function TreeNodeRow({
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
}: TreeNodeRowProps) {
  const paddingLeft = 8 + depth * 14
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
      className={`tree-row ${isSelected ? 'tree-row-selected' : ''}`}
      style={{ paddingLeft }}
    >
      <button
        type="button"
        onClick={handleRowClick}
        onKeyDown={onKeyDown}
        tabIndex={isFocused ? 0 : -1}
        className="tree-row-button flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <span
          role="button"
          tabIndex={isToggleableFolder ? 0 : -1}
          onClick={(event) => {
            event.stopPropagation()
            if (isToggleableFolder) {
              onToggle?.()
            }
          }}
          onKeyDown={(event) => {
            if (!isToggleableFolder) {
              return
            }
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onToggle?.()
            }
          }}
          className={`w-3 text-left text-xs ${isToggleableFolder ? 'cursor-pointer' : 'cursor-default'}`}
          style={{ color: 'var(--text-muted)' }}
          aria-label={isToggleableFolder ? 'Toggle folder' : 'Tree item'}
        >
          {isFolder ? (isToggleableFolder ? (isExpanded ? '▾' : '▸') : '•') : '•'}
        </span>
        <NodeIcon
          type={type}
          name={name}
          isExpanded={isExpanded}
          isEmptyFolder={isEmptyFolder}
        />
        <span className="truncate font-mono">{name}</span>
      </button>
      {type === TreeNodeType.File ? (
        <span className="text-xs text-muted">{size ?? 0} B</span>
      ) : null}
    </li>
  )
}
