import { Link } from 'react-router-dom'
import { JsonImportDropzone } from '../components/molecules/JsonImportDropzone'
import { useWorkspace } from '../contexts'

export function HomePage() {
  const { state, handleFileSelect } = useWorkspace()

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
            selectedFileName={state.selectedFileName}
            statusMessage={state.statusMessage}
            statusType={state.statusType}
            onFileSelect={handleFileSelect}
          />
        </div>
        {state.treeRoot !== null ? (
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
