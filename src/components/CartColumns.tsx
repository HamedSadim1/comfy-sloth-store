import React from "react";
import styled from "styled-components";

// Labels shown in the cart row, aligned to the CartItem grid below.
const LABEL_LIST: { id: string; label: string }[] = [
  { id: "item", label: "Item" },
  { id: "price", label: "Price" },
  { id: "quantity", label: "Quantity" },
  { id: "subtotal", label: "Subtotal" },
  { id: "remove", label: "" },
];

// Functional component: horizontal eyebrow-style header strip for the cart
// listing. Hidden on mobile where each row already labels its own columns.
const CartColumns: React.FC = () => (
  <Wrapper role="row" aria-label="Cart columns">
    {LABEL_LIST.map(({ id, label }) => (
      <span key={id} className={`cell cell-${id}`}>
        {label}
      </span>
    ))}
  </Wrapper>
);

const Wrapper = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: grid;
    /* Aligns to the CartItem desktop grid (image 100px + 4 flexible cols +
       40px remove column). */
    grid-template-columns: 100px 1fr 110px 1fr 40px;
    align-items: center;
    column-gap: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: var(--clr-primary-10);
    border: 1px solid rgba(204, 152, 110, 0.18);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);

    .cell {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--clr-grey-3);
    }

    .cell-item {
      grid-column: 1 / span 2;
    }

    .cell-quantity {
      text-align: center;
    }

    .cell-subtotal,
    .cell-price {
      text-align: right;
    }

    .cell-remove {
      width: 1px;
    }
  }
`;

export default CartColumns;
