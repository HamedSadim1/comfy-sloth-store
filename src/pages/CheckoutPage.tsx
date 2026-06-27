import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { StripeCheckout } from "../components";
import { useCartContext } from "../Context/CartContext";
import { formatPrice, qualifiesForFreeShipping } from "../utils/helper";
import Eyebrow from "../components/Eyebrow";
import { gradientText } from "../styles/gradientText";

// Single step in the three-step breadcrumb progress trail.
const StepDot: React.FC<{ index: number; label: string }> = ({
  index,
  label,
}) => (
  <span className="step">
    <span className="step-num" aria-hidden="true">
      {index}
    </span>
    <span className="step-label">{label}</span>
  </span>
);

// Custom compact hero with breadcrumb + 3-step progress + count + order total
const CheckoutHero: React.FC = () => {
  const { totalItems, totalAmount, shippingFee } = useCartContext();
  const grand = totalAmount + shippingFee;

  return (
    <HeroSection>
      <div className="section-center">
        <nav className="breadcrumb" aria-label="Checkout progress">
          <StepDot index={1} label="Cart" />
          <span className="sep" aria-hidden="true" />
          <StepDot index={2} label="Checkout" />
          <span className="sep" aria-hidden="true" />
          <StepDot index={3} label="Confirmation" />
        </nav>
        <Eyebrow tone="glass">Secure checkout</Eyebrow>
        <h1 className="display">
          Almost done<span className="accent">.</span>
        </h1>
        <p className="lede">
          <strong>{totalItems}</strong>{" "}
          {totalItems === 1 ? "item" : "items"} &middot; order total{" "}
          <strong>{formatPrice(grand)}</strong> &middot; encrypted by Stripe.
        </p>
      </div>
    </HeroSection>
  );
};

// Order summary card used as the right column on the checkout page.
const OrderSummary: React.FC = () => {
  const { totalItems, totalAmount, shippingFee } = useCartContext();
  const isFreeShipping = qualifiesForFreeShipping(totalAmount);
  const shippingLabel = isFreeShipping ? "Free" : formatPrice(shippingFee);
  const grand = isFreeShipping ? totalAmount : totalAmount + shippingFee;

  return (
    <SummaryCard aria-label="Order summary">
      <header className="card-head">
        <Eyebrow>Order summary</Eyebrow>
        <h2 className="title">In your bag</h2>
      </header>

      <div className="lines">
        <div className="line">
          <span className="label">
            Items · {totalItems} {totalItems === 1 ? "piece" : "pieces"}
          </span>
          <span className="value">{formatPrice(totalAmount)}</span>
        </div>
        <div className="line">
          <span className="label">Shipping</span>
          <span
            className={`value ${isFreeShipping ? "value-free" : ""}`}
          >
            {shippingLabel}
          </span>
        </div>
      </div>

      <hr className="divider" />

      <div className="grand-total">
        <span className="label">Total</span>
        <span className="figure">{formatPrice(grand)}</span>
      </div>

      <p className="secured">
        <FiLock aria-hidden="true" />
        Secured by Stripe · 256-bit encryption
      </p>
    </SummaryCard>
  );
};

const CheckoutPage: React.FC = () => {
  const { cart } = useCartContext();

  return (
    <main>
      <CheckoutHero />
      <Section>
        <div className="section-center">
          {cart.length < 1 ? (
            <div className="empty-state" aria-label="Empty cart">
              <div className="empty-card">
                <div className="icon-wrap" aria-hidden="true">
                  <FaShoppingCart />
                </div>
                <Eyebrow>Your selection</Eyebrow>
                <h2 className="title">
                  Your cart is empty<span className="accent">.</span>
                </h2>
                <p className="lede">
                  There&rsquo;s nothing to check out yet. Add a piece you love,
                  then come back to complete your order.
                </p>
                <Link to="/products" className="cta-pill">
                  Browse products
                  <HiArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="checkout-grid">
              <div className="payment-col">
                <Link to="/cart" className="back-link">
                  <HiArrowLeft aria-hidden="true" />
                  Back to cart
                </Link>
                <StripeCheckout />
              </div>
              <div className="summary-col">
                <OrderSummary />
              </div>
            </div>
          )}
        </div>
      </Section>
    </main>
  );
};

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  background: var(--gradient-soft);
  padding: 3.5rem 0 2.75rem;

  &::before {
    content: "";
    position: absolute;
    width: 460px;
    height: 460px;
    background: radial-gradient(
      circle at center,
      var(--clr-primary-9) 0%,
      transparent 70%
    );
    border-radius: 50%;
    top: -160px;
    left: -120px;
    opacity: 0.45;
    pointer-events: none;
  }

  .section-center {
    position: relative;
    z-index: var(--z-base);
    text-align: left;
  }

  /* Three-step breadcrumb progress */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    color: var(--clr-grey-5);
    font-size: 0.85rem;

    .step {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .step-num {
      width: 1.4rem;
      height: 1.4rem;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(204, 152, 110, 0.3);
      color: var(--clr-primary-2);
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xs);
    }

    /* The current step (2 — "Checkout") is accented */
    .step:nth-child(3) .step-num {
      background: var(--gradient-accent);
      color: var(--clr-white);
      border-color: transparent;
    }

    .step:nth-child(3) .step-label {
      color: var(--clr-grey-1);
      font-weight: 700;
    }

    .step-label {
      letter-spacing: 0;
      color: var(--clr-grey-4);
    }

    .sep {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1px;
      background: rgba(34, 34, 34, 0.18);
    }
  }

  .display {
    font-size: var(--fs-display-sm);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--clr-grey-1);
    text-transform: none;
    margin-bottom: 1rem;
    max-width: 18ch;
  }

  .display .accent {
    ${gradientText}
  }

  .lede {
    color: var(--clr-grey-5);
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 36rem;
    margin: 0;

    strong {
      color: var(--clr-grey-1);
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    padding: 5rem 0 4rem;

    .display {
      font-size: var(--fs-display);
    }
  }
`;

const Section = styled.section`
  padding: 2rem 0 6rem;

  .checkout-grid {
    display: grid;
    gap: 2rem;
    align-items: start;
  }

  .payment-col {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 0;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.95rem;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(34, 34, 34, 0.08);
    color: var(--clr-grey-1);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    align-self: flex-start;
    transition:
      background 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out),
      box-shadow 0.3s var(--ease-out);

    svg {
      width: 0.9rem;
      height: 0.9rem;
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-white);
      border-color: rgba(34, 34, 34, 0.2);
      transform: translateX(-3px);
      box-shadow: var(--shadow-xs);
      outline: none;
    }

    &:hover svg,
    &:focus-visible svg {
      transform: translateX(-3px);
    }
  }

  /* ===== Empty-state — same dashed soft card pattern as CartPage ===== */
  .empty-state {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  .empty-card {
    width: 100%;
    max-width: 32rem;
    background: var(--clr-primary-9);
    border: 2px dashed rgba(204, 152, 110, 0.55);
    border-radius: var(--radius-2xl);
    padding: 3rem 1.75rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .empty-card::before {
    content: "";
    position: absolute;
    top: -60px;
    left: -60px;
    width: 220px;
    height: 220px;
    background: var(--clr-primary-7);
    opacity: 0.2;
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }

  .empty-card > * {
    position: relative;
    z-index: 1;
  }

  .empty-card .icon-wrap {
    width: 4rem;
    height: 4rem;
    display: grid;
    place-items: center;
    background: var(--clr-white);
    color: var(--clr-primary-2);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
    margin-bottom: 0.5rem;

    svg {
      width: 1.6rem;
      height: 1.6rem;
    }
  }

  .empty-card .title {
    font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--clr-grey-1);
    text-transform: none;
    line-height: 1.15;
    margin: 0.5rem 0 0.5rem;
    max-width: 22rem;
  }

  .empty-card .title .accent {
    ${gradientText}
  }

  .empty-card .lede {
    color: var(--clr-grey-3);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    max-width: 26rem;
  }

  .cta-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 1.05rem 1.85rem;
    border-radius: var(--radius-full);
    background: var(--gradient-accent);
    color: var(--clr-white);
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.01em;
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
  }

  @media (min-width: 992px) {
    padding: 3rem 0 8rem;

    .checkout-grid {
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
      gap: 2.5rem;
    }

    .empty-state {
      padding: 3rem 0;
    }

    .empty-card {
      padding: 4rem 2rem;
    }
  }
`;

const SummaryCard = styled.section`
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

  .secured {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    color: var(--clr-grey-5);
    font-size: 0.75rem;
    margin: 0;
    text-align: center;

    svg {
      width: 0.95rem;
      height: 0.95rem;
      color: var(--clr-primary-2);
    }
  }

  @media (min-width: 992px) {
    align-self: start;
    position: sticky;
    top: 6.5rem;

    padding: 1.85rem 1.75rem;
  }
`;

export default CheckoutPage;
