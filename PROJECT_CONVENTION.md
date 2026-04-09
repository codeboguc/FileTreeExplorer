# Project structure and conventions

### What common practice suggests

React codebases usually avoid a single giant `components/` dump. Two ideas show up repeatedly:

1. **Feature-first (vertical slices)** — Group by **user-facing capability** (e.g. “file import”, “tree explorer”) so one folder owns UI, hooks, and small utils for that flow. Changes stay localized; deleting a feature is closer to deleting one tree. This aligns with **colocation** (keep modules near where they are used), which scales better than strict global layers alone. See [Thinking in React](https://react.dev/learn/thinking-in-react) for composing UI from smaller pieces, and [Colocation](https://kentcdodds.com/blog/colocation) for why proximity matters as apps grow.

2. **Optional stricter layering** — [Feature-Sliced Design](https://feature-sliced.design/) adds explicit layers (`shared` → `entities` → `features` → `widgets` → `pages` → `app`) and import rules. Useful for very large teams; this repo uses a **lighter** slice: `features/` + shared `components/` + `lib/` without full FSD ceremony.

**Naming:** Multi-word **folders** are usually `kebab-case` (`tree-explorer`). **Component files** use `PascalCase` matching the default export. **Hooks** use the `useX` prefix. **Utilities** are `camelCase` file names (`parseAndValidateTree.ts`). **Barrel files** `index.ts` re-export the public API of a folder to keep imports stable.

### Conventions used in this repo

| Area            | Rule |
| --------------- | ---- |
| **Entry**       | `main.tsx` mounts the app; `App.tsx` is routing + global shell state (theme, import state, workspace). |
| **`features/`** | Cross-route **behavior + feature UI** co-located: `hooks/`, `utils/`, `types.ts`, feature-specific `components/`, public exports in `index.ts`. No React inside `utils` when avoidable (pure functions easier to test). |
| **`components/`** | **Route-oriented or layout UI** grouped by domain: `layout/`, `explorer/`, `details/`, `file/`, `preview/`, `ui/`. Compose `features/` here rather than duplicating feature logic. |
| **`lib/`**      | **App-wide, framework-agnostic** logic (tree model, Zod validation, path resolution). Unit tests live as `*.test.ts` next to the module (e.g. `fileTree.test.ts`). |
| **`styles/`**   | Global Tailwind entry points and `@layer components` tokens (theme CSS variables). Prefer palette variables over hard-coded colors in JSX. |
| **`assets/`**   | Static images/SVGs referenced from React. **`public/`** for files served by URL path (e.g. `file-tree-sample.json`, `reference-layout.png`). |
| **Imports**     | Prefer barrels (`features/tree-explorer`, `components/layout`) for stable paths; avoid deep `../../../` chains when an `index.ts` exists. |
| **Tests**       | Jest + `ts-jest`; test files `src/**/*.test.ts`. App sources are excluded from the Jest TS project in `tsconfig.app.json`; Jest uses `tsconfig.jest.json`. |

### Directory tree (simplified)

```text
src/
  main.tsx                 # React root + providers (e.g. Router)
  App.tsx                  # Routes, theme, file-import wiring
  index.css                # Tailwind + global base
  assets/                  # Bundled static assets
  components/              # Domain/layout UI
    layout/
    explorer/
    details/
    file/
    preview/
    ui/
  features/                # Vertical slices
    file-import/
    tree-explorer/
  lib/                     # Pure TS (models, validation)
  styles/                  # Shared component / theme CSS (Tailwind layers)
public/                    # Static files by URL
```

### Further reading

- [React — Thinking in React](https://react.dev/learn/thinking-in-react)
- [Kent C. Dodds — Colocation](https://kentcdodds.com/blog/colocation)
- [Feature-Sliced Design](https://feature-sliced.design/) (stricter layered alternative)

