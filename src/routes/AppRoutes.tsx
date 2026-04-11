import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { TreeNodePage } from '../pages/TreeNodePage'
import { TreePage } from '../pages/TreePage'
import { RequireTreeData } from './RequireTreeData'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<RequireTreeData />}>
          <Route path="tree" element={<TreePage />} />
          <Route path="tree/:nodePath" element={<TreeNodePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
