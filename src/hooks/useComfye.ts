import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { Products } from "../types";
import productsData from "../data/productsData";
import ms from "ms";

// Create API client instance for products endpoint
const apiClient = new APIClient<Products>("/react-store-products");

/**
 * Custom hook to fetch all products using React Query.
 * Provides caching, stale time, and initial data for better performance.
 * @returns The query object containing data (Products[]), loading state, error, etc.
 */
const useComfys = () => {
  return useQuery<Products[], Error>({
    queryKey: ["comfyStore"],
    queryFn: apiClient.getAll,
    staleTime: ms("24h"), // Data is considered fresh for 24 hours
    initialData: productsData, // Fallback data for immediate rendering
  });
};

export default useComfys;
