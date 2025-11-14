import { useMemo } from "react";
import { Products } from "../types";
import useComfys from "./useComfye";

// Interface for the return type of the hook
interface UseFeaturedProductsReturn {
  featuredProducts: Products[] | undefined;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Custom hook to get featured products from the products data.
 * Filters the products to return only those marked as featured.
 * @returns An object containing featuredProducts array, error, and loading state.
 */
const useFeaturedProducts = (): UseFeaturedProductsReturn => {
  const { data, error, isLoading } = useComfys();

  // Memoize the filtered featured products to avoid unnecessary recalculations
  const featuredProducts = useMemo(() => {
    if (!data) return undefined;
    return data.filter((product: Products) => product.featured === true);
  }, [data]);

  return { featuredProducts, error, isLoading };
};

export default useFeaturedProducts;
