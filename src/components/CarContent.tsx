import React from "react";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi";
import CartColumns from "./CartColumns";
import CartItem from "./CartItem";
import CartTotals from "./CartTotals";
import Button from "./Button";

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
          <Button
            as={Link}
            to="/products"
            variant="ghost"
            iconLeft={<HiArrowLeft aria-hidden="true" />}
          >
            Continue shopping
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={clearCart}
            aria-label="Clear shopping cart"
            iconRight={<FiX aria-hidden="true" />}
          >
            Clear cart
          </Button>
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
