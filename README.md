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

## Manual verification

Smoke-tested locally (dev server and `npm run preview`) on:

- **OS:** Windows 11 (x64)
- **Browser:** Google Chrome (current stable channel)

Other browsers and operating systems were not part of this manual pass.

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
- **Internationalisation**: **`i18next`** + **`react-i18next`**, **English** as default, **Polish** as an additional language (`src/locales/en.json`, `pl.json`), toolbar language switcher, and persisted choice via `languageLocalStorage`.
- **Theme without flash**: **`public/theme-init.js`** is loaded from **`index.html`** before the first paint so `theme-light` / `theme-dark` match `localStorage`; the in-app theme control stays in sync with the same key.
- **Jest** unit tests around `lib/` (e.g. `fileTree`); sample and stress JSON under `public/`, invalid fixtures under `public/import-test-invalid/`.

---

## Architectural decisions

**Why a fat workspace context?**  
Import state, theme, search query, and tree selection are used across the toolbar, Home, and tree views. Rather than prop-drilling or many small contexts, **`WorkspaceProvider`** holds that cross-cutting state and coordinates things like “after a successful import on Home, go to `/tree`”. It’s a deliberate trade-off: simpler wiring for an app this size, but the provider will grow if you keep adding global concerns — at that point, splitting contexts or using a small state machine for import would be reasonable.

**i18n**  
UI copy lives in JSON resources; `src/i18n/config.ts` initialises i18next before the React tree. Some import paths call `i18n.t()` from feature code (e.g. invalid JSON messages), which is convenient but couples parsing helpers to the i18n singleton.

**Early theme script**  
The inline theme bootstrap was moved to **`public/theme-init.js`** so HTML stays small and the rule “read `filetree-explorer:theme` → set `<html>` class” stays next to **`THEME_STORAGE_KEY`** in `themeLocalStorage.ts` (keep those in sync when renaming).

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
- **Full i18n for validation**: stable error codes from **`lib/fileTree`** (or Zod) and **`t()`** only in the UI/hook layer, so Polish UI doesn’t mix with English-only schema messages, and parsers stay usable without initialising i18n (e.g. tests, workers).
- **Locale-aware numbers** for sizes and counts (**`Intl.NumberFormat`**) aligned with the active UI language instead of fixed `"."` / `","` rules in **`formatBytes`**.

---

## More testing (if I had more time)

- **Broader manual matrix:** Firefox, Safari, and Microsoft Edge on Windows; at least one smoke run on **macOS** and a mainstream **Linux** desktop to catch layout, font, and `localStorage` quirks.
- **Viewport and input:** repeatable checks for narrow/mobile widths, keyboard-only flows, and high zoom levels (not just a single desktop resolution).
- **Automated coverage beyond Jest:** component tests (e.g. React Testing Library) for import status and toolbar search; contract tests for URL encoding vs `lib/fileTree` helpers so routing and parsing stay aligned.
- **Accessibility tooling:** axe or similar in CI, plus a short screen-reader pass on tree navigation and the import panel.
- **Visual regression** (e.g. Chromatic, Lost Pixel) for theme light/dark and both locales so CSS changes do not slip through unnoticed.
- **Performance / stress:** scripted runs against `file-tree-stress.json` (or larger) to measure time-to-interactive and scroll cost, as a guard once virtualisation exists.

---

## Known limitations

- **`localStorage`**: large pasted/uploaded JSON can hit quota or private-mode restrictions; failures are handled quietly. There’s no hard size limit or user-facing quota message. Parsing very large JSON in the main thread can still stress the tab (acceptable for an internal tool, but not “hardened”).
- **Search** persists the **query**, not a snapshot of hits; if the tree changes, old queries might return different or empty results until the user searches again.
- **No authentication or multi-user** — it’s a single-browser, local tool by design.
- **Tree rendering** is not virtualised; very deep or very wide trees may feel heavy compared to a file manager backed by native widgets.
- **Languages**: the UI is available in **English** (default) and **Polish**. **Zod / tree validation error strings** from **`validateTreeJson`** are still **English**, so a Polish UI can show mixed-language messages until those errors are mapped through i18n.
- **Localisation detail**: **`formatBytes`** (and similar) do not use **`Intl.NumberFormat`**; decimal separators are not tied to the active locale.
- **URL vs context**: node selection is driven by the route on **`/tree/*`** with canonical redirects in **`TreeNodePage`**; further features should keep URL and **`WorkspaceProvider`** selection in sync.

For a longer rationale on folder layout and naming, see **`PROJECT_CONVENTION.md`**.
