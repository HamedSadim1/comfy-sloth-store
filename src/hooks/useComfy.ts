import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import type { SingleProduct } from "../types";
import type {
  DummyProduct} from "../utils/mappers";
import {
  mapDummyProductToSingleProduct,
} from "../utils/mappers";

// Create API client instance for the single product endpoint.
// dummyjson returns the product object directly, so no unwrap needed.
const apiClient = new APIClient<DummyProduct>("/products/");

/**
 * Custom hook to fetch a single product by ID using React Query.
 * The dummyjson response shape is mapped into our app's `SingleProduct`
 * shape so downstream components can keep their props contract.
 * @param id - The ID of the product to fetch.
 * @returns The query object containing data, loading state, error, etc.
 */
const useComfy = (id: string) => {
  return useQuery<SingleProduct, Error>({
    queryKey: ["singleProduct", id],
    queryFn: async () => {
      const data = await apiClient.get(id);
      return mapDummyProductToSingleProduct(data);
    },
  });
};

export default useComfy;
