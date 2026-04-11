# Project structure and conventions

This note is for anyone opening the repo for the first time: how folders are laid out, why it looks this way, and what we try to keep consistent.

## Why not one big `components/` folder?

Most React teams eventually move away from dumping everything into a single `components` directory. Two patterns come up again and again:

**Vertical slices (feature-first)** — You group code by what the user can do: “import JSON”, “explore the tree”, and so on. One folder owns the UI, hooks, and small helpers for that flow. When you change a feature, you stay in one part of the tree; when you delete it, you’re not hunting across the whole app. That idea is close to **colocation**: keep files near where they’re used. It tends to scale more calmly than rigid global layers alone. The official [Thinking in React](https://react.dev/learn/thinking-in-react) guide is a good mental model for breaking UI into pieces; [Colocation](https://kentcdodds.com/blog/colocation) spells out why “nearby code” matters as things grow.

**Stricter layering (optional)** — [Feature-Sliced Design](https://feature-sliced.design/) goes further: fixed layers (`shared` → `entities` → `features` → …) and rules about who may import whom. That pays off for large teams and long-lived products. This project is smaller: we mix **Atomic Design–style** shared UI (`atoms` → `molecules` → `organisms`) with **`features/`** slices and **`pages/`** + **`routes/`** for routing. It’s a pragmatic middle ground.

## Naming

Nothing exotic: multi-word **directories** are `kebab-case` (e.g. `tree-explorer`). **React components** live in `PascalCase` files that match the default export. **Hooks** start with `use`. **Plain utilities** use `camelCase` filenames (`parseAndValidateTree.ts`). Folders that expose a small public surface often have an **`index.ts`** barrel so imports stay stable (`@/features/tree-explorer` instead of deep relative paths).

## How this repo is organised

**Entry** — `main.tsx` mounts the app inside `BrowserRouter`. `App.tsx` wraps everything in `WorkspaceProvider` and renders `AppRoutes`.

**`contexts/`** — One main app context today: workspace theme, JSON import state, selected tree node, and the toolbar search string. Files: `workspaceContext.ts`, `WorkspaceProvider.tsx`, `useWorkspace.ts`, plus a barrel `index.ts`.

**`routes/`** — `AppRoutes.tsx` defines routes; `RequireTreeData` redirects you home if you hit tree routes without loaded data.

**`pages/`** — Thin route targets: `HomePage`, `TreePage`, `TreeNodePage`. They compose layouts, features, and shared components instead of hiding lots of logic.

**`layouts/`** — Shells with `<Outlet />`. `MainLayout` is the usual chrome: toolbar plus the scrollable main area.

**`features/`** — Where behaviour lives. `file-import/` has hooks and validation helpers; `tree-explorer/` has the tree list, explorer panel, details side, and the split workspace view. We keep `utils` inside features free of React when we can, so the same logic is easier to test and reason about.

**`components/`** — Shared UI only, roughly by Atomic tier. **Atoms** are small primitives (buttons, labels, status tones, hidden file input, etc.). **Molecules** combine them (toolbar search, JSON drop/paste zone, path links in the details panel). **Organisms** are larger shells (toolbar, `Panel`, `PreviewPanel`, and similar). Molecules normally shouldn’t depend on `features/`, except where we deliberately wire a flow—`JsonImportDropzone` pulling in `importSourceLabels` is that kind of exception.

**`services/`** — Thin adapters to the outside world: fetching the sample JSON, reading and writing `localStorage` for the tree, search query, theme, and UI language. No heavy domain rules here—that stays in `lib/` or `features/`.

**`i18n/`** and **`locales/`** — i18next bootstrap (`config.ts`, typings) and JSON translation files. Initialisation runs before the React tree so hooks like `useTranslation` work everywhere.

**`lib/`** — Framework-agnostic stuff: tree model, Zod validation, path encoding, `formatBytes`. Co-located **`*.test.ts`** files use Jest. There’s a small `lib/index.ts` barrel for tiny exports; bigger modules like `fileTree.ts` are imported by path when that’s clearer.

**`styles/`** — Tailwind entrypoints and component-level CSS (theme variables, panels, tree, toolbar). Prefer design tokens / CSS variables over random hex values in JSX.

**`assets/`** — Static files bundled through Vite (images, SVGs referenced from components). Anything loaded by URL (sample JSON, `theme-init.js`, icons) sits under **`public/`**.

**Imports** — When a folder exports a barrel, use it (`@/contexts`, `@/features/tree-explorer`, …) so you don’t chain `../../../`. Same idea for `lib` when you only need `formatBytes`-level exports.

**Tests** — Jest with `ts-jest`. Test files match `src/**/*.test.ts`. App TypeScript is `tsconfig.app.json`; Jest uses `tsconfig.jest.json` so test compilation stays separate.

## Directory sketch

```text
src/
  main.tsx              # Root + router
  App.tsx               # Provider + routes
  index.css             # Tailwind + base styles
  assets/
  components/           # atoms, molecules, organisms
  contexts/
  features/
    file-import/
    tree-explorer/
  i18n/
  layouts/
  locales/              # en.json, pl.json, …
  pages/
  routes/
  services/
  lib/
  styles/
public/                 # Served as static URLs
```

## Further reading

- [Thinking in React](https://react.dev/learn/thinking-in-react)  
- [Colocation — Kent C. Dodds](https://kentcdodds.com/blog/colocation)  
- [Feature-Sliced Design](https://feature-sliced.design/) (heavier structure, good reference)  
- [Atomic Design](https://atomicdesign.bradfrost.com/) (atoms / molecules / organisms)
