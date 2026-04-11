import type { TreeNode } from '@/lib/fileTree'

export type ImportStatusType = 'idle' | 'success' | 'error'

export type ImportState = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusType
  treeRoot: TreeNode | null
}
