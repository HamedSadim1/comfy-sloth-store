import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/apiClient";
import type { Category } from "../types";
import { category_list_url } from "../utils/Contants";
import ms from "ms";

/**
 * Prettify a category slug for display in the filter chips.
 *
 * DummyJSON returns slugs like `home-decoration` and `mens-watches`.
 * The chip CSS capitalises the first character of each word in a string
 * (whitespace-separated only), so `home-decoration` would render as
 * `Home-decoration` without help. We split on `-`, capitalise each piece
 * and re-join with spaces so multi-word slugs read naturally.
 */
function prettifyCategoryName(slug: string): string {
  return slug
    .split("-")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

/**
 * React Query hook that fetches the full dummyjson `/products/category-list`
 * endpoint so the Filter sidebar can show every category from the very first
 * paint — not just the ones that happen to live in the currently-scrolled
 * pages of `useComfys`.
 *
 * The endpoint returns a **flat array of slug strings** (`["beauty",
 * "fragrances", …]`) — not the `{slug, name, url}` envelope we'd hoped
 * for (the older docs implied richer objects but the live response is the
 * same shape as `/products/categories`). We map each slug to the canonical
 * `Category` shape consumers expect, synthesising a presentation-friendly
 * `name` and the canonical dummyjson deep-link `url`.
 *
 * - Non-paginated, so uses `useQuery` (not `useInfiniteQuery`).
 * - Cached for 24h, matching `useComfys`' staleTime so a hard refresh of
 *   the products query doesn't refetch the categories.
 * - Sorted alphabetically by the prettified `name` for stable rendering.
 * - Returns the full React Query shape (`data`, `isLoading`, `error`, …)
 *   so callers can render shimmer skeletons / fallback copy themselves.
 */
const useCategoryList = () => {
  return useQuery<Category[], Error>({
    queryKey: ["comfyStore", "categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await axiosInstance.get<string[]>(category_list_url);
      const categories = response.data
        .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
        .map<Category>((slug) => ({
          slug,
          name: prettifyCategoryName(slug),
          url: `/products/category/${slug}`,
        }));
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: ms("24h"),
    gcTime: ms("24h"),
  });
};

export default useCategoryList;
