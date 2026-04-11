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

## What you get today

- **React** (19.x), **TypeScript strict**, **Vite**, **React Router v6** — routes `/`, `/tree`, and `/tree/*` for deep links to a node.
- **Import** on Home: drag-and-drop, file picker, **paste JSON**, or **Load sample** from the toolbar. Everything goes through the same `parseAndValidateTree` path and can be **stored in `localStorage`** so a refresh doesn’t wipe the tree.
- **Toolbar search** by name (with paths in the dropdown); the **query string is persisted** and survives reloads. Results are recomputed when the tree loads — there’s no separate “saved results” blob.
- **Zod**-validated tree: `folder` / `file`, optional **multiple roots**, **no duplicate sibling names**, **empty folders** allowed (`children` omitted or `[]`). Imports are wrapped under an internal **`workspace`** root for a single navigation model.
- **Explorer + details**: resizable split (large screens), keyboard navigation in the list, path breadcrumbs that navigate, and scroll nudging so deep selections stay visible.
- **Jest** unit tests around `lib/` (e.g. `fileTree`); sample and stress JSON under `public/`, invalid fixtures under `public/import-test-invalid/`.

---

## Architectural decisions

**Why a fat workspace context?**  
Import state, theme, search query, and tree selection are used across the toolbar, Home, and tree views. Rather than prop-drilling or many small contexts, **`WorkspaceProvider`** holds that cross-cutting state and coordinates things like “after a successful import on Home, go to `/tree`”. It’s a deliberate trade-off: simpler wiring for an app this size, but the provider will grow if you keep adding global concerns.

**Synthetic `workspace` root**  
Real JSON can be one root or an array of roots. The app always normalises to a single folder named `workspace` and hangs imported nodes under it. URLs and `fullPath` values use that prefix internally; the UI usually shows paths **without** the `workspace/` prefix (`formatNodePathForDisplay`). That keeps routing and selection code uniform at the cost of “path in the app ≠ raw JSON root name” unless you explain it.

**Features vs shared components**  
**`features/tree-explorer`** and **`features/file-import`** own behaviour and feature UI. **`components/`** is split roughly into atoms → molecules → organisms for reusable pieces that aren’t tied to one feature. **`services/`** is only browser I/O (e.g. `localStorage`, fetching the sample JSON). **`lib/fileTree.ts`** stays React-free so it’s easy to test.

**URLs for deep links**  
Node paths use a **splat** route (`tree/*`) with **per-segment encoding** so paths stay readable in the address bar and match how the tree is walked when resolving a selection.

---

## If I had more time

- **Automated checks in CI** (install, lint, test, build on every push/PR) so regressions are caught without thinking about it.
- **End-to-end tests** (e.g. Playwright) for “import → tree → click node → URL updates” — unit tests don’t replace that confidence.
- **Virtualised tree** (or windowing) for huge JSON: today the explorer flattens visible rows into a list; it’s fine for normal trees but won’t scale forever.
- **Richer file preview** if JSON ever carried content or snippets (syntax highlighting, diff, etc.).
- **Accessibility** closer to a real tree view (`role="tree"`, roving tabindex, `aria-activedescendant`) instead of a list of buttons — keyboard support exists, but screen-reader semantics could be tighter.
- **Error boundary** around routed content so one render error doesn’t blank the whole shell.

---

## Known limitations

- **`localStorage`**: large pasted/uploaded JSON can hit quota or private-mode restrictions; failures are handled quietly. There’s no hard size limit or user-facing quota message.
- **Search** persists the **query**, not a snapshot of hits; if the tree changes, old queries might return different or empty results until the user searches again.
- **No authentication or multi-user** — it’s a single-browser, local tool by design.
- **Tree rendering** is not virtualised; very deep or very wide trees may feel heavy compared to a file manager backed by native widgets.
- **English UI** only; the original brief was in Polish, but the product copy is in English for consistency with code and comments here.

For a longer rationale on folder layout and naming, see **`PROJECT_CONVENTION.md`**.
