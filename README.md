# FileTree Explorer

**Repository:** [github.com/codeboguc/FileTreeExplorer](https://github.com/codeboguc/FileTreeExplorer)

Internal-style **file tree explorer** for JSON that describes a directory layout. Paste or upload JSON, browse an expandable tree, open node details, and navigate with **React Router** URLs.

Clone (HTTPS or SSH):

```bash
git clone https://github.com/codeboguc/FileTreeExplorer.git
# or
git clone git@github.com:codeboguc/FileTreeExplorer.git
```

## Requirements

- **Node.js** 18+

## Install and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start Vite dev server with HMR              |
| `npm run build`        | Typecheck (`tsc -b`) and production build   |
| `npm run preview`      | Serve the production build locally          |
| `npm run lint`         | ESLint (type-aware rules on app code)       |
| `npm run format`       | Prettier: format the repo (`--write`)       |
| `npm run format:check` | Prettier: verify formatting (`--check`)     |
| `npm run test`         | Jest unit tests (e.g. JSON tree validation) |
| `npm run test:watch`   | Jest in watch mode                          |

**Prettier** uses `.prettierrc.json` and `prettier-plugin-organize-imports` (import organize on format). Ignores are listed in `.prettierignore`.

## What this project includes (short)

- **React 18+**, **TypeScript (strict)**, **Vite**, **React Router v6** (`/`, `/tree`, `/tree/:nodePath`).
- **Tailwind CSS v4** with shared UI classes in `src/styles/base-components.css` and **light/dark** themes (CSS variables).
- **Zod** validation for imported JSON: `folder` / `file` nodes, optional **array of roots**, **no duplicate names** among siblings, then a synthetic **`workspace`** root wrapping imports.
- **Explorer** with icons (incl. empty folders), keyboard navigation, and **details** panel with child links that update the route.
- **Jest** + **ts-jest** for tests (`src/**/*.test.ts`); sample tree: `public/file-tree-sample.json`.

## If we had more time

- Full-text **search** across the tree with persisted results.
- Richer **preview** (e.g. syntax-highlighted file content from metadata).
- Stricter accessibility (e.g. `aria-activedescendant` for the tree).
