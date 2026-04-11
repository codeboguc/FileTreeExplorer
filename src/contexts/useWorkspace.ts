import { WorkspaceContext, type WorkspaceContextValue } from '@/contexts/workspaceContext'
import { useContext } from 'react'

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return ctx
}
