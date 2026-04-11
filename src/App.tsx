import { WorkspaceProvider } from '@/contexts'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <WorkspaceProvider>
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <AppRoutes />
        </div>
      </WorkspaceProvider>
    </div>
  )
}

export default App
