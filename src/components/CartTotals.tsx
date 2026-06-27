import React, { useCallback } from "react";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD_CENTS,
  qualifiesForFreeShipping,
} from "../utils/helper";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

// Reusable line item row used by the summary card.
interface LineItemProps {
  label: string;
  value: string;
  emphasis?: boolean;
  free?: boolean;
}

const LineItem: React.FC<LineItemProps> = ({ label, value, emphasis, free }) => (
  <div className={`line ${emphasis ? "line-emphasis" : ""}`}>
    <span className="label">{label}</span>
    <span className={`value ${free ? "value-free" : ""}`}>{value}</span>
  </div>
);

interface ActionButtonProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

// Sub-component for action button (checkout or login)
const ActionButton: React.FC<ActionButtonProps> = ({ isLoggedIn, onLogin }) =>
  isLoggedIn ? (
    <Link to="/checkout" className="cta-pill">
      Proceed to checkout
      <HiArrowRight />
    </Link>
  ) : (
    <button
      type="button"
      className="cta-pill cta-pill-secondary"
      onClick={onLogin}
    >
      Login to checkout
      <HiArrowRight />
    </button>
  );

// Main functional component for cart totals
const CartTotals: React.FC = () => {
  const { totalAmount, shippingFee, totalItems } = useCartContext();
  const { myUser, loginWithRedirect } = useUserContext();

  // Handler for login, memoized for performance
  const handleLogin = useCallback(async () => {
    await loginWithRedirect();
  }, [loginWithRedirect]);

  // Free shipping kicks in over €50 cart value, mirroring the trust row
  // copy from the single-product page. Shared helper for cross-component
  // consistency.
  const isFreeShipping = qualifiesForFreeShipping(totalAmount);
  const shippingDisplay = isFreeShipping ? "Free" : formatPrice(shippingFee);
  const grandTotal = isFreeShipping
    ? totalAmount
    : totalAmount + shippingFee;

  return (
    <Wrapper>
      <div className="summary-card" aria-label="Order summary">
        <header className="card-head">
          <span className="eyebrow">Order summary</span>
          <h2 className="title">Cart total</h2>
        </header>

        <div className="lines">
          <LineItem
            label={`Subtotal · ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
            value={formatPrice(totalAmount)}
          />
          <LineItem
            label="Shipping"
            value={shippingDisplay}
            free={isFreeShipping}
          />
          {isFreeShipping && (
            <p className="free-note">
              <FaCheckCircle aria-hidden="true" />
              You unlocked free shipping
            </p>
          )}
          {!isFreeShipping && totalAmount > 0 && (
            <p className="free-hint">
              Add{" "}
              <strong>
                {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - totalAmount)}
              </strong>{" "}
              more to unlock free shipping.
            </p>
          )}
        </div>

        <hr className="divider" />

        <div className="grand-total">
          <span className="label">Total</span>
          <span className="figure">{formatPrice(grandTotal)}</span>
        </div>

        <ActionButton isLoggedIn={!!myUser} onLogin={handleLogin} />

        <p className="tax-note">Taxes calculated at checkout.</p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;

  /* ============== Mobile first: full-width card ============== */
  .summary-card {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-xl);
    padding: 1.5rem 1.25rem;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .card-head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .eyebrow {
    display: inline-block;
    padding: 0.32rem 0.78rem;
    background: var(--clr-primary-10);
    color: var(--clr-primary-2);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: var(--radius-full);
    width: fit-content;
  }

  .title {
    color: var(--clr-grey-1);
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    text-transform: none;
    margin: 0;
  }

  .lines {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .line {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .line .label {
    font-size: 0.85rem;
    color: var(--clr-grey-5);
    letter-spacing: 0;
  }

  .line .value {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--clr-grey-2);
    letter-spacing: 0;
  }

  .value-free {
    color: hsl(125, 50%, 30%);
    font-weight: 700;
  }

  .free-note {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: hsl(125, 50%, 28%);
    background: rgba(86, 158, 100, 0.12);
    border: 1px solid rgba(86, 158, 100, 0.3);
    border-radius: var(--radius-full);
    padding: 0.4rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0.1rem 0 0;
    width: fit-content;
  }

  .free-note svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  .free-hint {
    font-size: 0.78rem;
    color: var(--clr-grey-5);
    margin: 0.2rem 0 0;
    letter-spacing: 0;

    strong {
      color: var(--clr-primary-2);
      font-weight: 700;
    }
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(34, 34, 34, 0.08);
    margin: 0;
  }

  .grand-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
  }

  .grand-total .label {
    font-size: 0.85rem;
    color: var(--clr-grey-3);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 700;
  }

  .grand-total .figure {
    font-size: clamp(1.5rem, 2.2vw + 0.5rem, 1.85rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .cta-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    width: 100%;
    padding: 1.05rem 1.5rem;
    border-radius: var(--radius-full);
    background: var(--gradient-accent);
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
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      filter: brightness(1.05);
      outline: none;
    }

    &:hover svg,
    &:focus-visible svg {
      transform: translateX(4px);
    }

    &:focus-visible {
      box-shadow:
        var(--shadow-lg),
        0 0 0 3px rgba(204, 152, 110, 0.45);
    }
  }

  .cta-pill-secondary {
    background: var(--clr-grey-1);
    box-shadow: var(--shadow-md);

    &:hover,
    &:focus-visible {
      background: var(--clr-primary-2);
    }
  }

  .tax-note {
    font-size: 0.72rem;
    color: var(--clr-grey-6);
    text-align: center;
    margin: 0;
  }

  /* ============== Desktop: sticky and slightly larger ============== */
  @media (min-width: 992px) {
    align-self: start;
    position: sticky;
    top: 6.5rem; /* below glass-blur navbar (5rem) + breathing room */

    .summary-card {
      padding: 1.85rem 1.75rem;
    }
  }
`;

export default CartTotals;
