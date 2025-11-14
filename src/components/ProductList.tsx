import React, { useEffect } from "react";
import { useStore } from "../store";
import useComfys from "../hooks/useComfye";
import ListView from "./ListView";
import GridView from "./GridView";
import useFilterProducts from "../hooks/useFilterProducts";
import { Products } from "../types";

// Main functional component for product list with filtering and view switching
const ProductList: React.FC = () => {
  // Retrieve filter and view state from store
  const searchText = useStore((state) => state.comfyStoreQuery.searchText);
  const freeShipping = useStore(
    (state) => state.comfyStoreQuery.showAllFreeShipping
  );
  const gridView = useStore((state) => state.comfyStoreQuery.gridView);
  const setNumberOfProducts = useStore((state) => state.setNumberOfProducts);
  const category = useStore((state) => state.comfyStoreQuery.category);
  const company = useStore((state) => state.comfyStoreQuery.company);
  const color = useStore((state) => state.comfyStoreQuery.color);
  const price = useStore((state) => state.comfyStoreQuery.price);

  // Fetch products data
  const { data, error, isLoading } = useComfys();

  const products: Products[] = data || [];

  // Filter products based on current filters
  const filteredProducts = useFilterProducts({
    products,
    searchText,
    showAllFreeShipping: freeShipping,
    category,
    company,
    color,
    price,
  });

  // Update the number of products in store when filtered products change
  useEffect(() => {
    setNumberOfProducts(filteredProducts);
  }, [filteredProducts, setNumberOfProducts]);

  // Handle error state
  if (error) {
    return <h5>{error.message}</h5>;
  }

  // Handle loading state
  if (isLoading) {
    return <h5>Loading...</h5>;
  }

  // Render appropriate view based on gridView state
  if (!gridView) {
    return <ListView products={filteredProducts} />;
  }

  return <GridView products={filteredProducts} />;
};

export default ProductList;
