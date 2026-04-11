import {
  WorkspaceContext,
  type ExplorerFolderExpandIntent,
  type SetSelectedNodeOptions,
  type ThemeMode,
  type WorkspaceContextValue,
} from '@/contexts/workspaceContext'
import { useFileImport } from '@/features/file-import'
import type { NodeSelection } from '@/lib/fileTree'
import { persistThemeMode, readPersistedThemeMode } from '@/services/themeLocalStorage'
import {
  persistTreeSearchQuery,
  readPersistedTreeSearchQuery,
} from '@/services/treeSearchLocalStorage'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, handleFileSelect, handleLoadSample, importSuccessTick } = useFileImport()
  const lastHandledImportTickRef = useRef(importSuccessTick)
  const [selectedNode, setSelectedNode] = useState<NodeSelection | null>(null)
  const [explorerSelectionSyncTick, setExplorerSelectionSyncTick] = useState(0)
  const explorerFolderExpandIntentRef = useRef<ExplorerFolderExpandIntent>('idle')
  const [theme, setTheme] = useState<ThemeMode>(readPersistedThemeMode)
  const [searchQuery, setSearchQuery] = useState(readPersistedTreeSearchQuery)

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-light', 'theme-dark')
    root.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
  }, [theme])

  useEffect(() => {
    persistThemeMode(theme)
  }, [theme])

  useEffect(() => {
    persistTreeSearchQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (state.treeRoot === null || state.statusType !== 'success') {
      lastHandledImportTickRef.current = importSuccessTick
      return
    }
    if (location.pathname === '/tree' || location.pathname.startsWith('/tree/')) {
      lastHandledImportTickRef.current = importSuccessTick
      return
    }
    if (importSuccessTick === lastHandledImportTickRef.current) {
      return
    }
    lastHandledImportTickRef.current = importSuccessTick
    if (location.pathname !== '/') {
      return
    }
    void navigate('/tree', { replace: true })
  }, [importSuccessTick, navigate, location.pathname, state.statusType, state.treeRoot])

  const resolvedSelectedNode = useMemo((): NodeSelection | null => {
    if (!state.treeRoot) {
      return null
    }
    if (selectedNode && selectedNode.fullPath.startsWith(state.treeRoot.name)) {
      return selectedNode
    }
    return { node: state.treeRoot, fullPath: state.treeRoot.name }
  }, [selectedNode, state.treeRoot])

  const setThemeStable = useCallback((mode: ThemeMode) => {
    setTheme(mode)
  }, [])

  const setSearchQueryStable = useCallback((q: string) => {
    setSearchQuery(q)
  }, [])

  const setSelectedNodeStable = useCallback(
    (next: NodeSelection | null, options?: SetSelectedNodeOptions) => {
      explorerFolderExpandIntentRef.current = options?.collapseExplorerFoldersToSelection
        ? 'collapse-to-path'
        : 'merge-ancestors'
      setSelectedNode(next)
      setExplorerSelectionSyncTick((t) => t + 1)
    },
    [],
  )

  const value = useMemo(
    (): WorkspaceContextValue => ({
      theme,
      setTheme: setThemeStable,
      searchQuery,
      setSearchQuery: setSearchQueryStable,
      selectedNode,
      setSelectedNode: setSelectedNodeStable,
      explorerFolderExpandIntentRef,
      explorerSelectionSyncTick,
      resolvedSelectedNode,
      state,
      handleFileSelect,
      handleLoadSample,
    }),
    [
      theme,
      setThemeStable,
      searchQuery,
      setSearchQueryStable,
      selectedNode,
      setSelectedNodeStable,
      explorerFolderExpandIntentRef,
      explorerSelectionSyncTick,
      resolvedSelectedNode,
      state,
      handleFileSelect,
      handleLoadSample,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
