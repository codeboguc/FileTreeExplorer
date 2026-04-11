# Project structure and conventions

### What common practice suggests

React codebases usually avoid a single giant `components/` dump. Two ideas show up repeatedly:

1. **Feature-first (vertical slices)** — Group by **user-facing capability** (e.g. “file import”, “tree explorer”) so one folder owns UI, hooks, and small utils for that flow. Changes stay localized; deleting a feature is closer to deleting one tree. This aligns with **colocation** (keep modules near where they are used), which scales better than strict global layers alone. See [Thinking in React](https://react.dev/learn/thinking-in-react) for composing UI from smaller pieces, and [Colocation](https://kentcdodds.com/blog/colocation) for why proximity matters as apps grow.

2. **Optional stricter layering** — [Feature-Sliced Design](https://feature-sliced.design/) adds explicit layers (`shared` → `entities` → `features` → `widgets` → `pages` → `app`) and import rules. Useful for very large teams; this repo combines **Atomic-style `components/`** (atoms → molecules → organisms) with **`features/`** vertical slices and **`pages/`** / **`routes`** for routing.

**Naming:** Multi-word **folders** are usually `kebab-case` (`tree-explorer`). **Component files** use `PascalCase` matching the default export. **Hooks** use the `useX` prefix. **Utilities** are `camelCase` file names (`parseAndValidateTree.ts`). **Barrel files** `index.ts` re-export the public API of a folder to keep imports stable.

### Conventions used in this repo

| Area            | Rule |
| --------------- | ---- |
| **Entry**       | `main.tsx` mounts the app with `BrowserRouter`; `App.tsx` wraps `WorkspaceProvider` + `AppRoutes`. |
| **`contexts/`** | App-wide React Context (workspace: theme, JSON import state, tree selection, search). Hooks such as `useWorkspace` live next to the context definition. |
| **`routes/`**   | Route configuration (`AppRoutes.tsx`) and layout guards (`RequireTreeData.tsx` — tree must be loaded). |
| **`pages/`**    | Route-level view components only (`HomePage`, `TreePage`, `TreeNodePage`); compose features and molecules, minimal logic. |
| **`layouts/`**  | Page shells with `<Outlet />` (e.g. `MainLayout` — toolbar + content area). |
| **`features/`** | Business behavior + feature UI: `file-import/` (hooks, parsers), `tree-explorer/` (tree UI, explorer panel, details, workspace view). No React inside `utils` when avoidable. |
| **`components/`** | **Shared UI** by Atomic Design tier: `atoms/` (primitives), `molecules/` (composite controls, no tree domain), `organisms/` (toolbar, panel shell). Molecules avoid importing `features/`; use local UI types (e.g. `ImportStatusTone`) where needed. |
| **`services/`** | Thin adapters for I/O (e.g. `loadSampleTreeJson.ts`). |
| **`lib/`**      | **App-wide, framework-agnostic** logic (tree model, Zod validation, path resolution). Unit tests live as `*.test.ts` next to the module (e.g. `fileTree.test.ts`). |
| **`styles/`**   | Global Tailwind entry points and `@layer components` tokens (theme CSS variables). Prefer palette variables over hard-coded colors in JSX. |
| **`assets/`**   | Static images/SVGs referenced from React. **`public/`** for files served by URL path (e.g. `file-tree-sample.json`). |
| **Imports**     | Prefer barrels (`features/tree-explorer`, `contexts`, `components/organisms`) for stable paths; avoid deep `../../../` chains when an `index.ts` exists. |
| **Tests**       | Jest + `ts-jest`; test files `src/**/*.test.ts`. App sources are excluded from the Jest TS project in `tsconfig.app.json`; Jest uses `tsconfig.jest.json`. |

### Directory tree (simplified)

```text
src/
  main.tsx                 # React root + BrowserRouter
  App.tsx                  # WorkspaceProvider + AppRoutes
  index.css                # Tailwind + global base
  assets/                  # Bundled static assets
  components/
    atoms/                 # Smallest UI primitives (extend as needed)
    molecules/             # e.g. JsonImportDropzone, DetailsMetaGrid, DetailsPathLinks
    organisms/             # e.g. AppToolbar, Panel, PreviewPanel
  contexts/                # WorkspaceContext, WorkspaceProvider, useWorkspace
  features/
    file-import/
    tree-explorer/         # TreeExplorer, ExplorerPanel, details, TreeWorkspaceView
  layouts/                 # MainLayout
  pages/                   # HomePage, TreePage, TreeNodePage
  routes/                  # AppRoutes, RequireTreeData
  services/                # e.g. loadSampleTreeJson
  lib/                     # Pure TS (models, validation)
  styles/                  # Shared component / theme CSS (Tailwind layers)
public/                    # Static files by URL
```

### Further reading

- [React — Thinking in React](https://react.dev/learn/thinking-in-react)
- [Kent C. Dodds — Colocation](https://kentcdodds.com/blog/colocation)
- [Feature-Sliced Design](https://feature-sliced.design/) (stricter layered alternative)
- [Atomic Design](https://atomicdesign.bradfrost.com/) (atoms / molecules / organisms)
