import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useFileImport } from '../features/file-import'
import type { NodeSelection } from '../lib/fileTree'
import { WorkspaceContext, type ThemeMode, type WorkspaceContextValue } from './workspaceContext'

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { state, handleFileSelect, handleLoadSample } = useFileImport()
  const [selectedNode, setSelectedNode] = useState<NodeSelection | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (state.treeRoot !== null && state.statusType === 'success') {
      void navigate('/tree', { replace: true })
    }
  }, [navigate, state.statusType, state.treeRoot])

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

  const setSelectedNodeStable = useCallback((next: NodeSelection | null) => {
    setSelectedNode(next)
  }, [])

  const value = useMemo(
    (): WorkspaceContextValue => ({
      theme,
      setTheme: setThemeStable,
      searchQuery,
      setSearchQuery: setSearchQueryStable,
      selectedNode,
      setSelectedNode: setSelectedNodeStable,
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
      resolvedSelectedNode,
      state,
      handleFileSelect,
      handleLoadSample,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
