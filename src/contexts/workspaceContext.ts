import type { ImportState } from '@/features/file-import/types'
import type { NodeSelection } from '@/lib/fileTree'
import { createContext, type MutableRefObject } from 'react'

export type ThemeMode = 'light' | 'dark'

/** How TreeExplorer updates expanded folders after `setSelectedNode`. */
export type ExplorerFolderExpandIntent = 'idle' | 'merge-ancestors' | 'collapse-to-path'

export type SetSelectedNodeOptions = {
  /** When true (toolbar search, details path), collapse other branches; explorer clicks omit this. */
  collapseExplorerFoldersToSelection?: boolean
}

export type WorkspaceContextValue = {
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null, options?: SetSelectedNodeOptions) => void
  explorerFolderExpandIntentRef: MutableRefObject<ExplorerFolderExpandIntent>
  /** Bumps on every context `setSelectedNode` so TreeExplorer can sync when selection object changes but path does not. */
  explorerSelectionSyncTick: number
  resolvedSelectedNode: NodeSelection | null
  state: ImportState
  handleFileSelect: (file: File | null) => void
  handleLoadSample: () => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
