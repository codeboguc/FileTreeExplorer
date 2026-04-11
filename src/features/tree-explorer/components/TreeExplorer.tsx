import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { TreeNodeType } from '../../../lib/fileTree'
import { useExpandedFolders } from '../hooks/useExpandedFolders'
import type { TreeNode } from '../types'
import { TreeNodeRow } from './TreeNodeRow'

type TreeExplorerProps = {
  root: TreeNode
  selectedPath: string | null
  onSelectNode: (payload: { node: TreeNode; fullPath: string }) => void
  searchQuery?: string
}

const subtreeHasNameMatch = (node: TreeNode, normalizedQuery: string): boolean => {
  if (node.name.toLowerCase().includes(normalizedQuery)) {
    return true
  }
  if (node.type === TreeNodeType.Folder) {
    return node.children.some((child) => subtreeHasNameMatch(child, normalizedQuery))
  }
  return false
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
const asSortableName = (value: string) => value.toLocaleLowerCase()
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
  const nameSegments = targetFullPath.slice(root.name.length + 1).split('/').filter(Boolean)
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
    const orderedChildren = [...current.children].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === TreeNodeType.Folder ? -1 : 1
      }
      return asSortableName(left.name).localeCompare(asSortableName(right.name))
    })
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

export function TreeExplorer({
  root,
  selectedPath,
  onSelectNode,
  searchQuery = '',
}: TreeExplorerProps) {
  const rootKey = 'root::0'
  const { isExpanded, toggleExpanded, expandPaths } = useExpandedFolders()
  const [focusedPath, setFocusedPath] = useState<string | null>(null)

  const normalizedSearch = searchQuery.trim().toLowerCase()

  useEffect(() => {
    expandPaths(collectAncestorFolderPathKeys(root, selectedPath))
  }, [expandPaths, root, selectedPath])

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

        const orderedChildren = [...node.children].sort((left, right) => {
          if (left.type !== right.type) {
            return left.type === TreeNodeType.Folder ? -1 : 1
          }
          return asSortableName(left.name).localeCompare(asSortableName(right.name))
        })

        orderedChildren.forEach((child, childIndex) => {
          const keySegment = `${child.name}::${childIndex}`
          walk(
            child,
            depth + 1,
            [...pathSegments, keySegment],
            [...displaySegments, child.name],
          )
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

    const walkFiltered = (
      node: TreeNode,
      depth: number,
      pathSegments: string[],
      displaySegments: string[],
    ) => {
      const pathKey = buildPathKey(pathSegments)
      const fullPath = displaySegments.join('/')
      const q = normalizedSearch

      if (node.type === TreeNodeType.Folder) {
        if (!subtreeHasNameMatch(node, q)) {
          return
        }

        const isEmptyFolder = node.children.length === 0
        const childHasMatch = node.children.some((child) => subtreeHasNameMatch(child, q))
        const expanded = isExpanded(pathKey) || childHasMatch

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

        const orderedChildren = [...node.children].sort((left, right) => {
          if (left.type !== right.type) {
            return left.type === TreeNodeType.Folder ? -1 : 1
          }
          return asSortableName(left.name).localeCompare(asSortableName(right.name))
        })

        orderedChildren.forEach((child, childIndex) => {
          if (!subtreeHasNameMatch(child, q)) {
            return
          }
          const keySegment = `${child.name}::${childIndex}`
          walkFiltered(
            child,
            depth + 1,
            [...pathSegments, keySegment],
            [...displaySegments, child.name],
          )
        })
        return
      }

      if (node.name.toLowerCase().includes(q)) {
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
    }

    if (!normalizedSearch) {
      walk(root, 0, [rootKey], [root.name])
    } else {
      walkFiltered(root, 0, [rootKey], [root.name])
    }
    return result
  }, [
    root,
    isExpanded,
    normalizedSearch,
    onSelectNode,
    selectedPath,
    toggleExpanded,
  ])

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

  return (
    <ul className="space-y-1">
      {rowsWithKeyboard.map((row) => (
        <TreeNodeRow
          key={row.key}
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
  )
}
