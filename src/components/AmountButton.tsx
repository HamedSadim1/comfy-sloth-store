import React from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";

// Define interface for props to ensure type safety
interface AmountButtonProps {
  increase: () => void;
  decrease: () => void;
  amount: number;
}

// Functional component for amount selection buttons
// This component is reusable and handles increment/decrement of quantity
const AmountButton: React.FC<AmountButtonProps> = ({
  increase,
  decrease,
  amount,
}) => {
  return (
    <Wrapper className="amount-btn">
      {/* Decrease button with accessibility label */}
      <button
        type="button"
        className="amount-btn"
        onClick={decrease}
        aria-label="Decrease quantity"
      >
        <FaMinus />
      </button>
      {/* Display current amount */}
      <h2 className="amount">{amount}</h2>
      {/* Increase button with accessibility label */}
      <button
        type="button"
        className="amount-btn"
        onClick={increase}
        aria-label="Increase quantity"
      >
        <FaPlus />
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  width: 140px;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  h2 {
    margin-bottom: 0;
  }
  button {
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    padding: 1rem 0;
    width: 2rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h2 {
    margin-bottom: 0;
  }
`;
export default AmountButton;
