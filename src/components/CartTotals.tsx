import React, { useCallback } from "react";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import { formatPrice } from "../utils/helper";
import { Link } from "react-router-dom";

// Define types for sub-component props
interface TotalsDisplayProps {
  totalAmount: number;
  shippingFee: number;
}

interface ActionButtonProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

// Sub-component for displaying totals
const TotalsDisplay: React.FC<TotalsDisplayProps> = ({
  totalAmount,
  shippingFee,
}) => (
  <article>
    <h5>
      subtotal : <span>{formatPrice(totalAmount)}</span>
    </h5>
    <p>
      shipping fee : <span>{formatPrice(shippingFee)}</span>
    </p>
    <hr />
    <h4>
      order total : <span>{formatPrice(totalAmount + shippingFee)}</span>
    </h4>
  </article>
);

// Sub-component for action button (checkout or login)
const ActionButton: React.FC<ActionButtonProps> = ({ isLoggedIn, onLogin }) =>
  isLoggedIn ? (
    <Link to="/checkout" className="btn">
      proceed to checkout
    </Link>
  ) : (
    <button type="button" className="btn" onClick={onLogin}>
      login
    </button>
  );

// Main functional component for cart totals
const CartTotals: React.FC = () => {
  const { totalAmount, shippingFee } = useCartContext();
  const { myUser, loginWithRedirect } = useUserContext();

  // Handler for login, memoized for performance
  const handleLogin = useCallback(async () => {
    await loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <Wrapper>
      <div>
        <TotalsDisplay totalAmount={totalAmount} shippingFee={shippingFee} />
        <ActionButton isLoggedIn={!!myUser} onLogin={handleLogin} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }
  h4,
  h5,
  p {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
  p {
    text-transform: capitalize;
  }
  h4 {
    margin-top: 2rem;
  }
  @media (min-width: 776px) {
    justify-content: flex-end;
  }
  .btn {
    width: 100%;
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
  }
`;

export default CartTotals;
