# natvape — agent instructions

## Commands

| Action     | Command               | Notes                           |
| ---------- | --------------------- | ------------------------------- |
| dev server | `npm run dev`         | Vite + React HMR                |
| build      | `npm run build`       | runs `tsc -b` then `vite build` |
| lint       | `npm run lint`        | ESLint flat config, v10         |
| typecheck  | `npx tsc -b --noEmit` | standalone (not in scripts)     |

No test framework installed.

## Stack

- **React 19**, **React Router 7**, **Zustand 5**, **Tailwind CSS 4**
- Tailwind v4: configured via `@theme` in `src/index.css`, loaded through `@tailwindcss/vite` plugin (not PostCSS)
- **clsx** for conditional classes, **lucide-react** for icons
- **axios** for HTTP, **@mui/x-date-pickers** + dayjs for time picker
- TypeScript 6.0, Vite 8, ESLint 10 (flat config)
- No `@/` path alias — all imports are relative (`../../store/...`)

## Architecture

```
src/
├── api/              9 modules + 7 DTO files + instance + constants + Api barrel
│   └── dto/          request/response types (auth, cart, category, order, product, profile, wishlist)
├── components/
│   ├── ui/           14 primitives (Button, Badge, Input, Skeleton…)
│   │   └── icons/    7 category icon components
│   └── shared/       17 business components (ProductCard, CartItem, OrderSummary…)
├── pages/            7 routes (catalog, category-products, product-detail, cart, checkout, wishlist, profile)
├── store/            5 Zustand stores (cart, wishlist, auth, theme, toast)
├── types/            shared domain types
├── utils/            formatPrice.ts
```

- Routing: React Router `<BrowserRouter>` in `App.tsx`, 7 routes
- State: Zustand with `persist` middleware for cart + wishlist + auth (localStorage)
- Dark mode: `.dark` class toggle on `<html>` via `useThemeStore`, CSS custom properties swap (no `dark:` prefix)
- No data-fetching library — plain `useEffect` + axios
- No form library — native `<input>` styled with Tailwind

## Architectural Rules

### Component structure

- **`ui/`** — primitive/presentational components (Button, Badge, Input, Skeleton, StarRating, etc.). No business logic, no store imports, no router hooks.
- **`shared/`** — business components that compose `ui/` primitives, read from stores, call router, or represent domain entities (ProductCard, CartItem, OrderSummary, AddressBlock, etc.).
- All components: `React.FC<Props>`, `interface XxxProps`, **named export** (`export { Name }`).
- Barrel files (`index.ts`) in each folder re-export all components.
- Pages: **default export**. All other modules: named exports only.

### API layer

- All API calls go through `import { Api } from '../api'` — never import individual API modules or `axiosInstance` directly.
- DTO types in `src/api/dto/*.dto.ts` with `Api` prefix (e.g. `ApiProduct`, `ApiCartItem`).
- Domain types in `src/types/index.ts` without prefix (e.g. `Product`, `CartItem`).
- Mapper functions (`Api.products.mapProduct`, inline `mapApiItem` in stores) convert DTO → domain.
- API modules: named async functions using `axiosInstance`, no try/catch (errors propagate up).
- Route params in `ApiRoutes` use `:id`, `:productId` placeholders — replaced with `String.replace()` at call site.

### State management (Zustand)

- Persisted stores: `create<State>()(persist(..., { name: 'key-name' }))`.
- Server-data stores: attempt API call first, silently fall back to local state on error (empty `catch {}`).
- Auth store: errors propagate — caller must handle with try/catch.
- Auto-sync on login: cart and wishlist stores subscribe to `useAuthStore.subscribe`.
- Fine-grained selectors: `useStore(s => s.field)` — never destructure the entire store.
- Store hook naming: `useXxxStore` (e.g. `useCartStore`, `useAuthStore`).

### Data flow

```
Page (useEffect) → Api.module.fn() → axios → DTO → mapProduct/mapApiItem → domain type → useState / store action → render
```

- Products are held in local `useState`, not in Zustand. Cross-page caching via `Api.productCache` (in-memory `Map`).
- Cart and wishlist items are stored in Zustand (persisted) and synced with server on login.

### Types

- Domain types in `src/types/index.ts` — shared across components, stores, and pages.
- DTO types in `src/api/dto/*.dto.ts` — mirror backend shapes with `Api` prefix.
- Request payload types (e.g. `CreateOrderDto`, `ProductsQuery`) live in DTO files.
- No inline type definitions in components — import from `../../types` or `../../api/dto/*`.

### Error handling

- API modules: no try/catch, let errors propagate.
- Store actions: `try { api; set(); return } catch { /* fallback */ }`.
- Page fetches: `.catch(() => {})` or `.catch(() => resetState())`. Silent.
- User-facing errors (login, order submit): `try/catch(e)` with `setError` or toast.
- No error boundary component.

### Routing

- React Router v7 `<BrowserRouter>` in `App.tsx`.
- Route params accessed via `useParams()`.
- API route params use `String.replace()` — independent of React Router.

### File naming

| Category    | Convention        | Example                 |
| ----------- | ----------------- | ----------------------- |
| Components  | `kebab-case.tsx`  | `primary-button.tsx`    |
| Pages       | `kebab-case.tsx`  | `category-products.tsx` |
| Stores      | `useXxxStore.ts`  | `useCartStore.ts`       |
| API modules | `kebab-case.ts`   | `product-cache.ts`      |
| DTO files   | `{entity}.dto.ts` | `product.dto.ts`        |

## Known issues

- Product data is placeholder electronics (iPhone, MacBook etc.) despite vape shop branding — needs replacement
- Categories key `accessories` is duplicated in `src/data/products.ts` (second overwrites first)
- No tests, no error boundary, no `@/` alias
