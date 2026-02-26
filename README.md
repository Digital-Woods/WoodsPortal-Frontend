# WoodsPortal Frontend Customization

A React-based Single Page Application (SPA) built to extend the native HubSpot Membership Portal with full customization capabilities.

This project integrates seamlessly with **[WoodsPortal](https://woodsportal.digitalwoods.io)** — DigitalWoods’ hosted, enterprise-grade membership portal for HubSpot — enabling advanced UI control, routing flexibility, and scalable architecture on top of HubSpot infrastructure.

For feature requests: **[dev@digitalwoods.io](mailto:dev@digitalwoods.io)**

---

## 🚀 Overview

* ⚛️ React SPA architecture
* 🧭 File-based routing (TanStack Router)
* 📡 Flexible data fetching (Loaders / React Query)
* 🧠 Lightweight state management (TanStack Store)
* 🎨 Tailwind CSS styling
* 🌍 Environment-based configuration
* ☁ Designed for HubSpot module deployment

---

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
├── routes/            # File-based route definitions
├── layouts/           # Layout wrappers
├── state/             # Global state management
├── utils/             # Helper functions
├── data/
│   ├── client/        # Axios API configuration
│   ├── hubSpotData.ts
│   └── defaultData.ts
├── assets/            # CSS, icons, static files

public/
├── module.html        # HubSpot module HTML structure
└── fields.json        # HubSpot module field definitions
```

---

## 🌍 Environment Configuration

Environment files:

* `.env.development`
* `.env.production`
* `.env.staging`

Start from the example files:

```
.env.development.example
.env.production.example
.env.staging.example
```

Rename as needed.

---

### Using T3Env (Type-Safe Environment Variables)

Add variables in:

```
src/env.mjs
```

Usage:

```ts
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```

---

## 🧱 Layout Architecture

Layouts define structural wrappers for pages.

| Layout             | Purpose                            |
| ------------------ | ---------------------------------- |
| AppLayoutWrapper   | Root wrapper                       |
| DefaultLayout      | Standard authenticated pages       |
| AuthLayout         | Login / Register / Forgot password |
| UnauthorizedLayout | Access denied / permission errors  |

Root layout file:

```
src/routes/__root.tsx
```

Anything added here appears globally.

---

## 🧭 Routing (TanStack Router)

This project uses file-based routing.

Routes are managed inside:

```
src/routes/
```

To add a new route:

1. Create a new file inside `src/routes`
2. TanStack automatically registers it

### SPA Navigation

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/about">About</Link>
```

---

## 📡 Data Fetching

### Option 1 — Route Loaders (Recommended for page-level data)

```tsx
loader: async () => {
  const response = await fetch("/api/data");
  return response.json();
}
```

Access data:

```tsx
const data = route.useLoaderData();
```

✔ Loads before render
✔ Cleaner page-level architecture

---

### Option 2 — React Query (For dynamic / interactive data)

Install:

```bash
yarn add @tanstack/react-query @tanstack/react-query-devtools
```

Setup in `main.tsx`:

```tsx
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>
```

Use:

```tsx
const { data } = useQuery({
  queryKey: ["people"],
  queryFn: fetchPeople,
});
```

✔ Caching
✔ Background refetch
✔ Mutations

---

## 🧠 State Management (TanStack Store)

Install:

```bash
yarn add @tanstack/store
```

### Basic Store

```tsx
const countStore = new Store(0);
const count = useStore(countStore);
```

### Derived Store

```tsx
const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
```

✔ Lightweight
✔ Reactive
✔ Derived state support

---

## 🎨 Styling

This project uses **Tailwind CSS** for utility-first styling.

---

## 🧹 Linting & Formatting

Tools used:

* ESLint
* Prettier
* TanStack ESLint Config

Available scripts:

```bash
yarn lint
yarn format
yarn check
```

---

## 🛠 Development

Install dependencies:

```bash
yarn install
```

Start development server:

```bash
yarn start
```

---

## 🏗 Production Build

```bash
yarn build
```

---

## ☁ HubSpot Deployment

Initialize HubSpot CLI:

```bash
hs init
```

Upload module:

```bash
hs upload
```

---

## 👀 Watch Mode (Local HubSpot Development)

```bash
hs init
yarn watch
```

This syncs local changes directly to HubSpot.

---

## 🧩 Dynamic Routes

* `dynamicPage/$listComponent.tsx` → Fetch & render object lists
* `dynamicPage/$objectName/` → Render individual object pages
* `association/` → Object relationships
* `auth/` → Authentication routes

---

## 🗑 Demo Files

Files prefixed with:

```
demo*
```

Can be safely deleted.

---

## 🧠 Architecture Philosophy

This frontend is designed for:

* Modular scalability
* HubSpot-native deployment
* Enterprise-level customization
* Clear separation of routing, layout, and data
* Long-term maintainability

---

## 📩 Support

For feature requests or enterprise customization inquiries:

**[dev@digitalwoods.io](mailto:dev@digitalwoods.io)**

