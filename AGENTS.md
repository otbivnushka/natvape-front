# natvape — agent instructions

## Commands

| Action | Command | Notes |
|--------|---------|-------|
| dev server | `npm run dev` | Vite + React HMR |
| build | `npm run build` | runs `tsc -b` then `vite build` |
| lint | `npm run lint` | ESLint flat config, v10 |
| typecheck | `npx tsc -b --noEmit` | standalone (not in scripts) |

No test framework installed.

## Stack

- **React 19**, **React Router 7**, **Zustand 5**, **Tailwind CSS 4**
- Tailwind v4: configured via `@theme` in `src/index.css`, loaded through `@tailwindcss/vite` plugin (not PostCSS)
- **clsx** for conditional classes, **lucide-react** for icons
- TypeScript 6.0, Vite 8, ESLint 10 (flat config)
- No `@/` path alias — all imports are relative (`../../store/...`)

## Architecture

```
src/
├── components/    12 reusable UI components
├── pages/         5 routes (catalog, category-products, product-detail, cart, profile)
├── store/         5 Zustand stores (cart, wishlist, theme, toast, user)
├── data/          mock data (products.ts) — only data source, no API
├── types/         shared types
├── utils/         formatPrice.ts
```

- Routing: React Router `<BrowserRouter>` in `App.tsx`, 5 routes
- State: Zustand with `persist` middleware for cart + wishlist (localStorage)
- All data is mock/hardcoded in `src/data/products.ts` — API integration planned
- Dark mode: `.dark` class toggle on `<html>` via `useThemeStore`

## Conventions

- Components: `type { FC } from 'react'`, `interface Props`, default export
- Store selectors: fine-grained (`useStore(s => s.field)`) for re-render control
- Styles: Tailwind utility classes only, no CSS modules or styled-components
- No form library, no data-fetching library (React Query etc.)
- Category icons use emoji in `Catalog`, other icons mix lucide-react and Unicode

## Known issues

- Product data is placeholder electronics (iPhone, MacBook etc.) despite vape shop branding — needs replacement
- Categories key `accessories` is duplicated in `src/data/products.ts` (second overwrites first)
- No tests, no error boundary, no `@/` alias
