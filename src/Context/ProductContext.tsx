import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { Products, SingleProduct } from "../types";
import { products_url } from "../utils/Contants";

// Interface for the product context value
interface ProductContextProps {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  products: Products[];
  products_loading: boolean;
  products_error: string;
  featuredProducts: Products[];
  singleProduct: SingleProduct;
  singleProductLoading: boolean;
  singleProductError: string;
  fetchSingleProduct: (url: string, id: string) => Promise<void>;
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

  // State for products list
  const [products, setProducts] = useState<Products[]>([]);
  const [products_loading, setProducts_loading] = useState<boolean>(false);
  const [products_error, setProducts_error] = useState<string>("");

  // State for single product
  const [singleProduct, setSingleProduct] = useState<SingleProduct>(
    {} as SingleProduct
  );
  const [singleProductLoading, setSingleProductLoading] =
    useState<boolean>(false);
  const [singleProductError, setSingleProductError] = useState<string>("");

  // Memoized featured products derived from products
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

  // Function to fetch a single product, memoized for performance
  const fetchSingleProduct = useCallback(async (url: string, id: string) => {
    setSingleProductLoading(true);
    setSingleProductError("");
    try {
      const response = await axios.get(`${url}${id}`);
      if (response.statusText === "OK") {
        const single_product: SingleProduct = response.data;
        setSingleProduct(single_product);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setSingleProductError(errorMessage);
    } finally {
      setSingleProductLoading(false);
    }
  }, []);

  // Effect to fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setProducts_loading(true);
      setProducts_error("");
      try {
        const response = await axios.get(products_url);
        if (response.statusText === "OK") {
          const fetchedProducts: Products[] = response.data;
          setProducts(fetchedProducts);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch products";
        setProducts_error(errorMessage);
      } finally {
        setProducts_loading(false);
      }
    };
    fetchProducts();
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
      singleProduct,
      singleProductLoading,
      singleProductError,
      fetchSingleProduct,
    }),
    [
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      products,
      products_loading,
      products_error,
      featuredProducts,
      singleProduct,
      singleProductLoading,
      singleProductError,
      fetchSingleProduct,
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
