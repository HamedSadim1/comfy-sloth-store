import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/apiClient";
import { Category } from "../types";
import { category_list_url } from "../utils/Contants";
import ms from "ms";

/**
 * React Query hook that fetches the full dummyjson `/products/category-list`
 * endpoint so the Filter sidebar can show every category from the very first
 * paint — not just the ones that happen to live in the currently-scrolled
 * pages of `useComfys`.
 *
 * - Non-paginated, so uses `useQuery` (not `useInfiniteQuery`).
 * - Cached for 24h, matching `useComfys`' staleTime so a hard refresh of
 *   the products query doesn't refetch the categories.
 * - Sorted alphabetically client-side to keep the chip order stable
 *   regardless of how the API orders its payload.
 * - Returns the full React Query shape (`data`, `isLoading`, `error`, …)
 *   so callers can render shimmer skeletons / fallback copy themselves.
 */
const useCategoryList = () => {
  return useQuery<Category[], Error>({
    queryKey: ["comfyStore", "categories"],
    queryFn: async () => {
      const response = await axiosInstance.get<Category[]>(category_list_url);
      return [...response.data].sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: ms("24h"),
    gcTime: ms("24h"),
  });
};

export default useCategoryList;
