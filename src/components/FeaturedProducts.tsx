import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaArrowRight } from "react-icons/fa";
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

// Section header with eyebrow tag + display heading + lede
const SectionTitle: React.FC = () => (
  <header className="head">
    <span className="eyebrow">curated picks</span>
    <h2>Featured products</h2>
    <p>
      Thoughtfully selected pieces our community can&rsquo;t stop talking about
      this season.
    </p>
  </header>
);

// Featured products grid (reuses the existing Product card)
interface FeaturedListProps {
  products: Products[];
}

const FeaturedList: React.FC<FeaturedListProps> = ({ products }) => (
  <div className="featured">
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
    <Wrapper>
      <div className="section-center">
        <SectionTitle />
        <FeaturedList products={featuredProducts.featuredProducts} />
        <div className="cta-row">
          <Link to="/products" className="all-link">
            Browse all products
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--gradient-soft);
  padding: 5rem 0;

  .head {
    text-align: center;
    margin: 0 auto 3.5rem;
    max-width: 38rem;

    .eyebrow {
      display: inline-block;
      padding: 0.4rem 0.95rem;
      background: var(--clr-primary-10);
      color: var(--clr-primary-2);
      font-size: 0.74rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      border-radius: var(--radius-full);
      margin-bottom: 1rem;
    }

    h2 {
      font-size: var(--fs-display-sm);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--clr-grey-1);
      text-transform: none;
      margin-bottom: 0.85rem;
    }

    p {
      color: var(--clr-grey-5);
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 0;
    }
  }

  .featured {
    display: grid;
    gap: 2.5rem;
    margin-bottom: 3.5rem;

    img {
      height: 280px;
      transition: transform 0.5s var(--ease-out);
    }

    & > article {
      transition: transform 0.4s var(--ease-out);
    }

    & > article:hover {
      transform: translateY(-6px);

      img {
        transform: scale(1.03);
      }
    }
  }

  .cta-row {
    display: flex;
    justify-content: center;
  }

  .all-link {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1rem 1.75rem;
    border-radius: var(--radius-full);
    background: var(--clr-grey-1);
    color: var(--clr-white);
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: none;
    transition: background 0.3s var(--ease-out),
      transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
    box-shadow: var(--shadow-md);

    svg {
      transition: transform 0.3s var(--ease-out);
    }

    &:hover {
      background: var(--clr-primary-2);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);

      svg {
        transform: translateX(4px);
      }
    }
  }

  @media (min-width: 576px) {
    .featured {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (min-width: 992px) {
    padding: 7rem 0 8rem;

    .featured {
      gap: 3rem;
    }
  }
`;

export default FeaturedProducts;
