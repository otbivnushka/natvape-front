# NatVape Frontend

**Telegram Mini App — online store for NatVape.**

[![React](https://img.shields.io/badge/React_19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand_5-593D88)](https://github.com/pmndrs/zustand)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![React Router](https://img.shields.io/badge/React_Router_7-CA4245?logo=reactrouter)](https://reactrouter.com)

---

## Stack

- **React 19** + **React Router 7** — SPA with 7 pages
- **Zustand 5** — state management (persist via localStorage)
- **Tailwind CSS 4** — styling (`@tailwindcss/vite`, `@theme` in CSS)
- **TypeScript 6** — strict mode
- **axios** — HTTP client
- **@telegram-apps/sdk** — Telegram Mini App integration
- **Leaflet + react-leaflet** — map in order detail modal
- **lucide-react** — icons, **clsx** — conditional classes

---

## Features

- Product catalog with filters (brand, price, search) and sorting
- Category pages with pagination
- Product detail: variants, colors, rating, quantity
- Cart with stock-aware limits
- Wishlist (heart toggle on product card)
- Checkout: pickup / delivery, time preference, comment
- Profile: Telegram auth, order history, total spent
- Dark mode (`.dark` on `<html>`)
- Telegram Mini App: BackButton, enableClosingConfirmation
- Token kept in Zustand memory (not localStorage) — works around Telegram WebView bugs

---

## Quick Start

```bash
npm install
npm run dev          # Vite dev server
```

API base URL is set via `VITE_API_URL` env variable. Dev server proxies `/api → localhost:3000`.

### Build & Checks

```bash
npm run build        # tsc -b && vite build
npm run lint         # ESLint flat config v10
npx tsc -b --noEmit  # type check
```

---

## Structure

```
src/
├── api/              # 15 modules + DTOs + instance + barrel
│   └── dto/          # request/response types (auth, cart, order, product, …)
├── components/
│   ├── ui/           # primitives (Button, Badge, Input, Skeleton, StarRating…)
│   │   └── icons/    # SVG category icons
│   └── shared/       # business components (ProductCard, CartItem, OrderSummary…)
├── hooks/            # useScrollToTop, useTelegramBackButton
├── pages/            # 7 pages (catalog, category-products, product-detail, cart, checkout, wishlist, profile)
├── store/            # 5 Zustand stores (auth, cart, wishlist, theme, toast)
├── types/            # domain types
└── utils/            # formatPrice, geocode
```

---

## Auth

- Telegram-only (initData → backend)
- Token held in Zustand memory, read via `initAuthInterceptor`
- On every App mount — `retrieveRawInitData()` → fresh token
- No localStorage for the token (Telegram WebView iOS is unreliable)

---

## Notes

- **lint + typecheck** must pass before any commit
- No `@/` alias — all imports are relative
- No tests

---

## Bot

[![Telegram Mini App](https://img.shields.io/badge/Telegram_Mini_App-24A1DE?logo=telegram&logoColor=white)](https://t.me/natvape_bot)
