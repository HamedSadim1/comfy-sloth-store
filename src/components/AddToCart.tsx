import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { SingleProduct } from "../types";
import { useSingleProductStore } from "../SingleProductStore";
import { useCartContext } from "../Context/CartContext";
import AmountButtons from "./AmountButton";

// Define types for props
interface AddToCartProps {
  product: SingleProduct;
}

interface ColorSelectorProps {
  colors: string[];
  mainColor: string;
  onColorChange: (color: string) => void;
}

// Separate component for color selection to improve reusability and readability
const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  mainColor,
  onColorChange,
}) => {
  return (
    <div className="colors">
      <span>colors :</span>
      <div>
        {colors.map((color, index) => (
          <button
            key={index}
            style={{ background: color }}
            className={`${
              mainColor === color ? "color-btn active" : "color-btn"
            }`}
            onClick={() => onColorChange(color)}
            aria-label={`Select color ${color}`}
          >
            {mainColor === color && <FaCheck />}
          </button>
        ))}
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
    } else {
      console.warn("Cannot increase amount beyond available stock");
    }
  }, [amount, stock, increaseAmount]);

  return (
    <Wrapper>
      <ColorSelector
        colors={colors}
        mainColor={mainColor}
        onColorChange={handleColorChange}
      />
      <div className="btn-container">
        <AmountButtons
          amount={amount}
          decrease={decreaseAmount}
          increase={handleIncrease}
        />
        <Link onClick={handleAddToCart} to="/cart" className="btn">
          add to cart
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 2rem;
  .colors {
    display: grid;
    grid-template-columns: 125px 1fr;
    align-items: center;
    margin-bottom: 1rem;
    span {
      text-transform: capitalize;
      font-weight: 700;
    }
    div {
      display: flex;
    }
  }
  .color-btn {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.75rem;
      color: var(--clr-white);
    }
  }
  .active {
    opacity: 1;
  }
  .btn-container {
    margin-top: 2rem;
  }
  .btn {
    margin-top: 1rem;
    width: 140px;
  }
`;

export default AddToCart;
