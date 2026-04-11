import { AppToolbar } from '@/components/organisms/AppToolbar'
import { useWorkspace } from '@/contexts'
import { searchTreeByName } from '@/features/tree-explorer/utils/searchTreeByName'
import { encodeRelativeTreePathForUrl, findNodeByRelativePath } from '@/lib/fileTree'
import { useCallback, useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const TREE_SEARCH_MAX_RESULTS = 10

export function MainLayout() {
  const navigate = useNavigate()
  const {
    theme,
    setTheme,
    state,
    searchQuery,
    setSearchQuery,
    setSelectedNode,
    handleLoadSample,
  } = useWorkspace()

  const searchHits = useMemo(() => {
    if (!state.treeRoot) {
      return []
    }
    const q = searchQuery.trim()
    if (!q) {
      return []
    }
    return searchTreeByName(state.treeRoot, q, TREE_SEARCH_MAX_RESULTS)
  }, [state.treeRoot, searchQuery])

  const handleSelectSearchHit = useCallback(
    (fullPath: string) => {
      if (!state.treeRoot) {
        return
      }
      const relativePath = fullPath.split('/').slice(1).join('/')
      const resolved = findNodeByRelativePath(state.treeRoot, relativePath)
      if (!resolved) {
        return
      }
      setSelectedNode(resolved, { collapseExplorerFoldersToSelection: true })
      setSearchQuery('')
      if (relativePath.length === 0) {
        void navigate('/tree')
      } else {
        const encoded = encodeRelativeTreePathForUrl(relativePath)
        void navigate(encoded ? `/tree/${encoded}` : '/tree')
      }
    },
    [navigate, setSearchQuery, setSelectedNode, state.treeRoot],
  )

  return (
    <main className="app-shell">
      <div className="app-shell-pad-x shrink-0">
        <AppToolbar
          theme={theme}
          onThemeChange={setTheme}
          showTreeSearch={state.treeRoot !== null}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchHits={searchHits}
          onSelectSearchHit={handleSelectSearchHit}
          onLoadSample={handleLoadSample}
          selectedFileName={state.selectedFileName}
          statusMessage={state.statusMessage}
          statusType={state.statusType}
        />
      </div>

      <div className="app-display app-shell-pad-x">
        <Outlet />
      </div>
    </main>
  )
}
