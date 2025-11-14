import { useMemo } from "react";
import { Color, Products } from "../types";

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
        // Filter by category
        if (category.toLowerCase() === "all") {
          return true;
        }
        return product.category.toLowerCase() === category.toLowerCase();
      })
      .filter((product) => {
        // Filter by company
        if (company.toLowerCase() === "all") {
          return true;
        }
        return product.company.toLowerCase() === company.toLowerCase();
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
