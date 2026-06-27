import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { useStore } from "../store";
import useComfys from "../hooks/useComfye";
import { pluralize } from "../utils/helper";
import ListView from "./ListView";
import GridView from "./GridView";
import useFilterProducts from "../hooks/useFilterProducts";
import ProductGridSkeleton from "./ProductGridSkeleton";
import FetchingBar from "./FetchingBar";

/**
 * Main functional component for product list with filtering, view switching
 * and server-paginated infinite scroll.
 *
 * Pagination strategy: `@tanstack/react-query`'s `useInfiniteQuery`
 * drives each `/products?limit=10&skip=N` request. The queryKey keeps
 * per-page entries separately cached so re-mounts stay instant within the
 * 24h stale window. Filters stay client-side on the flatMapped, accumulated
 * page buffer, so changing a filter does NOT round-trip to the API.
 */
const ProductList: React.FC = () => {
  // Retrieve filter and view state from store
  const searchText = useStore((state) => state.comfyStoreQuery.searchText);
  const freeShipping = useStore(
    (state) => state.comfyStoreQuery.showAllFreeShipping
  );
  const gridView = useStore((state) => state.comfyStoreQuery.gridView);
  const setNumberOfProducts = useStore((state) => state.setNumberOfProducts);
  const category = useStore((state) => state.comfyStoreQuery.category);
  const company = useStore((state) => state.comfyStoreQuery.company);
  const color = useStore((state) => state.comfyStoreQuery.color);
  const price = useStore((state) => state.comfyStoreQuery.price);

  // Server-paginated fetch with React Query. `data` is
  // `InfiniteData<ProductsPage> | undefined`, ordered by `pageParams`.
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComfys();

  // Accumulates Products[] across every page loaded so far. Re-derived
  // only when the query result identity changes (which it does on each
  // successful page append).
  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );

  // Filter pipeline (client-side) — operates on whatever's currently
  // loaded. As more pages arrive the filtered view grows automatically.
  const filteredProducts = useFilterProducts({
    products,
    searchText,
    showAllFreeShipping: freeShipping,
    category,
    company,
    color,
    price,
  });

  // Update the Sort-header counter. We report the TOTAL filtered count
  // (not the page-bound slice), so the number keeps growing as the user
  // scrolls and more matches appear in later pages.
  useEffect(() => {
    setNumberOfProducts(filteredProducts);
  }, [filteredProducts, setNumberOfProducts]);

  // Stable signature of the active filter set. Whenever it changes we
  // re-arm the scroll gate so a freshly narrowed result doesn't auto-fire
  // fetchNextPage just because the user scrolled earlier. Without this
  // reset, the gate stays true for the lifetime of the component.
  const filterSignature = useMemo(
    () =>
      JSON.stringify({
        searchText,
        freeShipping,
        category,
        company,
        color,
        price,
      }),
    [searchText, freeShipping, category, company, color, price]
  );

  // Tracks "has the user actually scrolled at least once on the current
  // filter set?". The IO callback refuses to call fetchNextPage() until
  // this flips true. We reset it in the effect below whenever filters
  // change.
  const userScrolledRef = useRef<boolean>(false);
  useEffect(() => {
    userScrolledRef.current = false;
  }, [filterSignature]);

  // IntersectionObserver on a 1px sentinel below the rendered items.
  // When the user has scrolled at least once AND the sentinel is in or
  // near the viewport (rootMargin 240px from the bottom), fetchNextPage
  // pulls another page from the server.
  //
  // Note: the scroll listener is intentionally NOT `{ once: true }`.
  // The filter-reset effect above flips the gate to `false` whenever any
  // filter changes — a once-listener would have already auto-removed
  // itself after the user's first scroll, so subsequent filter changes
  // would leave the gate stuck `false` with no way to re-arm. Re-binding
  // on every scroll event is a single ref mutation, essentially free.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const markScrolled = () => {
      userScrolledRef.current = true;
    };
    window.addEventListener("scroll", markScrolled, {
      passive: true,
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!userScrolledRef.current) return;
        if (isFetchingNextPage) return;
        void fetchNextPage();
      },
      { rootMargin: "0px 0px 240px 0px" }
    );
    observer.observe(el);
    return () => {
      window.removeEventListener("scroll", markScrolled);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Manual "Load more" fallback. Bypasses the IO gate (and ignores any
  // pending scroll) so keyboard users and IO-unavailable environments
  // can still request the next page.
  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Error state — surface the api message directly.
  if (error) {
    return <h5>{error.message}</h5>;
  }

  // Loading state — first page only; subsequent pages stream in via the
  // sentinel + button. Render 10 skeleton placeholders that mirror the
  // currently-active view (grid or list) so the visual layout doesn't
  // jump when real products arrive.
  if (isLoading) {
    return (
      <ProductGridSkeleton
        variant={gridView ? "grid" : "list"}
        count={10}
      />
    );
  }

  // `total` reported by the server (same on every page). Used for the
  // honest "N of M loaded" copy while more pages exist.
  const total = data?.pages[data.pages.length - 1]?.total ?? 0;
  const loaded = products.length;

  return (
    <>
      {/* Thin top-of-page strip that signals the next product page is
          streaming in. Fully unmounts when isFetchingNextPage flips false
          so steady-state layout stays clean. */}
      <FetchingBar active={isFetchingNextPage} />
      {gridView ? (
        <GridView products={filteredProducts} />
      ) : (
        <ListView products={filteredProducts} />
      )}

      {filteredProducts.length === 0 ? null : hasNextPage ? (
        <LoadMoreArea aria-label="Pagination">
          {/* Sentinel — observed by IntersectionObserver to trigger auto-fetch */}
          <div ref={sentinelRef} aria-hidden="true" className="sentinel" />
          <button
            type="button"
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            aria-label={`Load more products${
              total ? ` (${loaded} of ${total} loaded)` : ""
            }`}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
          <p className="hint" aria-live="polite">
            Showing {loaded} of {total}{" "}{pluralize(total, "product").replace(/^\d+\s/, "")} loaded
          </p>
        </LoadMoreArea>
      ) : (
        <EndNote aria-label="Pagination">
          <span className="dot" aria-hidden="true" />
          <span>
            You&rsquo;ve seen all {pluralize(loaded, "product")}
          </span>
        </EndNote>
      )}
    </>
  );
};

const LoadMoreArea = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;

  /* The sentinel lives in the document flow but is visually invisible —
     the IntersectionObserver only needs it to occupy space. */
  .sentinel {
    height: 1px;
    width: 100%;
    pointer-events: none;
  }

  .load-more-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem 1.6rem;
    border-radius: var(--radius-full);
    background: var(--clr-white);
    border: 1.5px solid var(--clr-primary-7);
    color: var(--clr-primary-2);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
    box-shadow: var(--shadow-xs);
    transition:
      background 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out),
      box-shadow 0.3s var(--ease-out);

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      background: var(--gradient-accent);
      color: var(--clr-white);
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      outline: none;
    }

    &:focus-visible:not(:disabled) {
      box-shadow:
        var(--shadow-md),
        0 0 0 3px rgba(204, 152, 110, 0.4);
    }

    &:disabled {
      cursor: progress;
      opacity: 0.7;
    }
  }

  .hint {
    margin: 0;
    font-size: 0.78rem;
    color: var(--clr-grey-5);
    letter-spacing: 0;
  }
`;

const EndNote = styled.div`
  margin-top: 3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  align-self: center;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-full);
  background: var(--clr-primary-10);
  border: 1px solid rgba(204, 152, 110, 0.18);
  color: var(--clr-primary-2);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0;

  .dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--clr-primary-5);
  }
`;

export default ProductList;
