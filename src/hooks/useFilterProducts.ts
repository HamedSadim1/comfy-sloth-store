import { useMemo } from "react";
import { Color, Products } from "../types";
import { NO_BRAND_FILTER } from "../utils/helper";

// Interface for the hook parameters
interface UseFilterProductsParams {
  products: Products[];
  searchText: string;
  showAllFreeShipping: boolean;
  category: string;
  company: string;
  color: string;
  price: number;
}

/**
 * Custom hook to filter products based on various criteria.
 * Uses memoization for performance to avoid unnecessary recalculations.
 * @param params - Object containing products array and filter criteria.
 * @returns The filtered array of products.
 */
const useFilterProducts = ({
  products,
  searchText,
  showAllFreeShipping,
  category,
  company,
  color,
  price,
}: UseFilterProductsParams): Products[] => {
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Filter by free shipping if enabled
        if (showAllFreeShipping) {
          return product.shipping === true;
        }
        return true; // Include all if not filtering by shipping
      })
      .filter((product) => {
        // Filter by search text in product name
        return product.name.toLowerCase().includes(searchText.toLowerCase());
      })
      .filter((product) => {
        // Filter by category (mapper keeps casing from the API; the
        // dropdown passes the raw choice back, so compare as-is or
        // // case-insensitively — we normalize on both sides to stay safe).
        //
        // NOTE: Since useComfys now filters category server-side
        // (each click hits `/products/category/{slug}`), every loaded
        // product already matches the active category — this filter is
        // a defensive no-op. Kept in the pipeline for offline mode /
        // future state-override scenarios where the server query might
        // be bypassed.
        const c = category.toLowerCase();
        if (c === "all") return true;
        return product.category.toLowerCase() === c;
      })
      .filter((product) => {
        // Filter by company (mapper lowercases the brand at the source,
        // and the dropdown stores the raw lowercase value, so the compare
        // keys already line up).
        //
        // The `NO_BRAND_FILTER` sentinel (single source of truth in
        // helper.ts) is a wildcard that narrows the list to products
        // whose `company` is empty — i.e. the API's `brand` field was
        // missing on the upstream dummyjson request. Without this
        // branch, picking `'No brand'` in the dropdown would silently
        // drop every product rather than returning the no-brand
        // subset. Surface these rows only when the user explicitly
        // picks the sentinel; do NOT include them under `'all'`.
        if (company === "all") return true;
        if (company === NO_BRAND_FILTER) return !product.company;
        return product.company === company;
      })
      .filter((product) => {
        // Filter by color
        if (color.toLowerCase() === "all") {
          return true;
        }
        return product.colors.includes(color as Color);
      })
      .filter((product) => {
        // Filter by maximum price
        return product.price <= price;
      });
  }, [
    products,
    searchText,
    showAllFreeShipping,
    category,
    company,
    color,
    price,
  ]);

  return filteredProducts;
};

export default useFilterProducts;
