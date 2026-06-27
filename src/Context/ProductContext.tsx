import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Products } from "../types";
import useComfys from "../hooks/useComfye";

// Interface for the product context value
interface ProductContextProps {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  products: Products[];
  products_loading: boolean;
  products_error: string;
  featuredProducts: Products[];
}

// Create context with undefined default for proper error checking
const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  // State for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Pull the product list through the react-query-backed hook
  // (which now hits dummyjson.com and runs each item through the mapper).
  // `useComfys` returns an `InfiniteData<ProductsPage>` shape — flatMap
  // across the loaded pages to expose the running Products[] to the rest
  // of the tree, which doesn't need to know about pagination.
  const {
    data,
    isLoading: products_loading,
    error: productsQueryError,
  } = useComfys();
  const products = useMemo<Products[]>(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data]
  );
  const products_error =
    (productsQueryError as Error | null)?.message ?? "";

  // Memoized featured products derived from products (the mapper marks any
  // item with rating >= 4.0 as featured, so the Home page always has picks).
  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.featured === true);
  }, [products]);

  // Handler to open sidebar, memoized for performance
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  // Handler to close sidebar, memoized for performance
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Context value, memoized to prevent unnecessary re-renders
  const contextValue = useMemo<ProductContextProps>(
    () => ({
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      products,
      products_loading,
      products_error,
      featuredProducts,
    }),
    [
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      products,
      products_loading,
      products_error,
      featuredProducts,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProductContext = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export default { ProductContext, ProductProvider };
