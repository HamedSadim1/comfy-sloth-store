import {
  useInfiniteQuery,
  keepPreviousData,
  type InfiniteData,
} from "@tanstack/react-query";
import APIClient, {
  axiosInstance,
  type DummyProductsResponse,
} from "../services/apiClient";
import type { Products } from "../types";
import { mapDummyProductToProduct, type DummyProduct } from "../utils/mappers";
import ms from "ms";

// Page size: how many products dummyjson returns per request. Matches the
// initial visible slot of the product list (10 cards). Subsequent pages
// are pulled on demand via IntersectionObserver-driven `fetchNextPage()`
// in `ProductList`.
const PAGE_SIZE = 10;

// API client + raw axios instance for dummyjson. The unfiltered endpoint
// (`/products`) flows through APIClient; the per-category variant
// (`/products/category/{slug}`) hits `axiosInstance` directly inside the
// queryFn because dummyjson slugs are guaranteed `[a-z0-9-]` (no
// encoding needed) and the explicit absolute path is easier to read than
// re-using the class with a config.url override.
const apiClient = new APIClient<DummyProduct>("/products");

// Shape returned by each page-level queryFn call. Consumers either
// treat the single page or flatMap across `data.pages` for the running
// catalogue.
export interface ProductsPage {
  products: Products[];
  nextSkip: number | undefined;
  total: number;
}

// Sort slugs emitted by the Sort dropdown. Kept as a string literal
// union so we can type the prop and reject typos at the call site.
//
// - `price-lowest`  : `sortBy=price`  + `order=asc`
// - `price-highest` : `sortBy=price`  + `order=desc`
// - `name-a`        : `sortBy=title`  + `order=asc`  (app's "name" maps
//                                                   to dummyjson's "title"
//                                                   via mappers.ts)
// - `name-z`        : `sortBy=title`  + `order=desc`
//
// Both `SortKey` and `DEFAULT_SORT` are exported so the Zustand store
// can use `DEFAULT_SORT` as the initial value (one source of truth
// instead of two literals drifting apart) and `Sort.tsx` can type the
// dropdown's selected value as `SortKey` to catch any new option
// value that isn't mapped here at compile time.
export type SortKey =
  | "price-lowest"
  | "price-highest"
  | "name-a"
  | "name-z";
export const DEFAULT_SORT: SortKey = "price-lowest";

const SORT_PARAMS: Record<
  SortKey,
  { sortBy: "price" | "title"; order: "asc" | "desc" }
> = {
  "price-lowest": { sortBy: "price", order: "asc" },
  "price-highest": { sortBy: "price", order: "desc" },
  "name-a": { sortBy: "title", order: "asc" },
  "name-z": { sortBy: "title", order: "desc" },
};

// Filters this hook understands. Adding more here is a one-line change
// (plus a queryKey entry) and lets us push them server-side when the
// upstream API supports it. `category` switches the URL prefix to
// `/products/category/{slug}`; `sort` (when explicitly passed) adds
// `sortBy/order` URL params on top of whichever endpoint is hit. The
// hook does NOT apply a silent default for `sort` — no-args callers
// keep dummyjson's native ordering, which is the pre-fix behaviour.
// The remaining filters (searchText, brand, color, price,
// free-shipping) stay client-side in `useFilterProducts` because
// dummyjson doesn't expose dedicated endpoints for them.
interface UseComfysFilters {
  category?: string;
  sort?: SortKey;
}

/**
 * Custom hook that drives TanStack Query's `useInfiniteQuery` against the
 * dummyjson catalogue. Three concerns are stitched via the queryFn:
 *
 *  - `category === "all"` (the default) →
 *    `/products?skip=N&limit=PAGE_SIZE[&sortBy=...&order=...]`
 *  - any other `category` slug →
 *    `/products/category/{slug}?skip=N&limit=PAGE_SIZE[&sortBy=...&order=...]`
 *  - `sort` (when explicitly provided) → appended as `&sortBy=...&order=...`
 *    for both endpoints. Omitted entirely when the caller does not pass
 *    one, so the Home page's `useFeaturedProducts` (which calls `useComfys()`
 *    with no args) keeps the upstream native ordering instead of being
 *    silently re-ordered by price-asc.
 *
 * Putting `category` AND `sort` into the `queryKey` means React Query
 * treats either change as a fresh query: it drops the accumulated
 * pages for the old combination and re-fetches page 0 already-sorted.
 * Within a given (category, sort) tuple, infinite-scroll re-uses cached
 * pages for the full 24h stale window.
 *
 * Sort must be server-side (not a client-side resort on the accumulated
 * page buffer) for sorting to be globally correct: each dummyjson
 * paginated slice is a different product set under a different sort
 * order, so flatMapping pages then sorting client-side would silently
 * break the order.
 *
 * `placeholderData: keepPreviousData` keeps the previous
 * (category, sort) tuple's first page visible while the new tuple's
 * request resolves, so the user sees no empty-grid flash during the
 * transition.
 *
 * Filters argument is optional: callers that don't care about
 * category/sort (Featured-strip hook, Filter sidebar during boot) keep
 * working unchanged by getting `category: "all"` and no sort params.
 */
const useComfys = (filters: UseComfysFilters = {}) => {
  const category = filters.category ?? "all";
  const sort: SortKey | undefined = filters.sort;
  const isCategoryFilter = category !== "all";

  // `TQueryKey` mirrors the runtime key so React Query's dependency
  // tracking is type-safe.
  return useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage>,
    readonly [
      "comfyStore",
      "products",
      { category: string; sort: SortKey | undefined },
    ],
    number
  >({
    queryKey: ["comfyStore", "products", { category, sort }],
    queryFn: async ({ pageParam }) => {
      const skip = pageParam;
      // Build params incrementally so callers that omit `sort` don't
      // get a `?sortBy=&order=` pair appended to the URL (which would
      // both look like noise in devtools and force dummyjson's no-op
      // sort path).
      const params: {
        skip: number;
        limit: number;
        sortBy?: "price" | "title";
        order?: "asc" | "desc";
      } = { skip, limit: PAGE_SIZE };
      if (sort) {
        params.sortBy = SORT_PARAMS[sort].sortBy;
        params.order = SORT_PARAMS[sort].order;
      }
      // The two endpoints return the same envelope shape, so a single
      // mapper pass + page-derivation covers both. We branch only on the
      // URL. Slugs are tiny-and-alphanumeric so no URL escaping is needed.
      const response: DummyProductsResponse<DummyProduct> = isCategoryFilter
        ? (
            await axiosInstance.get<DummyProductsResponse<DummyProduct>>(
              `/products/category/${category}`,
              { params }
            )
          ).data
        : await apiClient.getAllRaw({ params });
      const loadedThrough = response.skip + response.limit;
      const nextSkip =
        loadedThrough < response.total ? loadedThrough : undefined;
      return {
        products: response.products.map(mapDummyProductToProduct),
        nextSkip,
        total: response.total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextSkip,
    staleTime: ms("24h"),
    // Hold the previous (category, sort) tuple's first page on screen
    // while the new tuple's request is in flight, so the grid doesn't
    // flash empty.
    placeholderData: keepPreviousData,
  });
};

export default useComfys;
