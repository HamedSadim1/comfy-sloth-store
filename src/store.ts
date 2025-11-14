import { create } from "zustand";
import { Products } from "./types";

// Interface for the filter query state
interface ComfyStoreQuery {
  searchText: string;
  showAllFreeShipping: boolean;
  gridView: boolean;
  numberOfProducts: number;
  category: string;
  company: string;
  color: string;
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
  updateColor: (color: string) => void;
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
    color: "all",
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

  // Update color filter
  updateColor: (color: string) => {
    set((state) => ({
      comfyStoreQuery: { ...state.comfyStoreQuery, color },
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
        color: "all",
        price: maxPrice,
      },
    }));
  },
}));
