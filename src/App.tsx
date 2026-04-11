import { WorkspaceProvider } from '@/contexts'
import { AppRoutes } from '@/routes/AppRoutes'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function DocumentTitle() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('app.documentTitle')
  }, [t, i18n.language])

  return null
}

function App() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <DocumentTitle />
      <WorkspaceProvider>
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <AppRoutes />
        </div>
      </WorkspaceProvider>
    </div>
  )
}

export default App
