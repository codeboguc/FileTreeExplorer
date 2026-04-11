import {
  CORE_EXPLORER_ROOT_NAME,
  sortTreeChildrenForDisplay,
  TreeNodeType,
  type TreeNode,
} from '@/lib/fileTree'

export type TreeSearchHit = {
  fullPath: string
  name: string
  kind: 'file' | 'folder'
}

/**
 * Depth-first search: nodes whose **name** contains `query` (case-insensitive).
 * Optional `maxResults` caps how many hits are collected (default: no cap).
 * Omits the synthetic `workspace` root as a hit; `fullPath` stays internal (`workspace/…`); UI formats display paths without that prefix.
 */
export function searchTreeByName(
  root: TreeNode,
  query: string,
  maxResults: number = Number.POSITIVE_INFINITY,
): TreeSearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q || maxResults <= 0) {
    return []
  }

  const hits: TreeSearchHit[] = []

  const walk = (node: TreeNode, displaySegments: string[]) => {
    if (hits.length >= maxResults) {
      return
    }

    const fullPath = displaySegments.join('/')
    const nameMatches = node.name.toLowerCase().includes(q)
    const skipAsHit =
      node.type === TreeNodeType.Folder && node.name === CORE_EXPLORER_ROOT_NAME

    if (nameMatches && !skipAsHit) {
      hits.push({
        fullPath,
        name: node.name,
        kind: node.type === TreeNodeType.Folder ? 'folder' : 'file',
      })
    }

    if (hits.length >= maxResults) {
      return
    }

    if (node.type === TreeNodeType.Folder) {
      for (const child of sortTreeChildrenForDisplay(node.children)) {
        walk(child, [...displaySegments, child.name])
        if (hits.length >= maxResults) {
          return
        }
      }
    }
  }

  walk(root, [root.name])
  return hits
}
