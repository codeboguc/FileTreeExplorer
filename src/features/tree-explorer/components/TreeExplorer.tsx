import { useWorkspace } from '@/contexts'
import { TreeNodeRow } from '@/features/tree-explorer/components/TreeNodeRow'
import { useExpandedFolders } from '@/features/tree-explorer/hooks/useExpandedFolders'
import type { FolderNode, TreeNode } from '@/features/tree-explorer/types'
import {
  CORE_EXPLORER_ROOT_NAME,
  sortTreeChildrenForDisplay,
  TreeNodeType,
} from '@/lib/fileTree'
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

type TreeExplorerProps = {
  root: TreeNode
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
}

type FlatListItem = {
  key: string
  name: string
  type: TreeNodeType
  node: TreeNode
  fullPath: string
  depth: number
  size?: number
  isEmptyFolder?: boolean
  isSelected: boolean
  isFocused?: boolean
  isExpanded?: boolean
  isToggleableFolder?: boolean
  onToggle?: () => void
  onSelect: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
}

const buildPathKey = (segments: string[]) => segments.join('/')

function isCoreExplorerRootFolder(node: TreeNode): node is FolderNode {
  return node.type === TreeNodeType.Folder && node.name === CORE_EXPLORER_ROOT_NAME
}
const getParentPath = (fullPath: string): string | null => {
  const segments = fullPath.split('/')
  if (segments.length <= 1) {
    return null
  }
  return segments.slice(0, -1).join('/')
}

/** Internal folder keys on the route to `targetFullPath` (same ordering as tree walk). */
function collectAncestorFolderPathKeys(
  root: TreeNode,
  targetFullPath: string | null,
): string[] {
  if (!targetFullPath) {
    return []
  }
  const rootKey = 'root::0'
  if (targetFullPath === root.name) {
    return []
  }
  const prefix = `${root.name}/`
  if (!targetFullPath.startsWith(prefix)) {
    return []
  }
  const nameSegments = targetFullPath
    .slice(root.name.length + 1)
    .split('/')
    .filter(Boolean)
  if (nameSegments.length === 0) {
    return []
  }

  let current: TreeNode = root
  let pathSegments: string[] = [rootKey]
  const toExpand: string[] = []

  for (let i = 0; i < nameSegments.length; i++) {
    const pathKey = buildPathKey(pathSegments)
    if (current.type !== TreeNodeType.Folder) {
      break
    }

    toExpand.push(pathKey)

    const seg = nameSegments[i]
    const orderedChildren = sortTreeChildrenForDisplay(current.children)
    const childIndex = orderedChildren.findIndex((c) => c.name === seg)
    if (childIndex === -1) {
      break
    }
    const child = orderedChildren[childIndex]
    pathSegments = [...pathSegments, `${child.name}::${childIndex}`]
    current = child
  }

  return toExpand
}

export function TreeExplorer({ root, selectedPath, onSelectNode }: TreeExplorerProps) {
  const rootKey = 'root::0'
  const viewportRef = useRef<HTMLDivElement>(null)
  const selectedRowRef = useRef<HTMLLIElement>(null)
  const { explorerFolderExpandIntentRef, explorerSelectionSyncTick } = useWorkspace()
  const { isExpanded, toggleExpanded, syncExpandedToAncestorPath, expandPaths } =
    useExpandedFolders()
  const [focusedPath, setFocusedPath] = useState<string | null>(null)

  useLayoutEffect(() => {
    const keys = collectAncestorFolderPathKeys(root, selectedPath)
    const intent = explorerFolderExpandIntentRef.current
    explorerFolderExpandIntentRef.current = 'idle'
    if (intent === 'collapse-to-path') {
      syncExpandedToAncestorPath(keys)
    } else {
      expandPaths(keys)
    }
  }, [
    root,
    selectedPath,
    explorerSelectionSyncTick,
    expandPaths,
    syncExpandedToAncestorPath,
    explorerFolderExpandIntentRef,
  ])

  const rows = useMemo<FlatListItem[]>(() => {
    const result: FlatListItem[] = []

    const walk = (
      node: TreeNode,
      depth: number,
      pathSegments: string[],
      displaySegments: string[],
    ) => {
      const pathKey = buildPathKey(pathSegments)
      const fullPath = displaySegments.join('/')

      if (node.type === TreeNodeType.Folder) {
        const expanded = isExpanded(pathKey)
        const isEmptyFolder = node.children.length === 0

        result.push({
          key: pathKey,
          name: node.name,
          type: TreeNodeType.Folder,
          node,
          fullPath,
          depth,
          isEmptyFolder,
          isSelected: selectedPath === fullPath,
          isExpanded: expanded,
          isToggleableFolder: !isEmptyFolder,
          onToggle: isEmptyFolder ? undefined : () => toggleExpanded(pathKey),
          onSelect: () => onSelectNode({ node, fullPath }),
        })

        if (!expanded) {
          return
        }

        const orderedChildren = sortTreeChildrenForDisplay(node.children)

        orderedChildren.forEach((child, childIndex) => {
          const keySegment = `${child.name}::${childIndex}`
          walk(child, depth + 1, [...pathSegments, keySegment], [
            ...displaySegments,
            child.name,
          ])
        })
        return
      }

      result.push({
        key: pathKey,
        name: node.name,
        type: TreeNodeType.File,
        node,
        fullPath,
        depth,
        size: node.size,
        isSelected: selectedPath === fullPath,
        onSelect: () => onSelectNode({ node, fullPath }),
      })
    }

    if (isCoreExplorerRootFolder(root)) {
      const orderedChildren = sortTreeChildrenForDisplay(root.children)
      orderedChildren.forEach((child, childIndex) => {
        const keySegment = `${child.name}::${childIndex}`
        walk(child, 0, [rootKey, keySegment], [root.name, child.name])
      })
    } else {
      walk(root, 0, [rootKey], [root.name])
    }
    return result
  }, [root, isExpanded, onSelectNode, selectedPath, toggleExpanded])

  const resolvedFocusedPath = useMemo(() => {
    if (rows.length === 0) {
      return null
    }
    const availablePaths = new Set(rows.map((row) => row.fullPath))
    if (focusedPath && availablePaths.has(focusedPath)) {
      return focusedPath
    }
    if (selectedPath && availablePaths.has(selectedPath)) {
      return selectedPath
    }
    return rows[0].fullPath
  }, [focusedPath, rows, selectedPath])

  const rowsWithKeyboard = useMemo(() => {
    const pathToIndex = new Map<string, number>()
    rows.forEach((row, index) => {
      pathToIndex.set(row.fullPath, index)
    })

    return rows.map((row, index) => {
      const isFocused = row.fullPath === resolvedFocusedPath

      const onRowKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault()
            const nextIndex = Math.min(index + 1, rows.length - 1)
            const nextRow = rows[nextIndex]
            setFocusedPath(nextRow.fullPath)
            nextRow.onSelect()
            return
          }
          case 'ArrowUp': {
            event.preventDefault()
            const prevIndex = Math.max(index - 1, 0)
            const prevRow = rows[prevIndex]
            setFocusedPath(prevRow.fullPath)
            prevRow.onSelect()
            return
          }
          case 'ArrowRight': {
            if (row.type !== TreeNodeType.Folder || !row.isToggleableFolder) {
              return
            }
            event.preventDefault()
            if (!row.isExpanded) {
              row.onToggle?.()
            }
            return
          }
          case 'ArrowLeft': {
            if (
              row.type === TreeNodeType.Folder &&
              row.isToggleableFolder &&
              row.isExpanded
            ) {
              event.preventDefault()
              row.onToggle?.()
              return
            }

            const parentPath = getParentPath(row.fullPath)
            if (!parentPath) {
              return
            }
            const parentIndex = pathToIndex.get(parentPath)
            if (parentIndex === undefined) {
              return
            }
            event.preventDefault()
            const parentRow = rows[parentIndex]
            setFocusedPath(parentRow.fullPath)
            parentRow.onSelect()
            return
          }
          case 'Enter':
          case ' ': {
            event.preventDefault()
            row.onSelect()
            if (row.type === TreeNodeType.Folder && row.isToggleableFolder) {
              row.onToggle?.()
            }
            return
          }
          default:
            return
        }
      }

      return {
        ...row,
        isFocused,
        onKeyDown: onRowKeyDown,
      }
    })
  }, [resolvedFocusedPath, rows])

  /** After expansion + paint, nudge scroll when the icon is clipped/past center horizontally, or the row is clipped/past center vertically. */
  useEffect(() => {
    if (!selectedPath) {
      return
    }
    const scroller = viewportRef.current?.closest(
      '.panel-shell__fill-scroll-inner',
    ) as HTMLElement | null
    if (!scroller) {
      return
    }

    const alignSelectedRow = () => {
      let row = selectedRowRef.current
      if (!row) {
        try {
          row = scroller.querySelector(
            `[data-tree-path="${CSS.escape(selectedPath)}"]`,
          ) as HTMLLIElement | null
        } catch {
          return
        }
      }
      if (!row) {
        return
      }
      const pad = 8
      const scRect = scroller.getBoundingClientRect()
      const viewMidX = scRect.left + scRect.width / 2
      const viewMidY = scRect.top + scRect.height / 2
      const iconEl = row.querySelector('[data-tree-row-icon]')
      const rowRect = row.getBoundingClientRect()
      const hRect =
        iconEl instanceof HTMLElement ? iconEl.getBoundingClientRect() : rowRect
      const iconClippedOnLeft = hRect.left < scRect.left
      const iconPastHalfOfView = hRect.left > viewMidX
      if (iconClippedOnLeft || iconPastHalfOfView) {
        scroller.scrollLeft += hRect.left - scRect.left - pad
      }
      const rowClippedOnTop = rowRect.top < scRect.top
      const rowPastHalfOfView = rowRect.top > viewMidY
      if (rowClippedOnTop || rowPastHalfOfView) {
        scroller.scrollTop += rowRect.top - scRect.top - pad
      }
    }

    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(alignSelectedRow)
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [selectedPath, rows, explorerSelectionSyncTick])

  return (
    <div ref={viewportRef} className="tree-explorer-viewport">
      <ul className="tree-explorer-list space-y-1">
        {rowsWithKeyboard.map((row) => (
          <TreeNodeRow
            ref={row.isSelected ? selectedRowRef : undefined}
            key={row.key}
            dataTreePath={row.fullPath}
            name={row.name}
            type={row.type}
            depth={row.depth}
            size={row.size}
            isSelected={row.isSelected}
            isEmptyFolder={row.isEmptyFolder}
            isFocused={row.isFocused}
            isExpanded={row.isExpanded}
            onToggle={row.onToggle}
            onSelect={row.onSelect}
            onKeyDown={row.onKeyDown}
          />
        ))}
      </ul>
    </div>
  )
}
