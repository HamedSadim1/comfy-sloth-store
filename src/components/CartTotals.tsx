import React, { useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import { HiArrowRight } from "react-icons/hi";
import Button from "./Button";
import OrderSummary from "./OrderSummary";

interface ActionButtonProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

// Sub-component for action button (checkout vs login). The primary
// (logged-in) variant uses the shared <Button /> primitive as a Link.
// The secondary (logged-out) variant stays inline because its
// grey-1 → primary-2 fill differs from the available Button variants.
const ActionButton: React.FC<ActionButtonProps> = ({ isLoggedIn, onLogin }) =>
  isLoggedIn ? (
    <Button
      as={Link}
      to="/checkout"
      variant="primary"
      fullWidth
      iconRight={<HiArrowRight />}
    >
      Proceed to checkout
    </Button>
  ) : (
    <button
      type="button"
      className="cta-pill-secondary"
      onClick={onLogin}
    >
      Login to checkout
      <HiArrowRight />
    </button>
  );

const CartTotals: React.FC = () => {
  const { totalAmount, shippingFee, totalItems } = useCartContext();
  const { myUser, loginWithRedirect } = useUserContext();

  // Handler for login, memoized for performance
  const handleLogin = useCallback(async () => {
    await loginWithRedirect();
  }, [loginWithRedirect]);

  return (
    <Wrapper>
      <OrderSummary
        totalAmount={totalAmount}
        totalItems={totalItems}
        shippingFee={shippingFee}
        itemNoun="item"
        subtotalPrefix="Subtotal"
        title="Cart total"
        showFreeHint
      />
      <ActionButton isLoggedIn={!!myUser} onLogin={handleLogin} />
      <p className="tax-note">Taxes calculated at checkout.</p>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;

  /* Secondary (logged-out) CTA keeps its own styling because the
     grey-1 → primary-2 fill isn't represented in the Button variants. */
  .cta-pill-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    width: 100%;
    padding: 1.05rem 1.5rem;
    margin-top: 1.25rem;
    border-radius: var(--radius-full);
    background: var(--clr-grey-1);
    color: var(--clr-white);
    border: none;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: none;
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

    &:hover,
    &:focus-visible {
      background: var(--clr-primary-2);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      filter: brightness(1.05);
      outline: none;
    }

    &:hover svg,
    &:focus-visible svg {
      transform: translateX(4px);
    }
  }

  .tax-note {
    font-size: 0.72rem;
    color: var(--clr-grey-6);
    text-align: center;
    margin: 0.85rem 0 0;
  }
`;

export default CartTotals;
