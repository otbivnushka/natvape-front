# NatVape Frontend

**Frontend for NatVape vape shop. Telegram Mini App.**

[![React](https://img.shields.io/badge/React_19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand_5-593D88)](https://github.com/pmndrs/zustand)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![React Router](https://img.shields.io/badge/React_Router_7-CA4245?logo=reactrouter)](https://reactrouter.com)

---

## Stack

- **React 19** — UI library
- **Vite 8** — bundler & dev server
- **Tailwind CSS 4** — styling via `@tailwindcss/vite` plugin
- **TypeScript** — strict mode
- **Zustand 5** — state management with `persist` middleware
- **React Router 7** — client-side routing (5 routes)
- **Leaflet + react-leaflet** — interactive address selection map
- **MUI X Date Pickers** — delivery time picker (TimeClock)
- **lucide-react** — icons
- **clsx** — conditional class names
- **dayjs** — date/time handling

---

## Features

- Product catalog with filters (brand, price, search) and sorting
- Category pages with paginated product grids
- Product detail with variant and color selection
- Cart with quantity controls, stock-aware limits
- Wishlist (heart toggle on product cards)
- Checkout: delivery method, address picker with Leaflet map, time selection
- Profile: login/logout, order history, total spent
- Dark mode — `.dark` class toggle on `<html>`
- Fixed bottom navigation bar
- JWT-based auth: token stored in Zustand with `persist` (localStorage fallback)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Dev server starts at **http://localhost:5173**. API proxy is configured in `vite.config.ts` — `/api` forwards to **http://localhost:3000** (see [NatVape Backend](https://github.com/natvape/backend)).

### Build

```bash
npm run build       # tsc -b && vite build
```

### Lint & Type Check

```bash
npm run lint        # ESLint (flat config, v10)
npx tsc -b --noEmit # standalone type check
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/          # Small UI primitives (button, input, badge, skeleton, …)
│   │   └── icons/   # SVG category icons
│   └── shared/      # Business-logic components (cart-item, product-card, map, …)
├── pages/           # 5 route pages (catalog, category-products, product-detail, cart, checkout, wishlist, profile)
├── store/           # 5 Zustand stores (auth, cart, wishlist, theme, toast)
├── types/           # Shared TypeScript types
└── api/             # API client & endpoint modules
```

---

## Test User

- **Email:** `max@natvape.ru`
- **Password:** `password123`
