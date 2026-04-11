import { createContext } from 'react'
import type { ImportState } from '../features/file-import/types'
import type { NodeSelection } from '../lib/fileTree'

export type ThemeMode = 'light' | 'dark'

export type WorkspaceContextValue = {
  theme: ThemeMode
  setTheme: (mode: ThemeMode) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null) => void
  resolvedSelectedNode: NodeSelection | null
  state: ImportState
  handleFileSelect: (file: File | null) => void
  handleLoadSample: () => void
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)
