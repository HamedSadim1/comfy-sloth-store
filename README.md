# Comfy Sloth Store

A modern e-commerce storefront refactored around single sources of truth,
strict type safety, and a fully gated commit pipeline. Built with React 19,
TypeScript, Vite, Zustand, TanStack Query, Auth0, and Stripe.

## ✨ Features

- **Functional React 19** with hooks, lazy-loaded routes, code-split pages
- **Strict TypeScript** end-to-end (`noUncheckedIndexedAccess`,
  `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`,
  `noFallthroughCasesInSwitch`)
- **`unknown` over `any`** — explicit narrowing helpers in the API client
- **TanStack Query v5** with infinite queries for the paginated catalogue
- **Centralised constants** (`src/constants.tsx`) — no scattered string
  literals for network paths, storage keys, env vars, images, or commerce
  constants
- **Hook-driven state**: `useStripePayment`, `useComfys`, `useCategoryList`,
  `useFilterProducts`, `useFeaturedProducts` live alongside Zustand stores
- **Generic API client** with axios interceptors, auth-token injection,
  and uniform error handling
- **Auth0** for authentication + **Stripe** for payments (client + server
  intent creation via Netlify / Vercel Functions)
- **Responsive, themed UI** with styled-components, custom surface cards,
  shimmer skeletons, gradient typography, and trust strips

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Build-time memoization:** React Compiler (`babel-plugin-react-compiler`)
- **Styling:** styled-components (CSS-in-JS, shared mixins in `src/styles/`)
- **State management:** Zustand (`store.ts`, `uiStore.ts`,
  `SingleProductStore.ts`) + React Context (`CartContext`, `UserContext`)
- **Data fetching:** TanStack Query v5 + `@tanstack/react-query-devtools`
  + axios client
- **Routing:** React Router v7 (lazy-loaded routes)
- **Auth:** Auth0 React SDK
- **Payments:** Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`,
  server-side `stripe` SDK)
- **Deploy:** dual-target — Netlify (`netlify.toml`) + Vercel
  (`vercel.json`); SPA history-mode fallback covered in both configs
- **Quality:** ESLint (TypeScript, React Hooks, React Refresh) + strict
  tsc + Husky pre-commit gate

## 📁 Project Structure

```text
src/
├── App.tsx                      # Router shell with lazy-loaded pages
├── main.tsx                     # Entry point + Auth0 + React Query providers
├── constants.tsx                # Single source of truth: APP, NETWORK,
│                                # STORAGE_KEYS, ENV, IMAGES, COMMERCE
├── components/                  # Reusable UI components + barrel index.ts
│                                # (Button, Eyebrow, Loading, OrderSummary,
│                                # StripeCheckout, pages, hero, sidebar, ...)
├── Context/                     # Global React context providers
│                                # (CartContext, UserContext)
├── hooks/                       # Custom React hooks (data fetching,
│                                # derived state, payment state machine)
├── services/                    # apiClient.ts (axios wrapper + interceptors
│                                # + APIError + narrowApiErrorPayload)
├── styles/                      # Shared styled-components primitives
├── types/                       # Shared domain types (Products,
│                                # SingleProduct, Category, SortOption, ...)
├── utils/                       # Pure helpers (formatPrice, mappers, …)
├── pages/                       # Route-level pages (lazy-loaded via App.tsx)
├── data/                        # Legacy barrel: color.ts + index.ts (~unused)
├── store.ts                     # Zustand: filter / sort / view-mode
├── uiStore.ts                   # Zustand: sidebar / nav UI state
└── SingleProductStore.ts        # Zustand: per-product amount / image picker
```

`api/` and `functions/` mirror equivalent server-side Stripe payment-intent
stubs (Netlify vs. Vercel).

## 🏃 Getting Started

### Prerequisites

- **Node.js 22** (Netlify build, pinned in `netlify.toml`); 20+ works locally.
- **npm 9+** (or `pnpm` / `yarn`, but `package-lock.json` ships with npm)

### Installation

```bash
git clone https://github.com/HamedSadim1/comfy-sloth-store.git
cd comfy-sloth-store
npm install
```

Create your own `.env` in the repo root with the variables listed below,
then:

```bash
npm run dev
```

Open <http://localhost:5173>.

### Environment Variables

The client reads from `import.meta.env` via the `ENV` keys in
`src/constants.tsx`. Set the following in `.env`:

```env
VITE_REACT_APP_AUTH0_DOMAIN=your_auth0_domain
VITE_REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

For server-side payment intent creation (`api/` and `functions/`):

```env
STRIPE_SECRET_KEY=sk_test_...
```

## 🧰 Available Scripts

| Script              | Purpose                                                              |
|---------------------|----------------------------------------------------------------------|
| `npm run dev`       | Start the Vite dev server                                            |
| `npm run build`     | Full project build (`tsc && vite build` — emits incremental cache)  |
| `npm run typecheck` | Dual-project tsc (`tsconfig.json` + `tsconfig.node.json`) — no emit |
| `npm run lint`      | ESLint with `--max-warnings 0` over `src/**/*.{ts,tsx}`              |
| `npm run preview`   | Serve the built `dist/` for local inspection                        |
| `npm run prepare`   | Husky install hook (runs automatically on `npm install`)            |

Full command strings live in `package.json`. The lint script additionally
runs with `--report-unused-disable-directives`, which means **every
`// eslint-disable` comment is itself a lint floor**: silently disabling
a rule fails the gate. Use `// eslint-disable-next-line` for inline
disables and remove them as soon as the upstream issue is fixed.

## 🛡️ Quality Gates

Every commit is gated on three checks via Husky + lint-staged (see
`.husky/pre-commit`):

1. **`lint-staged`** — runs `eslint --fix --max-warnings 0` on staged
   `*.{ts,tsx,js,jsx}` files. Auto-fixes what's fixable, blocks the
   commit on residual warnings.
2. **Project-wide typecheck** (`npm run typecheck`) — catches drift across
   the whole codebase that per-file ESLint cannot see (e.g. an added `?.`
   in one file breaking a downstream consumer). Strict-mode strength:
   `noUncheckedIndexedAccess` + `noImplicitReturns`. Plus the
   `--report-unused-disable-directives` flag forces lint-disable
   comments to be exercised.
3. **Project-wide lint** (`npm run lint`) — safety net for un-staged
   files that the staged subset depends on, with the same `--max-warnings
   0` floor.

### Bypass env vars (last-resort only)

```bash
SKIP_TYPECHECK=1 git commit ...   # skip the typecheck gate
SKIP_LINT=1      git commit ...   # skip the project-wide lint gate
```

Use only for genuine WIP. The committed history stays clean because each
gate-included commit is what reviewers see.

## 🚀 Deployment

| Target  | Config file    | SPA fallback                                      |
|---------|----------------|---------------------------------------------------|
| Netlify | `netlify.toml` | `[[redirects]] from = "/*" to = "/index.html"`    |
| Vercel  | `vercel.json`  | `rewrites` block routing `/(.*)` to `/index.html` |

Both configs coexist intentionally — there's no `public/_redirects` to
keep them in sync with. Netlify functions live in `functions/`, the
parallel Vercel equivalent lives in `api/` (TypeScript server handlers).

## 📝 Recent Improvements

A repo-wide unused-code audit surfaced several categories of drift — dead
exports, scattered hardcoded values, redundant config files, loose types —
that triggered this series of refactors across multiple surface areas:

### Single sources of truth

- ✅ All hardcoded values moved to `src/constants.tsx` (APP, NETWORK,
  STORAGE_KEYS, ENV, IMAGES, COMMERCE) with `as const` namespaces + flat
  `links` / `services` arrays.
- ✅ Legacy typo file `src/utils/Contants.tsx` removed; all imports rewired.

### Strictness

- ✅ `noUncheckedIndexedAccess` + `noImplicitReturns` adopted in
  `tsconfig.json`. Codebase already operated inside the strictness
  envelope (`.map` / `.filter` / `.find` / `?.` / `flatMap` patterns);
  the flags act as a forward-looking safety net.

### Error handling

- ✅ `APIError.data` is `unknown`, narrowed via the exported
  `narrowApiErrorPayload(value: unknown): ApiErrorPayload` helper.
  Upstream error blobs can no longer leak into renders or logs as `any`.

### Hook extraction

- ✅ `useStripePayment` hook owns the 5-state Stripe payment machine
  (`succeeded`, `error`, `processing`, `disabled`, `clientSecret`) plus
  the intent-creation effect. `StripeCheckout.tsx` is a thin
  orchestrator.

### Dead-code pruning

- ✅ Unused exports removed (`interface CartDetail`,
  `interface APIResponse<T>`, plus the orphan `src/styles/surface.ts`
  and the legacy `src/utils/Contants.tsx`).
- ✅ Redundant `public/_redirects` removed (the SPA fallback is covered
  by both `netlify.toml` and `vercel.json` in their native syntaxes).

### Commit hygiene

- ✅ Pre-commit gate enforces typecheck + lint project-wide (see
  "Quality Gates" above).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your change — pre-commit hooks will run typecheck + lint
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original project inspired by John Smilga's React course
- Icons via [react-icons](https://react-icons.github.io/react-icons/)
- UI styled with [styled-components](https://styled-components.com/)
- Hosted on Netlify + Vercel

---

Built with React 19, TypeScript, and modern web technologies.
