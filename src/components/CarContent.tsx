import React from "react";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi";
import CartColumns from "./CartColumns";
import CartItem from "./CartItem";
import CartTotals from "./CartTotals";

// Functional component for displaying cart content
// Renders the cart items, totals, and action buttons in a modern layout that
// pairs with the redesigned CartPage wrapper.
const CarContent: React.FC = () => {
  const { clearCart, cart } = useCartContext();

  return (
    <Wrapper>
      <div className="items-col">
        <CartColumns />
        <ul className="items-list" aria-label="Cart items">
          {cart.map((item) => (
            <li key={item.id}>
              <CartItem items={item} />
            </li>
          ))}
        </ul>

        <div className="actions">
          <Link to="/products" className="continue-link">
            <HiArrowLeft aria-hidden="true" />
            Continue shopping
          </Link>
          <button
            type="button"
            className="clear-btn"
            onClick={clearCart}
            aria-label="Clear shopping cart"
          >
            <FiX aria-hidden="true" />
            Clear cart
          </button>
        </div>
      </div>

      <div className="totals-col">
        <CartTotals />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 2rem;
  margin: 0 auto;

  .items-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  /* Wrap each row in a list <li> for semantic grouping. The CartItem itself
     already paints the rounded-xl card so the <li> is just a passthrough. */
  .items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .items-list > li {
    display: block;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.25rem;
  }

  .continue-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.85rem 1.25rem;
    border-radius: var(--radius-full);
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.1);
    color: var(--clr-grey-1);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    transition:
      background 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out),
      box-shadow 0.3s var(--ease-out);
    box-shadow: var(--shadow-xs);

    svg {
      width: 0.95rem;
      height: 0.95rem;
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-primary-10);
      color: var(--clr-primary-2);
      border-color: var(--clr-primary-7);
      transform: translateX(-2px);
      box-shadow: var(--shadow-sm);
      outline: none;
    }

    &:hover svg,
    &:focus-visible svg {
      transform: translateX(-3px);
    }
  }

  .clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.85rem 1.25rem;
    border-radius: var(--radius-full);
    background: transparent;
    border: 1px solid var(--clr-red-dark);
    color: var(--clr-red-dark);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    cursor: pointer;
    transition:
      background 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out);

    svg {
      width: 1rem;
      height: 1rem;
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-red-dark);
      color: var(--clr-white);
      transform: translateY(-2px);
      outline: none;
    }
  }

  @media (min-width: 992px) {
    gap: 2rem;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    align-items: start;
  }

  @media (min-width: 1200px) {
    gap: 2.5rem;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  }
`;

export default CarContent;
