## Summary

End-to-end UI redesign of the Comfy Sloth storefront, grouped into the following themes:

### Data layer
- Replaced the static `productsData` / `category` / `company` seed files with a live API pipeline (dummyjson.com) plus a new `src/utils/mappers.ts` module that shapes remote payloads into our domain types.
- Migrated `ProductContext` off `axios` + `useEffect` onto the new react-query-backed `useComfys` infinite hook; the consumers still see a flat `Products[]` via `useMemo`, keeping the existing `featuredProducts` derivation.

### Loading & feedback
- Added `ProductGridSkeleton`, `SingleProductSkeleton` and `FetchingBar` primitives; wired into the Products and Single Product pages.
- Promoted the redesigned `Loading` to a full-screen component, used as the suspense fallback in `App.tsx`.

### Pages
- **Home** — new hero, services and featured-products grid.
- **Products** — modern grid/list view, redesigned sidebar filter, sort controls, product cards and list rows.
- **Single Product** — refreshed gallery, stars, add-to-cart and trust strip.
- **About** — rich storytelling layout.
- **Cart** — two-column layout with card-style rows, mobile-first stacking and free-shipping UX.
- **Checkout** — refreshed `StripeCheckout`, `AuthWrapper` and `CheckoutPage` styling.

### Shared primitives
- **Navbar**, **Sidebar**, **Footer** — modern multi-column footer with brand, socials, newsletter and payments strip.
- **Cart primitives** — rewritten `CartItem`, `CartColumns` and `CartTotals` with the new design language, including the gradient cost highlight and helper-driven free-shipping logic.

### Helpers & types
- Added `FREE_SHIPPING_THRESHOLD_CENTS` and `qualifiesForFreeShipping` in `utils/helper.ts` for cross-component reuse.
- Extended `types/index.ts` and `utils/Contants.tsx` for the new domains (categories, companies, mappers).

### Tooling
- `husky` + `lint-staged` pre-commit hook now runs `eslint --fix --max-warnings 0` on staged files. Every commit in this PR passed lint-staged cleanly.

## Stats

- 7 commits on top of `main` (`dba9a10` → `ff2930a`)
- 52 files changed, +7 637 / −1 724

## How to verify

1. `npm install` then `npm run dev`.
2. Visit `/`, `/products`, `/products/:id`, `/cart` and `/checkout`.
3. Open the network tab — products now come from `dummyjson.com` with our mapped shape.
