import { useWorkspace } from '@/contexts'
import { Navigate, Outlet } from 'react-router-dom'

/** Layout route: tree routes require a validated JSON tree in workspace state. */
export function RequireTreeData() {
  const { state } = useWorkspace()

  if (!state.treeRoot) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
