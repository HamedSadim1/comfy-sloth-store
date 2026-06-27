import React, { useCallback } from "react";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { SingleProduct } from "../types";
import { useSingleProductStore } from "../SingleProductStore";
import { useCartContext } from "../Context/CartContext";
import AmountButtons from "./AmountButton";

// Define types for props
interface AddToCartProps {
  product: SingleProduct;
}

// Main component using functional component with hooks.
//
// Color picker: removed (dummyjson exposes no `color` field per
// product). The cart payload is still typed as `addToCart(product,
// amount, color, image)`, so we pass an empty string for the
// `color` slot to keep the CartContext payload shape stable. The
// downstream CartItem previously rendered a coloured swatch row
// keyed off `cartItem.color`; that branch is also gone, so the
// empty string stays inert across the pipeline.
const AddToCart: React.FC<AddToCartProps> = ({ product }) => {
  const { stock } = product;

  // Store selectors for state and actions
  const { addToCart } = useCartContext();
  const increaseAmount = useSingleProductStore((state) => state.increaseAmount);
  const decreaseAmount = useSingleProductStore((state) => state.decreaseAmount);
  const amount = useSingleProductStore((state) => state.amount);
  const image = useSingleProductStore((state) => state.image);

  // Handler for adding to cart, ensures image is available before proceeding.
  // The CartContext signature now takes (product, amount, image) — the
  // empty-string colour placeholder that AddToCart previously thread
  // through is gone, since dummyjson has no real colour data and the
  // `CartItem.color` field was deleted in lockstep.
  const handleAddToCart = useCallback(() => {
    if (!image) {
      console.error("No image selected for the product");
      return;
    }
    addToCart(product, amount, image);
  }, [addToCart, product, amount, image]);

  // Handler for increasing amount, prevents exceeding stock
  const handleIncrease = useCallback(() => {
    if (amount < stock) {
      increaseAmount();
    }
  }, [amount, stock, increaseAmount]);

  return (
    <Wrapper>
      <div className="qty-row">
        <span className="label">Quantity</span>
        <AmountButtons
          amount={amount}
          decrease={decreaseAmount}
          increase={handleIncrease}
        />
      </div>

      <button type="button" className="add-btn" onClick={handleAddToCart}>
        <FaShoppingCart />
        <span>Add to cart</span>
      </button>

      <p className="sub-note">
        {stock > 0 && stock <= 5
          ? `Only ${stock} left — order soon`
          : "In stock — ready to ship"}
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--clr-grey-3);
    margin-bottom: 0.55rem;
  }

  /* Quantity row */
  .qty-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Add to cart button — kept inline because the rotate-icon-on-hover
     microinteraction isn't worth forcing into the shared Button primitive
     on its own. */
  .add-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: var(--radius-full);
    background: var(--gradient-accent);
    color: var(--clr-white);
    font-weight: 700;
    font-size: 1rem;
    text-transform: none;
    letter-spacing: 0.01em;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition:
      transform 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out),
      filter 0.3s var(--ease-out);

    svg {
      width: 1.05rem;
      height: 1.05rem;
      transition: transform 0.3s var(--ease-out);
    }

    &:hover:not(:disabled),
    &:focus-visible:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      filter: brightness(1.05);
      outline: none;

      svg {
        transform: translateX(2px) rotate(-8deg);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--clr-primary-5);
      outline-offset: 2px;
    }
  }

  .sub-note {
    margin: 0;
    font-size: 0.78rem;
    color: var(--clr-grey-5);
    letter-spacing: 0;
    text-align: center;
  }

  @media (min-width: 576px) {
    .add-btn {
      width: auto;
      min-width: 240px;
    }
  }
`;

export default AddToCart;
