import { WorkspaceProvider } from './contexts'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <WorkspaceProvider>
      <AppRoutes />
    </WorkspaceProvider>
  )
}

export default App
