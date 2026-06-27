import React from "react";
import styled from "styled-components";
import { FaCheckCircle } from "react-icons/fa";
import {
  formatPrice,
  qualifiesForFreeShipping,
  computeGrandTotal,
  pluralize,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "../utils/helper";
import Eyebrow from "./Eyebrow";
import { gradientText } from "../styles/gradientText";

interface OrderSummaryProps {
  /** Cart subtotal in cents. */
  totalAmount: number;
  /** Total number of items across every line. */
  totalItems: number;
  /** Shipping fee in cents. Waived when the cart qualifies for free shipping. */
  shippingFee: number;
  /** Singular noun used to count cart items ("item", "piece", …). The
   *  plural form is computed via `pluralize`. */
  itemNoun: string;
  /** Prefix shown before the count in the subtotal line, e.g. "Subtotal"
   *  or "Items". Default "Subtotal". */
  subtotalPrefix?: string;
  /** Heading override. Default "Cart total". */
  title?: string;
  /** When true, render the free-shipping hint / unlocked note inside the
   *  card (CartTotals usage). Default false (Checkout usage). */
  showFreeHint?: boolean;
  /** Optional content rendered at the bottom of the card (e.g. "Secured
   *  by Stripe" on the checkout side). */
  footer?: React.ReactNode;
}

/**
 * Single source of truth for the recurring "Subtotal / Shipping / Total"
 * summary card used by both `CartTotals` and `CheckoutPage`. The two
 * callers differ in three ways:
 *
 *   1. itemNoun  — "item" vs "piece" for the subtotal-by-N label
 *   2. title    — "Cart total" vs "In your bag"
 *   3. showFreeHint — only the cart shows the unlock prompt
 *
 * Everything else (lines, divider, grand-total, gradient-text, sticky
 * desktop positioning) is identical and now lives here.
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalAmount,
  totalItems,
  shippingFee,
  itemNoun,
  subtotalPrefix = "Subtotal",
  title = "Cart total",
  showFreeHint = false,
  footer,
}) => {
  const isFreeShipping = qualifiesForFreeShipping(totalAmount);
  const shippingDisplay = isFreeShipping ? "Free" : formatPrice(shippingFee);
  const grand = computeGrandTotal(totalAmount, shippingFee, isFreeShipping);
  const subtotalLabel = `${subtotalPrefix} · ${pluralize(totalItems, itemNoun)}`;

  return (
    <Summary aria-label="Order summary">
      <header className="card-head">
        <Eyebrow>Order summary</Eyebrow>
        <h2 className="title">{title}</h2>
      </header>

      <div className="lines">
        <div className="line">
          <span className="label">{subtotalLabel}</span>
          <span className="value">{formatPrice(totalAmount)}</span>
        </div>
        <div className="line">
          <span className="label">Shipping</span>
          <span className={`value ${isFreeShipping ? "value-free" : ""}`}>
            {shippingDisplay}
          </span>
        </div>
        {showFreeHint && isFreeShipping && (
          <p className="free-note">
            <FaCheckCircle aria-hidden="true" />
            You unlocked free shipping
          </p>
        )}
        {showFreeHint && !isFreeShipping && totalAmount > 0 && (
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
        <span className="figure">{formatPrice(grand)}</span>
      </div>

      {footer}
    </Summary>
  );
};

const Summary = styled.section`
  background: var(--clr-white);
  border: 1px solid rgba(34, 34, 34, 0.06);
  border-radius: var(--radius-xl);
  padding: 1.5rem 1.25rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  .card-head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
  }

  .free-hint strong {
    color: var(--clr-primary-2);
    font-weight: 700;
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
    ${gradientText}
    font-size: clamp(1.5rem, 2.2vw + 0.5rem, 1.85rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  /* Secured-by-stripe footer rendered below the grand total when callers
     pass a child element with className="secured". Keeping the CSS here
     avoids re-defining it at every call site. */
  .secured {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    color: var(--clr-grey-5);
    font-size: 0.75rem;
    margin: 0;
    text-align: center;
  }

  .secured svg {
    width: 0.95rem;
    height: 0.95rem;
    color: var(--clr-primary-2);
  }

  @media (min-width: 992px) {
    align-self: start;
    position: sticky;
    top: 6.5rem;
    padding: 1.85rem 1.75rem;
  }
`;

export default OrderSummary;
