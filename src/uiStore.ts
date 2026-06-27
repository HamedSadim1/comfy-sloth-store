import { create } from "zustand";

// Interface for cart-route UI state.
//
// Currently only the mobile sidebar visibility lives here. Future UI
// flags (e.g. cart drawer open, search overlay open, theme mode) would
// be added here as well, since this store is the dedicated home for any
// non-persisting, non-server-derived UI state in the app.
interface UiStore {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

/**
 * Zustand store: single source of truth for cart-route UI state.
 *
 * Migrated from `ProductContext` to Zustand in parallel with the
 * `useStore` (filter) migration. The previous `ProductContext.tsx` also
 * exposed `products`, `products_loading`, `products_error`, and
 * `featuredProducts` - those were dead-code leftovers from before the
 * products-Zustand migration (no consumer was reading them via
 * `useProductContext` any more) and have been dropped as part of this
 * move. Anything that needs product data should pull it directly from
 * the `useComfys()` hook.
 *
 * Consumers (sidebar visibility + open / close actions):
 *  - `Sidebar.tsx`   : `isSidebarOpen`, `closeSidebar`
 *  - `CartButton.tsx`: `closeSidebar`
 *  - `Navbar.tsx`    : `openSidebar`
 *
 * Do NOT reintroduce a parallel `ProductContext`-style React-Context
 * wrapper, and do NOT graft unrelated app state (filter, cart, auth)
 * onto this store - keep UI / filter / cart / auth in their own
 * dedicated Zustand stores or React Query caches so the responsibilities
 * stay isolated.
 */
export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: false,

  // Open the mobile sidebar. Single-property update so the simpler
  // `set({ ... })` form is plenty (mirrors the SingleProductStore idiom).
  openSidebar: () => {
    set({ isSidebarOpen: true });
  },

  // Close the mobile sidebar.
  closeSidebar: () => {
    set({ isSidebarOpen: false });
  },
}));
