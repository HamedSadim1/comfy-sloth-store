import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { Products } from "../types";
import { mapDummyProductToProduct, DummyProduct } from "../utils/mappers";
import ms from "ms";

// Page size: how many products dummyjson returns per request. Matches the
// initial visible slot of the product list (10 cards). Subsequent pages
// are pulled on demand via IntersectionObserver-driven `fetchNextPage()`
// in `ProductList`.
const PAGE_SIZE = 10;

// API client for the products list endpoint. We drop the `?limit=100`
// baked-in query string from the constructor — `getAllRaw` accepts Axios
// `params` and merges them into the URL, so per-call we send
// `/products?skip=N&limit=10`.
const apiClient = new APIClient<DummyProduct>("/products");

// Shape returned by each page-level queryFn call. Consumers either
// treat the single page or flatMap across `data.pages` for the running
// catalogue.
export interface ProductsPage {
  products: Products[];
  nextSkip: number | undefined;
  total: number;
}

/**
 * Custom hook that drives TanStack Query's `useInfiniteQuery` against the
 * dummyjson `/products` endpoint. Each page is cached under the same
 * queryKey (keyed off the auto-managed `pageParam`), so re-mounts stay
 * instant within the 24h stale window. Consumers receive the React Query
 * return shape: `{ data, error, fetchNextPage, hasNextPage, ... }`.
 */
const useComfys = () => {
  // `TData` is `InfiniteData<ProductsPage>` — that's what the hook returns
  // and what consumers reach into for `.pages.flatMap(...)`. Forgetting
  // this lets TS infer `data: ProductsPage | undefined`, which removes
  // the `.pages` member and breaks every flatMap call downstream.
  return useInfiniteQuery<
    ProductsPage,
    Error,
    InfiniteData<ProductsPage>,
    readonly ["comfyStore"],
    number
  >({
    queryKey: ["comfyStore"],
    queryFn: async ({ pageParam }) => {
      const skip = pageParam;
      const response = await apiClient.getAllRaw({
        params: { skip, limit: PAGE_SIZE },
      });
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
  });
};

export default useComfys;
