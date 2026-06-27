import { create } from "zustand";
import type { Products } from "./types";
// One-source-of-truth typing + initial value for the Sort dropdown. Lives
// in `useComfye.ts` because that hook is the only place that knows how
// to translate the slug into dummyjson's `sortBy`/`order` URL params.
import { DEFAULT_SORT, type SortKey } from "./hooks/useComfye";

// Interface for the filter query state
interface ComfyStoreQuery {
  searchText: string;
  showAllFreeShipping: boolean;
  gridView: boolean;
  numberOfProducts: number;
  category: string;
  company: string;
  /** Sort key for the ProductList. Previously lived in FilterContext; moved
   *  here so the Sort component (and any future consumer) can read/write it
   *  without dragging in the legacy context. Typed as `SortKey` so any
   *  new dropdown option that isn't mapped in `useComfye.SORT_PARAMS`
   *  surfaces here at compile time instead of silently falling back to
   *  DEFAULT_SORT in the hook. */
  sort: SortKey;
  /** Running max of the loaded products — kept in state so consumers like
   *  PageHero (which doesn't see the products list) can call `clearFilter`
   *  without passing the value manually. Set by Filter after each product
   *  load. */
  maxPrice: number;
  minPrice: number;
  price: number;
}

// Interface for the store state and actions
interface ComfyStore {
  comfyStoreQuery: ComfyStoreQuery;
  setSearchText: (searchText: string) => void;
  setShowAllFreeShipping: () => void;
  setGridView: (gridView: boolean) => void;
  setNumberOfProducts: (products: Products[]) => void;
  updateCategory: (category: string) => void;
  updateCompany: (company: string) => void;
  /** Update the sort key (consumed by Sort/ProductList). */
  setSort: (sort: SortKey) => void;
  /** Track the running max price so PageHero can reset filters without a
   *  maxPrice argument. */
  setMaxPrice: (maxPrice: number) => void;
  getMaxPrice: (products: Products[]) => number;
  getMinPrice: (products: Products[]) => number;
  updatePrice: (price: number) => void;
  clearFilter: (maxPrice: number) => void;
}

/**
 * Zustand store for managing product filter and view state.
 * Note: This store may overlap with FilterContext; consider consolidating for better architecture.
 */
export const useStore = create<ComfyStore>((set) => ({
  // Initial state
  comfyStoreQuery: {
    searchText: "",
    showAllFreeShipping: false,
    gridView: true,
    numberOfProducts: 0,
    minPrice: 0,
    maxPrice: 0,
    category: "all",
    company: "all",
    sort: DEFAULT_SORT,
    price: 0,
  },

  // Set search text
  setSearchText: (searchText: string) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, searchText },
    }));
  },

  // Toggle free shipping filter
  setShowAllFreeShipping: () => {
    set((state) => ({
      comfyStoreQuery: {
        ...state.comfyStoreQuery,
        showAllFreeShipping: !state.comfyStoreQuery.showAllFreeShipping,
      },
    }));
  },

  // Set grid view (true for grid, false for list)
  setGridView: (gridView: boolean) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, gridView },
    }));
  },

  // Set number of products based on array length
  setNumberOfProducts: (products: Products[]) => {
    set((state) => ({
      comfyStoreQuery: {
        ...state.comfyStoreQuery,
        numberOfProducts: products.length,
      },
    }));
  },

  // Update category filter
  updateCategory: (category: string) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, category },
    }));
  },

  // Update company filter
  updateCompany: (company: string) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, company },
    }));
  },

  // Update sort key (typed as SortKey so the spread into
  // comfyStoreQuery doesn't widen back to string; sort's type comes
  // through verbatim into the store).
  setSort: (sort: SortKey) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, sort },
    }));
  },

  // Track running max price of the loaded catalogue so consumers that
  // don't see the products list (e.g. PageHero) can reset filters
  // without having to pass a maxPrice argument around.
  setMaxPrice: (maxPrice: number) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, maxPrice },
    }));
  },

  // Get maximum price from products array
  getMaxPrice: (products: Products[]): number => {
    if (products.length === 0) return 0;
    return Math.max(...products.map((product) => product.price));
  },

  // Update price filter
  updatePrice: (price: number) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, price },
    }));
  },

  // Get minimum price from products array
  getMinPrice: (products: Products[]): number => {
    if (products.length === 0) return 0;
    return Math.min(...products.map((product) => product.price));
  },

  // Clear all filters and reset to defaults
  clearFilter: (maxPrice: number) => {
    set((state) => ({
      comfyStoreQuery: {
        ...state.comfyStoreQuery,
        showAllFreeShipping: false,
        searchText: "",
        category: "all",
        company: "all",
        price: maxPrice,
      },
    }));
  },
}));
