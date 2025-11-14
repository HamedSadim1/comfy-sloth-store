import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Error from "./Error";
import Loading from "./Loading";
import Product from "./Product";
import useFeaturedProducts from "../hooks/useFeaturedProducts";
import { Products } from "../types";

// Define interface for the hook return type
interface FeaturedProductsData {
  featuredProducts: Products[] | undefined;
  error: Error | null;
  isLoading: boolean;
}

// Sub-component for section title
const SectionTitle: React.FC = () => (
  <div className="title">
    <h2>featured products</h2>
    <div className="underline"></div>
  </div>
);

// Sub-component for featured products list
interface FeaturedListProps {
  products: Products[];
}

const FeaturedList: React.FC<FeaturedListProps> = ({ products }) => (
  <div className="section-center featured">
    {products.slice(0, 3).map((product) => (
      <Product key={product.id} product={product} />
    ))}
  </div>
);

// Main functional component for featured products section
const FeaturedProducts: React.FC = () => {
  const featuredProducts: FeaturedProductsData | null = useFeaturedProducts();

  // Early return if data is not available
  if (!featuredProducts) return null;

  if (featuredProducts.isLoading) {
    return <Loading />;
  }

  if (featuredProducts.error) {
    return <Error />;
  }

  if (!featuredProducts.featuredProducts) {
    return null;
  }

  return (
    <Wrapper className="section">
      <SectionTitle />
      <FeaturedList products={featuredProducts.featuredProducts} />
      <Link to="/products" className="btn">
        all products
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--clr-grey-10);
  .featured {
    margin: 4rem auto;
    display: grid;
    gap: 2.5rem;
    img {
      height: 225px;
    }
  }
  .btn {
    display: block;
    width: 148px;
    margin: 0 auto;
    text-align: center;
  }
  @media (min-width: 576px) {
    .featured {
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
  }
`;

export default FeaturedProducts;
