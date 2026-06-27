/**
 * Centralised Single Source of Truth (SSOT) for every hardcoded constant
 * and magic value in the app.
 *
 * Domain-grouped via `as const` namespaces so each consumer imports only
 * what it needs while reading from a single file. Behaviour-preserving
 * migration — every consumer is wired up to read from this SSOT, no
 * business logic was changed.
 *
 * Migration history: this file replaces the legacy `src/utils/Contants.tsx`
 * (note the typo) which exported flat `APP_NAME` / `products_url` / etc.
 * constants from `src/utils`, plus a scattered set of inline literal values
 * discovered across the codebase:
 *
 *   - `apiClient.ts`                             → inlined baseURL + auth token key
 *   - `useCategoryList.ts`                       → category list endpoint
 *   - `useComfye.ts`                             → PAGE_SIZE
 *   - `useComfy.ts`                              → single-product endpoint prefix
 *   - `CartContext.tsx`                          → SHIPPING_FEE + cart storage key
 *   - `helper.ts`                                → FREE_SHIPPING_THRESHOLD_CENTS
 *   - `mappers.ts`                               → CENTS_PER_DOLLAR (was duplicate)
 *   - `ProductImages.tsx`                        → fallback image URL
 *   - `Contants.tsx`                             → APP_NAME, products_url, single_product_url,
 *                                                  category_list_url, newsletter_url,
 *                                                  CENTS_MULTIPLIER (now removed),
 *                                                  links, services
 *   - `main.tsx`                                 → Auth0 env var names
 *   - `StripeCheckout.tsx`                       → Stripe public env var name
 *   - `api/create-payment-intent.ts`,
 *     `functions/create-payment-intent.ts`       → Stripe secret env var name
 */

import type { LinksInterface, ServicesInterface } from "./types";
import { GiCompass, GiDiamondHard, GiStabbedNote } from "react-icons/gi";

// ─────────────────────────────────────────────────────────────────────
// APP — brand & display strings. Single source of truth for every
// visible "Comfy Sloth" reference (copy, aria-labels, copyright row,
// social-meta tags, …). Wordmark-style lowercase form is
// `APP.NAME.toLowerCase()` so any consumer can derive it on demand.
// ─────────────────────────────────────────────────────────────────────
export const APP = {
  NAME: "Comfy Sloth",
} as const;

// ─────────────────────────────────────────────────────────────────────
// NETWORK — external API base URL and endpoint paths. Every dummyjson
// route plus the Formspree newsletter endpoint lives here, so an API
// migration = single-file edit instead of a multi-file grep.
// ─────────────────────────────────────────────────────────────────────
export const NETWORK = {
  /** dummyjson.com base URL consumed by the axios instance. */
  BASE_URL: "https://dummyjson.com",
  /**
   * Unfiltered catalogue endpoint (path-only; the per-page
   * `?skip=N&limit=NETWORK.PAGE_SIZE` params are appended by the
   * `useComfys` queryFn, and the explicit `?limit=100` literal that
   * shipped with the legacy `products_url` was vestigial — the param
   * was always overwritten by the per-page limit, so the constant
   * drops the query string for clarity).
   */
  PRODUCTS: "/products",
  /**
   * Single-product endpoint prefix. The `APIClient.get(id)` call
   * concatenates the encoded id onto this prefix at request time.
   */
  SINGLE_PRODUCT: "/products/",
  /** Category-filtered product list (slug appended: `/category/{slug}`). */
  PRODUCTS_BY_CATEGORY: "/products/category",
  /** Canonical category list endpoint (24 slug strings). */
  CATEGORY_LIST: "/products/category-list",
  /**
   * Newsletter POST endpoint handled by the Formspree contact service.
   * Used by both the Footer's newsletter column AND the home-page
   * Contact section so the two flows never go out of sync (e.g. when
   * rotating the Formspree form ID during a spam-control session).
   */
  NEWSLETTER: "https://formspree.io/f/mlekvlgr",
  /**
   * dummyjson page size; matches the number of cards the ProductList
   * renders per skeleton batch, and is what `useComfys` requests per
   * `useInfiniteQuery` page. Bumping this widens each request and
   * shortens the scroll-to-next-page distance proportionally.
   */
  PAGE_SIZE: 10,
} as const;

// ─────────────────────────────────────────────────────────────────────
// STORAGE_KEYS — `localStorage` keys. Centralised so a future rename
// costs a single-file edit and a typo can't silently break the
// persisted cart or auth token cache.
// ─────────────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  /** Auth0 JWT bearer token cached after login. */
  AUTH_TOKEN: "authToken",
  /** Persisted shopping cart. */
  CART: "cart",
} as const;

// ─────────────────────────────────────────────────────────────────────
// ENV — Vite `import.meta.env` variable names. Centralised so a single
// grep reveals every place an env name is read; rotating the env name
// in `.env.example` requires edits only in this file + that file.
// ─────────────────────────────────────────────────────────────────────
export const ENV = {
  /** Auth0 tenant domain. */
  AUTH0_DOMAIN: "VITE_REACT_APP_AUTH0_DOMAIN",
  /** Auth0 SPA client id. */
  AUTH0_CLIENT_ID: "VITE_REACT_APP_AUTH0_CLIENT_ID",
  /** Stripe publishable key (browser-side, passed to `loadStripe`). */
  STRIPE_PUBLIC_KEY: "VITE_REACT_APP_STRIP_PUBLIC_KEY",
  /** Stripe secret key (Netlify / Vercel function-side only). */
  STRIPE_SECRET_KEY: "VITE_REACT_APP_STRIP_SECRET_KEY",
} as const;

// ─────────────────────────────────────────────────────────────────────
// IMAGES — fallback URLs used when product thumbnails are missing.
// ─────────────────────────────────────────────────────────────────────
export const IMAGES = {
  /** SVG placeholder rendered when a product's `images` array is empty. */
  PLACEHOLDER:
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
} as const;

// ─────────────────────────────────────────────────────────────────────
// COMMERCE — pricing & shipping magic numbers. Every value is stored
// in cents (NOT euros) so the cart arithmetic stays in integer domain
// and matches what `formatPrice(number / 100)` expects.
// ─────────────────────────────────────────────────────────────────────
export const COMMERCE = {
  /**
   * dummyjson returns the upstream price in dollars (e.g. 9.99);
   * the codebase stores & renders cents (e.g. 999 → €9.99 via
   * `formatPrice`). Multiply the upstream dollar value by this constant
   * to get the cents value we persist.
   */
  CENTS_PER_DOLLAR: 100,
  /**
   * Free shipping kicks in once the cart reaches €50 (= 5000 cents).
   * Mirrors the trust-row copy from `TrustStrip.tsx` ("On orders over
   * €50") and the `SingleProductPage.tsx` hero "Over €50" pill, so
   * rotation is a single-file edit.
   */
  FREE_SHIPPING_THRESHOLD_CENTS: 5000,
  /**
   * Flat shipping fee (€5.34 = 534 cents) added to orders below the
   * free-shipping threshold.
   */
  SHIPPING_FEE_CENTS: 534,
} as const;

// ─────────────────────────────────────────────────────────────────────
// CONTENT — shared copy arrays rendered across multiple pages.
// Imported as flat exports by name (rather than a `CONTENT.*` namespace)
// because the two collections are read as standalone arrays by the
// consumer components (`Navbar`, `Sidebar`, `Services`, `AboutPage`);
// threading them through an extra namespace layer would obscure rather
// than clarify the import shape.
// ─────────────────────────────────────────────────────────────────────

/**
 * Navigation links rendered by the Navbar (desktop) and Sidebar
 * (mobile). Each entry has `{ id, text, url }` matching the
 * `LinksInterface` shape consumed everywhere.
 */
export const links: LinksInterface[] = [
  { id: 1, text: "home", url: "/" },
  { id: 2, text: "about", url: "/about" },
  { id: 3, text: "products", url: "/products" },
];

/**
 * Pillars copy (mission / vision / history) used by both the Home page
 * `<Services>` strip and the About-page `<Pillars>` card grid. The
 * icon React elements are shared at module load — the consumer renders
 * them inside the card layout of its choice.
 */
export const services: ServicesInterface[] = [
  {
    id: 1,
    icon: <GiCompass />,
    title: "mission",
    text: `Our mission at "${APP.NAME}" is to provide exceptional comfort and style, crafting spaces that inspire relaxation and well-being.`,
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: "vision",
    text: `Our vision at "${APP.NAME}" is to redefine the concept of comfort, creating homes that nurture and rejuvenate, fostering a sense of tranquility and well-being in every space.`,
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: "history",
    text: `Established in 1996, ${APP.NAME} has been committed to providing cozy and stylish products for comfortable living spaces.`,
  },
];

// ─────────────────────────────────────────────────────────────────────
// Convenience key types — `keyof typeof NS` derives literal-key unions
// from the `as const` namespaces, so any feature that takes a key as a
// prop or argument is type-checked against the actual exported keys.
// Remove a constant from its namespace → breaks any consumer that
// referenced the removed key at compile time. That's the SSOT contract.
// ─────────────────────────────────────────────────────────────────────
export type AppKey = keyof typeof APP;
export type NetworkKey = keyof typeof NETWORK;
export type StorageKey = keyof typeof STORAGE_KEYS;
export type EnvKey = keyof typeof ENV;
export type ImageKey = keyof typeof IMAGES;
export type CommerceKey = keyof typeof COMMERCE;
