import type { ImportState } from '@/features/file-import/types'
import type { NodeSelection } from '@/lib/fileTree'
import { createContext, type RefObject } from 'react'

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
  explorerFolderExpandIntentRef: RefObject<ExplorerFolderExpandIntent>
  /** Bumps on every context `setSelectedNode` so TreeExplorer can sync when selection object changes but path does not. */
  explorerSelectionSyncTick: number
  resolvedSelectedNode: NodeSelection | null
  state: ImportState
  handleFileSelect: (file: File | null) => void
  /** Validates pasted text with the same pipeline as file upload (`parseAndValidateTree`). */
  handleImportPastedJson: (text: string) => void
  handleLoadSample: () => void
  /** Increments after each successful JSON parse; use as `key` to reset import UI (e.g. paste field). */
  importSuccessTick: number
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
