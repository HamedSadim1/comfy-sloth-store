import React from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import type { Products } from "../types";
import { gradientText } from "../styles/gradientText";

// Define interface for props
interface ListViewProps {
  products: Products[];
}

// Sub-component for individual product item in list view
interface ProductItemProps {
  product: Products;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const { id, image, name, price, description } = product;

  return (
    <article>
      <Link
        to={`/products/${id}`}
        className="image-frame"
        aria-label={`View details for ${name}`}
      >
        <img src={image} alt={name} loading="lazy" />
        <span className="image-overlay" aria-hidden="true">
          <HiArrowRight />
        </span>
      </Link>
      <div className="copy">
        <h4 className="name">{name}</h4>
        <h5 className="price">{formatPrice(price)}</h5>
        <p>{description.substring(0, 150)}...</p>
        <Link to={`/products/${id}`} className="details-btn">
          View details
          <HiArrowRight />
        </Link>
      </div>
    </article>
  );
};

// Main functional component for list view of products
const ListView: React.FC<ListViewProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <Empty>
        <h5>Sorry, no products matched your filters.</h5>
        <p>Try clearing filters or broadening your search.</p>
      </Empty>
    );
  }

  return (
    <Wrapper>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 1.75rem;

  article {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    display: grid;
    gap: 1.5rem;
    transition:
      transform 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out),
      border-color 0.4s var(--ease-out);

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--clr-primary-7);
    }
  }

  .image-frame {
    display: block;
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background: var(--clr-grey-10);
    box-shadow: var(--shadow-xs);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s var(--ease-out);
    }

    .image-overlay {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      width: 2.2rem;
      height: 2.2rem;
      display: grid;
      place-items: center;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.92);
      color: var(--clr-primary-2);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      box-shadow: var(--shadow-sm);
      transition:
        background 0.3s var(--ease-out),
        color 0.3s var(--ease-out),
        transform 0.3s var(--ease-out);

      svg {
        width: 0.95rem;
        height: 0.95rem;
        transition: transform 0.3s var(--ease-out);
      }
    }

    &:hover img {
      transform: scale(1.03);
    }

    &:hover .image-overlay {
      background: var(--gradient-accent);
      color: var(--clr-white);

      svg {
        transform: translateX(2px);
      }
    }
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .name {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--clr-grey-1);
    text-transform: capitalize;
    letter-spacing: 0;
    line-height: 1.2;
  }

  .price {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: var(--clr-primary-2);
    letter-spacing: 0;
    ${gradientText}
  }

  p {
    color: var(--clr-grey-5);
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 38rem;
    margin: 0 0 1rem;
  }

  .details-btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 1.2rem;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--clr-grey-1);
    border: 1px solid rgba(34, 34, 34, 0.14);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    transition:
      background 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out);
    box-shadow: var(--shadow-xs);

    svg {
      width: 0.95rem;
      height: 0.95rem;
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-grey-1);
      color: var(--clr-white);
      border-color: var(--clr-grey-1);
      transform: translateY(-1px);
      outline: none;

      svg {
        transform: translateX(3px);
      }
    }
  }

  @media (min-width: 992px) {
    gap: 2rem;

    article {
      grid-template-columns: 280px minmax(0, 1fr);
      align-items: center;
      padding: 2rem;
      gap: 2.5rem;
    }
  }
`;

const Empty = styled.div`
  background: var(--clr-primary-10);
  border-radius: var(--radius-xl);
  padding: 3rem 1.5rem;
  text-align: center;
  border: 1px dashed rgba(204, 152, 110, 0.4);

  h5 {
    text-transform: none;
    color: var(--clr-grey-1);
    font-size: 1.15rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--clr-grey-5);
    font-size: 1rem;
    margin-bottom: 0;
  }
`;

export default ListView;
