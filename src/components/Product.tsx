import React from "react";
import styled from "styled-components";
import { formatPrice } from "../utils/helper";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Products } from "../types";

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
    <img src={image} alt={name} />
    <Link to={`/products/${id}`} className="link">
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
    <h5>{name}</h5>
    <p>{formatPrice(price)}</p>
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
  .container {
    position: relative;
    background: var(--clr-black);
    border-radius: var(--radius);
  }
  img {
    width: 100%;
    display: block;
    object-fit: cover;
    border-radius: var(--radius);
    transition: var(--transition);
  }
  .link {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary-5);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);
    opacity: 0;
    cursor: pointer;
    svg {
      font-size: 1.25rem;
      color: var(--clr-white);
    }
  }
  .container:hover img {
    opacity: 0.5;
  }
  .container:hover .link {
    opacity: 1;
  }
  footer {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer h5,
  footer p {
    margin-bottom: 0;
    font-weight: 400;
  }

  footer p {
    color: var(--clr-primary-5);
    letter-spacing: var(--spacing);
  }
`;

export default Product;
