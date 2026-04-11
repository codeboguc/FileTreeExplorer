import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { NodeDetailsPanel } from './components/details'
import { ExplorerPanel } from './components/explorer'
import { JsonImportDropzone } from './components/file'
import { AppToolbar } from './components/layout'
import { useFileImport } from './features/file-import'
import type { ImportStatusType } from './features/file-import'
import type { TreeNode } from './features/tree-explorer'
import { findNodeByRelativePath, type NodeSelection } from './lib/fileTree'

type TreeWorkspaceProps = {
  treeRoot: TreeNode | null
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null) => void
  searchQuery: string
}

type ThemeMode = 'light' | 'dark'

function TreeWorkspace({ treeRoot, selectedNode, setSelectedNode, searchQuery }: TreeWorkspaceProps) {
  const navigate = useNavigate()

  const handleSelectNode = (payload: NodeSelection) => {
    setSelectedNode(payload)
    const relativePath = payload.fullPath.split('/').slice(1).join('/')
    if (relativePath.length === 0) {
      void navigate('/tree')
      return
    }
    void navigate(`/tree/${encodeURIComponent(relativePath)}`)
  }

  const handleSelectDetailsPath = (fullPath: string) => {
    if (!treeRoot) {
      return
    }

    const relativePath = fullPath.split('/').slice(1).join('/')
    const resolved = findNodeByRelativePath(treeRoot, relativePath)
    if (!resolved) {
      return
    }

    handleSelectNode(resolved)
  }

  return (
    <div className="app-tree-workspace">
      <section className="app-main-grid app-main-grid--split">
        <ExplorerPanel
          tree={treeRoot}
          selectedPath={selectedNode?.fullPath ?? null}
          onSelectNode={handleSelectNode}
          searchQuery={searchQuery}
        />
        <NodeDetailsPanel selected={selectedNode} onSelectPath={handleSelectDetailsPath} />
      </section>
    </div>
  )
}

type TreeRouteProps = Omit<TreeWorkspaceProps, 'treeRoot'> & { treeRoot: TreeNode | null }

function TreeRoute({ treeRoot, selectedNode, setSelectedNode, searchQuery }: TreeRouteProps) {
  if (!treeRoot) {
    return <Navigate to="/" replace />
  }

  return (
    <TreeWorkspace
      treeRoot={treeRoot}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
      searchQuery={searchQuery}
    />
  )
}

function TreeNodeRoute({ treeRoot, selectedNode, setSelectedNode, searchQuery }: TreeRouteProps) {
  const params = useParams<{ nodePath: string }>()
  if (!treeRoot) {
    return <Navigate to="/" replace />
  }

  const resolvedFromUrl = params.nodePath
    ? findNodeByRelativePath(treeRoot, params.nodePath)
    : { node: treeRoot, fullPath: treeRoot.name }

  if (params.nodePath && !resolvedFromUrl) {
    return <Navigate to="/tree" replace />
  }

  return (
    <TreeWorkspace
      treeRoot={treeRoot}
      selectedNode={resolvedFromUrl ?? selectedNode}
      setSelectedNode={setSelectedNode}
      searchQuery={searchQuery}
    />
  )
}

type HomeRouteProps = {
  selectedFileName: string | null
  statusMessage: string
  statusType: ImportStatusType
  onFileSelect: (file: File | null) => void
  hasLoadedTree: boolean
}

function HomeRoute({
  selectedFileName,
  statusMessage,
  statusType,
  onFileSelect,
  hasLoadedTree,
}: HomeRouteProps) {
  return (
    <div className="app-home-content">
      <section
        className="panel-shell home-import-panel p-6 sm:p-8"
        aria-labelledby="home-import-title"
      >
        <h2 id="home-import-title" className="home-import-title">
          Import JSON tree
        </h2>
        <p className="home-import-description">
          Load a file that describes folders and files. After a successful import you go to the tree
          explorer automatically. You can also use <strong className="text-primary">Load sample JSON</strong>{' '}
          in the toolbar for a demo.
        </p>
        <div className="home-import-content" aria-labelledby="home-import-title">
          <JsonImportDropzone
            selectedFileName={selectedFileName}
            statusMessage={statusMessage}
            statusType={statusType}
            onFileSelect={onFileSelect}
          />
        </div>
        {hasLoadedTree ? (
          <div className="home-import-footer">
            <Link to="/tree" className="btn-primary inline-flex items-center gap-2">
              Open tree explorer
            </Link>
            <span className="helper-text-xs">A valid tree is already loaded.</span>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const { state, handleFileSelect, handleLoadSample } = useFileImport()
  const [selectedNode, setSelectedNode] = useState<NodeSelection | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (state.treeRoot !== null && state.statusType === 'success') {
      navigate('/tree', { replace: true })
    }
  }, [navigate, state.statusType, state.treeRoot])

  const resolvedSelectedNode =
    selectedNode &&
    state.treeRoot &&
    selectedNode.fullPath.startsWith(state.treeRoot.name)
      ? selectedNode
      : state.treeRoot
        ? { node: state.treeRoot, fullPath: state.treeRoot.name }
        : null

  const treeRouteProps = {
    treeRoot: state.treeRoot,
    selectedNode: resolvedSelectedNode,
    setSelectedNode,
    searchQuery,
  }

  const homeRouteProps = {
    selectedFileName: state.selectedFileName,
    statusMessage: state.statusMessage,
    statusType: state.statusType,
    onFileSelect: handleFileSelect,
    hasLoadedTree: state.treeRoot !== null,
  }

  return (
    <main className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className="app-shell-pad-x">
        <AppToolbar
          theme={theme}
          onThemeChange={setTheme}
          showTreeSearch={state.treeRoot !== null}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLoadSample={handleLoadSample}
          selectedFileName={state.selectedFileName}
          statusMessage={state.statusMessage}
          statusType={state.statusType}
        />
      </div>

      <div className="app-display app-shell-pad-x">
        <Routes>
          <Route path="/" element={<HomeRoute {...homeRouteProps} />} />
          <Route path="/tree" element={<TreeRoute {...treeRouteProps} />} />
          <Route path="/tree/:nodePath" element={<TreeNodeRoute {...treeRouteProps} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
