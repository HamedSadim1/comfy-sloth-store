import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { SingleProduct } from "../types";

// Create API client instance for single product endpoint
const apiClient = new APIClient<SingleProduct>(
  `/react-store-single-product?id=`
);

/**
 * Custom hook to fetch a single product by ID using React Query.
 * @param id - The ID of the product to fetch.
 * @returns The query object containing data, loading state, error, etc.
 */
const useComfy = (id: string) => {
  return useQuery<SingleProduct, Error>({
    queryKey: ["singleProduct", id],
    queryFn: () => apiClient.get(id),
  });
};

export default useComfy;
