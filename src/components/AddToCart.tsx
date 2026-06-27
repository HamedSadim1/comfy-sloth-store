import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { SingleProduct } from "../types";
import { useSingleProductStore } from "../SingleProductStore";
import { useCartContext } from "../Context/CartContext";
import AmountButtons from "./AmountButton";
import ColorSwatch from "./ColorSwatch";

// Define types for props
interface AddToCartProps {
  product: SingleProduct;
}

interface ColorSelectorProps {
  colors: string[];
  mainColor: string;
  onColorChange: (color: string) => void;
}

// Separate component for color selection to improve reusability and readability.
// Uses the shared `<ColorSwatch>` primitive (interactive variant) so the
// swatch visuals stay aligned with the Filter sidebar's swatches.
const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  mainColor,
  onColorChange,
}) => {
  return (
    <div className="colors" role="radiogroup" aria-label="Product color">
      <span className="label">Color</span>
      <div className="swatches">
        {colors.map((color) => {
          const isActive = mainColor === color;
          return (
            <ColorSwatch
              key={color}
              color={color}
              size="lg"
              active={isActive}
              ariaLabel={`Select color ${color}`}
              onClick={() => onColorChange(color)}
            />
          );
        })}
      </div>
    </div>
  );
};

// Main component using functional component with hooks
const AddToCart: React.FC<AddToCartProps> = ({ product }) => {
  const { stock, colors } = product;

  // Local state for selected color, initialized to first color
  const [mainColor, setMainColor] = useState<string>(colors[0]);

  // Store selectors for state and actions
  const { addToCart } = useCartContext();
  const setColor = useSingleProductStore((state) => state.setColor);
  const increaseAmount = useSingleProductStore((state) => state.increaseAmount);
  const decreaseAmount = useSingleProductStore((state) => state.decreaseAmount);
  const amount = useSingleProductStore((state) => state.amount);
  const image = useSingleProductStore((state) => state.image);

  // Handler for color change, updates both local and store state
  const handleColorChange = useCallback(
    (color: string) => {
      setMainColor(color);
      setColor(color);
    },
    [setColor]
  );

  // Handler for adding to cart, ensures image is available before proceeding
  const handleAddToCart = useCallback(() => {
    if (!image) {
      console.error("No image selected for the product");
      return;
    }
    addToCart(product, amount, mainColor, image);
  }, [addToCart, product, amount, mainColor, image]);

  // Handler for increasing amount, prevents exceeding stock
  const handleIncrease = useCallback(() => {
    if (amount < stock) {
      increaseAmount();
    }
  }, [amount, stock, increaseAmount]);

  return (
    <Wrapper>
      <ColorSelector
        colors={colors}
        mainColor={mainColor}
        onColorChange={handleColorChange}
      />

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

  /* Color picker — visuals come from the shared <ColorSwatch /> primitive;
     we only style the surrounding swatch container + spacing. */
  .colors {
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }
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
