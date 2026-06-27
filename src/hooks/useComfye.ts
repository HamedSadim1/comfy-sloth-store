import {
  useInfiniteQuery,
  keepPreviousData,
  type InfiniteData,
} from "@tanstack/react-query";
import APIClient, {
  axiosInstance,
  type DummyProductsResponse,
} from "../services/apiClient";
import { Products } from "../types";
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

// Filters this hook understands. Adding more here is a one-line change
// (plus a queryKey entry) and lets us push them server-side when the
// upstream API supports it. Today only `category` is server-side; the
// remaining filters (searchText, brand, color, price, free-shipping)
// stay client-side in `useFilterProducts` because dummyjson doesn't
// expose dedicated endpoints for them.
interface UseComfysFilters {
  category?: string;
}

/**
 * Custom hook that drives TanStack Query's `useInfiniteQuery` against the
 * dummyjson catalogue. Two endpoints are stitched via the queryFn:
 *
 *  - `category === "all"` (the default) → `/products?skip=N&limit=PAGE_SIZE`
 *    — the unfiltered paginated listing.
 *  - any other `category` slug           → `/products/category/{slug}?skip=N&limit=PAGE_SIZE`
 *    — the per-category paginated listing.
 *
 * Putting `category` into the `queryKey` means React Query treats a
 * category change as a fresh query: it drops the accumulated pages for
 * the old category and re-fetches page 0 of the new one. Within a
 * category, infinite-scroll continues to re-use cached pages for the
 * full 24h stale window.
 *
 * `placeholderData: keepPreviousData` keeps the previous category's
 * first page visible while the new category's request resolves, so the
 * user sees no empty-grid flash during the transition.
 *
 * Filters argument is optional: callers that don't care about the
 * category (the Featured-strip hook, the Filter sidebar during boot)
 * keep working unchanged by getting `category: "all"`.
 */
const useComfys = (filters: UseComfysFilters = {}) => {
  const category = filters.category ?? "all";
  const isCategoryFilter = category !== "all";

  // `TQueryKey` mirrors the runtime key so React Query's dependency
  // tracking is type-safe.
  return useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage>,
    readonly ["comfyStore", "products", { category: string }],
    number
  >({
    queryKey: ["comfyStore", "products", { category }],
    queryFn: async ({ pageParam }) => {
      const skip = pageParam;
      const params = { skip, limit: PAGE_SIZE };
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
    // Hold the previous category's first page on screen while the new
    // category's request is in flight, so the grid doesn't flash empty.
    placeholderData: keepPreviousData,
  });
};

export default useComfys;
