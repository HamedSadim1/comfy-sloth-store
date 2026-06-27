import React from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Products } from "../types";
import { gradientText } from "../styles/gradientText";

// Define interface for props
interface ProductProps {
  product: Products;
}

// Sub-component for product image with overlay link
interface ProductImageProps {
  image: string;
  name: string;
  id: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, name, id }) => (
  <div className="container">
    <img src={image} alt={name} loading="lazy" />
    <Link
      to={`/products/${id}`}
      className="link"
      aria-label={`View details for ${name}`}
    >
      <FaSearch />
    </Link>
  </div>
);

// Sub-component for product footer (name and price)
interface ProductFooterProps {
  name: string;
  price: number;
}

const ProductFooter: React.FC<ProductFooterProps> = ({ name, price }) => (
  <footer>
    <h5 className="name">{name}</h5>
    <p className="price">{formatPrice(price)}</p>
  </footer>
);

// Main functional component for product card
const Product: React.FC<ProductProps> = ({ product }) => {
  const { id, name, price, image } = product;

  return (
    <Wrapper>
      <ProductImage image={image} name={name} id={id} />
      <ProductFooter name={name} price={price} />
    </Wrapper>
  );
};

const Wrapper = styled.article`
  display: flex;
  flex-direction: column;

  .container {
    position: relative;
    background: var(--clr-grey-10);
    border-radius: var(--radius-lg);
    overflow: hidden;
    aspect-ratio: 1 / 1;
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.7s var(--ease-out);
  }

  .link {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(34, 34, 34, 0.55) 0%,
      rgba(34, 34, 34, 0.35) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.3s var(--ease-out);

    /* Centred pill button */
    &::before {
      content: "";
      position: absolute;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--radius-full);
      background: var(--clr-primary-5);
      transform: scale(0.7);
      transition: transform 0.3s var(--ease-out);
    }

    svg {
      position: relative;
      width: 1rem;
      height: 1rem;
      color: var(--clr-white);
      transition: transform 0.3s var(--ease-out);
    }
  }

  &:hover img {
    transform: scale(1.04);
  }

  &:hover .link {
    opacity: 1;

    &::before {
      transform: scale(1);
    }

    svg {
      transform: scale(1.05);
    }
  }

  &:focus-within .link {
    opacity: 1;
  }

  footer {
    margin-top: 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
  }

  .name {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--clr-grey-1);
    text-transform: capitalize;
    letter-spacing: 0;
    line-height: 1.3;

    /* Two-line clamp keeps cards aligned in the grid */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 0.95rem;
    ${gradientText}
    letter-spacing: 0;
    white-space: nowrap;
  }
`;

export default Product;
