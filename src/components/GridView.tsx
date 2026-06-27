import React from "react";
import styled from "styled-components";
import Product from "./Product";
import type { Products } from "../types";

// Define interface for props
interface GridViewProps {
  products: Products[];
}

// Functional component for displaying products in a grid layout
const GridView: React.FC<GridViewProps> = ({ products }) => {
  return (
    <Wrapper>
      <div className="products-container">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .products-container {
    display: grid;
    gap: 2.5rem 1.5rem;
  }

  @media (min-width: 576px) {
    .products-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 992px) {
    .products-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 2.75rem 1.75rem;
    }
  }

  @media (min-width: 1170px) {
    .products-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

export default GridView;
