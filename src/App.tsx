import { useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { NodeDetailsPanel } from './components/details'
import { ExplorerPanel } from './components/explorer'
import { FileImportHeaderControls } from './components/file'
import { AppHeader } from './components/layout'
import { useFileImport } from './features/file-import'
import type { TreeNode } from './features/tree-explorer'
import { findNodeByRelativePath, type NodeSelection } from './lib/fileTree'

type WorkspaceProps = {
  treeRoot: TreeNode | null
  selectedNode: NodeSelection | null
  setSelectedNode: (next: NodeSelection | null) => void
}
type ThemeMode = 'light' | 'dark'

function TreeWorkspace({ treeRoot, selectedNode, setSelectedNode }: WorkspaceProps) {
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
    <section className="app-main-grid">
      <ExplorerPanel
        tree={treeRoot}
        selectedPath={selectedNode?.fullPath ?? null}
        onSelectNode={handleSelectNode}
      />
      <NodeDetailsPanel selected={selectedNode} onSelectPath={handleSelectDetailsPath} />
    </section>
  )
}

function TreeRoute({ treeRoot, selectedNode, setSelectedNode }: WorkspaceProps) {
  if (!treeRoot) {
    return <Navigate to="/" replace />
  }

  return (
    <TreeWorkspace
      treeRoot={treeRoot}
      selectedNode={selectedNode}
      setSelectedNode={setSelectedNode}
    />
  )
}

function TreeNodeRoute({ treeRoot, selectedNode, setSelectedNode }: WorkspaceProps) {
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
    />
  )
}

function HomeRoute() {
  return (
    <div className="space-y-4">
      <section className="panel-shell p-4">
        <h2 className="panel-title text-base">Home</h2>
        <p className="mt-2 text-sm text-muted">
          Import a JSON tree using header controls, then open the explorer view.
        </p>
        <Link to="/tree" className="btn-primary mt-4 inline-flex">
          Open Tree View
        </Link>
      </section>

      <section className="panel-shell p-4" aria-labelledby="reference-layout-heading">
        <h2 id="reference-layout-heading" className="reference-layout-section-title">
          Reference layout
        </h2>
        <p className="mt-2 text-sm text-muted">
          Target UI: explorer sidebar, breadcrumbs, file metadata, and code preview (mock).
        </p>
        <figure className="reference-layout-frame mt-4">
          <img
            src="/reference-layout.png"
            alt="Reference file explorer: left tree with EXPLORER and storage footer; main area with breadcrumbs, file details card, and dark code preview"
            className="reference-layout-image"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="reference-layout-caption">
            Static mock for layout direction only; this app implements JSON-driven tree import
            and navigation instead of live file I/O.
          </figcaption>
        </figure>
      </section>
    </div>
  )
}

function RouteLinks() {
  return (
    <nav className="mb-3 flex items-center gap-2" aria-label="Primary routes">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'btn-primary' : 'btn-secondary')}
      >
        Home
      </NavLink>
      <NavLink
        to="/tree"
        className={({ isActive }) => (isActive ? 'btn-primary' : 'btn-secondary')}
      >
        Tree
      </NavLink>
    </nav>
  )
}

function App() {
  const { state, handleFileSelect, handleLoadSample } = useFileImport()
  const [selectedNode, setSelectedNode] = useState<NodeSelection | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('light')

  const resolvedSelectedNode =
    selectedNode &&
    state.treeRoot &&
    selectedNode.fullPath.startsWith(state.treeRoot.name)
      ? selectedNode
      : state.treeRoot
        ? { node: state.treeRoot, fullPath: state.treeRoot.name }
        : null

  return (
    <main className={`app-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <AppHeader
        theme={theme}
        onThemeChange={setTheme}
        rightSlot={
          <FileImportHeaderControls
            selectedFileName={state.selectedFileName}
            statusMessage={state.statusMessage}
            statusType={state.statusType}
            onFileSelect={handleFileSelect}
            onLoadSample={handleLoadSample}
          />
        }
      />
      <RouteLinks />

      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route
          path="/tree"
          element={
            <TreeRoute
              treeRoot={state.treeRoot}
              selectedNode={resolvedSelectedNode}
              setSelectedNode={setSelectedNode}
            />
          }
        />
        <Route
          path="/tree/:nodePath"
          element={
            <TreeNodeRoute
              treeRoot={state.treeRoot}
              selectedNode={resolvedSelectedNode}
              setSelectedNode={setSelectedNode}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}

export default App
