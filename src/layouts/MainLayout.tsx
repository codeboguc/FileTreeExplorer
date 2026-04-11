import { Outlet } from 'react-router-dom'
import { AppToolbar } from '../components/organisms/AppToolbar'
import { useWorkspace } from '../contexts'

export function MainLayout() {
  const { theme, setTheme, state, searchQuery, setSearchQuery, handleLoadSample } = useWorkspace()

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
        <Outlet />
      </div>
    </main>
  )
}
