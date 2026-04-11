import { JsonImportDropzone } from '@/components/molecules/JsonImportDropzone'
import { useWorkspace } from '@/contexts'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function HomePage() {
  const { t } = useTranslation()
  const { state, handleFileSelect, handleImportPastedJson, importSuccessTick } =
    useWorkspace()

  return (
    <div className="app-home-content">
      <div className="app-home-main-scroll">
        <section
          className="panel-shell home-import-panel w-full min-w-0 p-6 sm:p-8"
          aria-labelledby="home-import-title"
        >
          <h2 id="home-import-title" className="home-import-title">
            {t('home.importTitle')}
          </h2>
          <div className="home-import-description-block">
            <p className="home-import-description">{t('home.descriptionLine1')}</p>
            <p className="home-import-description">
              <Trans
                i18nKey="home.descriptionLine2"
                components={{
                  1: <strong className="text-primary" />,
                }}
              />
            </p>
          </div>
          {state.treeRoot !== null ? (
            <div className="home-import-tree-cta">
              <Link to="/tree" className="btn-primary inline-flex items-center gap-2">
                {t('home.openTreeExplorer')}
              </Link>
              <span className="helper-text-xs">{t('home.treeAlreadyLoaded')}</span>
            </div>
          ) : null}
          <div className="home-import-content" aria-labelledby="home-import-title">
            <JsonImportDropzone
              key={importSuccessTick}
              selectedFileName={state.selectedFileName}
              statusMessage={state.statusMessage}
              statusType={state.statusType}
              onFileSelect={handleFileSelect}
              onImportPastedJson={handleImportPastedJson}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
