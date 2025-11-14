import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import { Products, Color } from "../types";
import { useProductContext } from "./ProductContext";

// Interface for filter state
interface FilterState {
  category: string;
  company: string;
  color: string | null;
  price: number;
  shipping: boolean;
  search: string;
}

// Interface for the filter context value
interface FilterContextProps {
  allProducts: Products[];
  filteredProducts: Products[];
  gridView: boolean;
  setGridView: (gridView: boolean) => void;
  sort: string;
  updateSort: (e: ChangeEvent<HTMLSelectElement>) => void;
  maxPrice: number;
  minPrice: number;
  filters: FilterState;
  updateFilters: (
    key: keyof FilterState,
    value: string | number | boolean | null
  ) => void;
  clearFilters: () => void;
  companyOptions: string[];
  categoryOptions: string[];
  colorsOptions: string[];
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const { products, products_loading } = useProductContext();

  // State for all products and view
  const [allProducts, setAllProducts] = useState<Products[]>([]);
  const [gridView, setGridView] = useState<boolean>(true);
  const [sort, setSort] = useState<string>("price-lowest");

  // State for filter criteria
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    company: "all",
    color: null,
    price: 0,
    shipping: false,
    search: "",
  });

  // Memoized min and max price from all products
  const { minPrice, maxPrice } = useMemo(() => {
    if (allProducts.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = allProducts.map((p) => p.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [allProducts]);

  // Memoized options for filters
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(allProducts.map((p) => p.category))];
    return ["all", ...unique];
  }, [allProducts]);

  const companyOptions = useMemo(() => {
    const unique = Array.from(new Set(allProducts.flatMap((p) => p.company)));
    return ["all", ...unique];
  }, [allProducts]);

  const colorsOptions = useMemo(() => {
    const unique = Array.from(new Set(allProducts.flatMap((p) => p.colors)));
    return ["all", ...unique];
  }, [allProducts]);

  // Memoized filtered products based on filters
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Apply search filter
    if (filters.search) {
      result = result.filter((p) =>
        p.name.toLowerCase().startsWith(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply company filter
    if (filters.company !== "all") {
      result = result.filter(
        (p) => p.company.toLowerCase() === filters.company.toLowerCase()
      );
    }

    // Apply color filter
    if (filters.color && filters.color !== "all") {
      result = result.filter((p) => p.colors.includes(filters.color as Color));
    }

    // Apply price filter
    if (filters.price > 0) {
      result = result.filter((p) => p.price <= filters.price);
    }

    // Apply shipping filter
    if (filters.shipping) {
      result = result.filter((p) => p.shipping);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sort) {
        case "price-lowest":
          return a.price - b.price;
        case "price-highest":
          return b.price - a.price;
        case "name-a":
          return a.name.localeCompare(b.name);
        case "name-z":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [allProducts, filters, sort]);

  // Effect to initialize allProducts and filters when products load
  useEffect(() => {
    if (products_loading) return;
    setAllProducts([...products]);
    setFilters((prev) => ({
      ...prev,
      price: Math.max(...products.map((p) => p.price)),
    }));
  }, [products, products_loading]);

  // Handler for updating sort
  const updateSort = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
  }, []);

  // Handler for updating filters
  const updateFilters = useCallback(
    (key: keyof FilterState, value: string | number | boolean | null) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Handler for clearing all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: "all",
      company: "all",
      color: null,
      price: maxPrice,
      shipping: false,
      search: "",
    });
  }, [maxPrice]);

  // Context value, memoized for performance
  const contextValue = useMemo<FilterContextProps>(
    () => ({
      allProducts,
      filteredProducts,
      gridView,
      setGridView,
      sort,
      updateSort,
      maxPrice,
      minPrice,
      filters,
      updateFilters,
      clearFilters,
      companyOptions,
      categoryOptions,
      colorsOptions,
    }),
    [
      allProducts,
      filteredProducts,
      gridView,
      sort,
      updateSort,
      maxPrice,
      minPrice,
      filters,
      updateFilters,
      clearFilters,
      companyOptions,
      categoryOptions,
      colorsOptions,
    ]
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use filter context
export const useFilterContext = (): FilterContextProps => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};

export default { FilterContext, FilterProvider };
