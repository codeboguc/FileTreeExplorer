import { z } from 'zod'

export enum TreeNodeType {
  Folder = 'folder',
  File = 'file',
}

export type FileNode = {
  name: string
  type: TreeNodeType.File
  size: number
}

export type FolderNode = {
  name: string
  type: TreeNodeType.Folder
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode

type ValidationSuccess = {
  ok: true
  data: TreeNode
}

type ValidationFailure = {
  ok: false
  error: string
}

export type ValidationResult = ValidationSuccess | ValidationFailure

export type NodeSelection = {
  node: TreeNode
  fullPath: string
}

/** Synthetic folder created by the app after import; all imported nodes become its children. */
export const CORE_EXPLORER_ROOT_NAME = 'workspace'

const treeNodeSchema: z.ZodType<TreeNode> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({
      name: z.string().trim().min(1, '"name" must be a non-empty string'),
      type: z.literal(TreeNodeType.File),
      size: z.number().nonnegative('"size" must be a non-negative number'),
    }),
    z.object({
      name: z.string().trim().min(1, '"name" must be a non-empty string'),
      type: z.literal(TreeNodeType.Folder),
      children: z.array(treeNodeSchema),
    }),
  ]),
)

/** Single tree node or an array of sibling roots (wrapped under {@link CORE_EXPLORER_ROOT_NAME} after validation). */
const importedPayloadSchema = z.union([
  treeNodeSchema,
  z
    .array(treeNodeSchema)
    .min(1, 'Array must contain at least one tree node'),
])

const formatIssuePath = (segments: PropertyKey[]) => {
  if (segments.length === 0) {
    return 'root'
  }
  return ['root', ...segments.map((segment) => String(segment))].join('.')
}

const validateNoDuplicateNamesAmongSiblings = (
  folderPath: string,
  children: TreeNode[],
): string | null => {
  const seen = new Set<string>()
  for (const child of children) {
    if (seen.has(child.name)) {
      return `Duplicate name "${child.name}" in folder "${folderPath}".`
    }
    seen.add(child.name)
  }
  return null
}

/** Ensures no duplicate names among direct children at any folder level (imported tree only, before core wrap). */
const validateUniqueSiblingNamesInTree = (
  node: TreeNode,
  folderPath: string,
): string | null => {
  if (node.type === TreeNodeType.File) {
    return null
  }

  const dup = validateNoDuplicateNamesAmongSiblings(folderPath, node.children)
  if (dup) {
    return dup
  }

  for (const child of node.children) {
    if (child.type === TreeNodeType.Folder) {
      const childPath = `${folderPath}/${child.name}`
      const err = validateUniqueSiblingNamesInTree(child, childPath)
      if (err) {
        return err
      }
    }
  }

  return null
}

const validateImportedPayload = (nodes: TreeNode[]): string | null => {
  const seenTop = new Set<string>()
  for (const node of nodes) {
    if (seenTop.has(node.name)) {
      return `Duplicate name "${node.name}" among top-level roots.`
    }
    seenTop.add(node.name)
  }

  for (const node of nodes) {
    const err = validateUniqueSiblingNamesInTree(node, node.name)
    if (err) {
      return err
    }
  }

  return null
}

export const wrapAsCoreExplorerRoot = (importedRoots: TreeNode[]): FolderNode => ({
  name: CORE_EXPLORER_ROOT_NAME,
  type: TreeNodeType.Folder,
  children: importedRoots,
})

export const validateTreeJson = (value: unknown): ValidationResult => {
  const parsed = importedPayloadSchema.safeParse(value)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const path = formatIssuePath(firstIssue?.path ?? [])
    const message = firstIssue?.message ?? 'Invalid JSON tree format.'

    return {
      ok: false,
      error: `Invalid tree at "${path}": ${message}`,
    }
  }

  const payload = parsed.data
  const importedRoots: TreeNode[] = Array.isArray(payload) ? payload : [payload]

  const uniquenessError = validateImportedPayload(importedRoots)
  if (uniquenessError) {
    return { ok: false, error: uniquenessError }
  }

  return { ok: true, data: wrapAsCoreExplorerRoot(importedRoots) }
}

export const flattenTreeForExplorer = (node: TreeNode, depth = 0): string[] => {
  const indent = '  '.repeat(depth)
  const currentLabel =
    node.type === TreeNodeType.Folder ? `${indent}${node.name}/` : `${indent}${node.name}`

  if (node.type === TreeNodeType.File) {
    return [currentLabel]
  }

  const childrenLines = node.children.flatMap((child) =>
    flattenTreeForExplorer(child, depth + 1),
  )
  return [currentLabel, ...childrenLines]
}

export const splitFolderChildren = (
  node: TreeNode,
): {
  folders: FolderNode[]
  files: FileNode[]
} => {
  if (node.type !== TreeNodeType.Folder) {
    return { folders: [], files: [] }
  }

  const folders: FolderNode[] = []
  const files: FileNode[] = []

  for (const child of node.children) {
    if (child.type === TreeNodeType.Folder) {
      folders.push(child)
    } else {
      files.push(child)
    }
  }

  return { folders, files }
}

export const findNodeByRelativePath = (
  root: TreeNode,
  relativePath: string,
): NodeSelection | null => {
  const normalized = decodeURIComponent(relativePath).trim()
  if (normalized.length === 0) {
    return { node: root, fullPath: root.name }
  }

  const segments = normalized
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)

  let current: TreeNode = root
  let currentPath = root.name

  if (segments[0] === root.name) {
    segments.shift()
  }

  for (const segment of segments) {
    if (current.type !== TreeNodeType.Folder) {
      return null
    }

    const next = current.children.find((child) => child.name === segment)
    if (!next) {
      return null
    }

    current = next
    currentPath = `${currentPath}/${segment}`
  }

  return { node: current, fullPath: currentPath }
}
