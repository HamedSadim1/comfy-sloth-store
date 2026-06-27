import React, { useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SingleProduct } from "../types";
import { useStore } from "../store";

// Define interface for props
interface PageHeroProps {
  title: string;
  product?: SingleProduct;
}

// Sub-component for breadcrumb navigation
const Breadcrumb: React.FC<PageHeroProps & { onClearFilters: () => void }> = ({
  title,
  product,
  onClearFilters,
}) => (
  <h3>
    <Link to="/">Home</Link>
    {product && (
      <Link onClick={onClearFilters} to="/products">
        / Products
      </Link>
    )}
    /{title}
  </h3>
);

// Main functional component for page hero with breadcrumbs.
//
// `onClearFilters` resets all filter state so clicking the breadcrumb
// "Products" returns the user to the unfiltered catalogue. Previously
// delegated to the legacy FilterContext; now wired to the Zustand store
// directly. We grab the running maxPrice from the store so `clearFilter`
// can reset price to that value without us having to plumb it through.
const PageHero: React.FC<PageHeroProps> = ({ title, product }) => {
  const clearFilter = useStore((state) => state.clearFilter);
  const maxPrice = useStore((state) => state.comfyStoreQuery.maxPrice);
  const handleClearFilters = useCallback(
    () => clearFilter(maxPrice),
    [clearFilter, maxPrice]
  );

  return (
    <Wrapper>
      <div className="section-center">
        <Breadcrumb
          title={title}
          product={product}
          onClearFilters={handleClearFilters}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--clr-primary-10);
  width: 100%;
  min-height: 20vh;
  display: flex;
  align-items: center;

  color: var(--clr-primary-1);
  a {
    color: var(--clr-primary-3);
    padding: 0.5rem;
    transition: var(--transition);
  }
  a:hover {
    color: var(--clr-primary-1);
  }
`;

export default PageHero;
