import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HiArrowRight } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { CartContent } from "../components";
import { useCartContext } from "../Context/CartContext";
import { formatPrice } from "../utils/helper";
import { gradientText } from "../styles/gradientText";

// Eyebrow chip used in the page hero.
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow">{children}</span>
);

// Custom compact hero with breadcrumb + count + estimated total.
const CartHero: React.FC = () => {
  const { totalItems, totalAmount, shippingFee } = useCartContext();
  const estimatedGrand = totalAmount + shippingFee;

  return (
    <HeroSection>
      <div className="section-center">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="current" aria-current="page">
            cart
          </span>
        </nav>
        <Eyebrow>Your selection</Eyebrow>
        <h1 className="display">
          Your cart<span className="accent">.</span>
        </h1>
        <p className="lede">
          {totalItems === 0 ? (
            <>Nothing here yet &mdash; take a look at the collection.</>
          ) : (
            <>
              <strong>{totalItems}</strong>{" "}
              {totalItems === 1 ? "item" : "items"} &middot; estimated total{" "}
              <strong>{formatPrice(estimatedGrand)}</strong>
            </>
          )}
        </p>
      </div>
    </HeroSection>
  );
};

// Empty state shown when there are no items in the cart. Dashed soft card
// to keep it visually distinct from a regular listing card.
const EmptyState: React.FC = () => (
  <section className="empty-state" aria-label="Empty cart">
    <div className="empty-card">
      <div className="icon-wrap" aria-hidden="true">
        <FaShoppingCart />
      </div>
      <span className="eyebrow">Your selection</span>
      <h2 className="title">
        Your cart is empty<span className="accent">.</span>
      </h2>
      <p className="lede">
        Find the piece that belongs in your home &mdash; small batches, made by
        hand, built to last.
      </p>
      <Link to="/products" className="cta-pill">
        Browse products
        <HiArrowRight />
      </Link>
    </div>
  </section>
);

const CartPage: React.FC = () => {
  const { cart } = useCartContext();

  return (
    <main>
      <CartHero />
      <Section className="section">
        <div className="section-center">
          {cart.length < 1 ? <EmptyState /> : <CartContent />}
        </div>
      </Section>
    </main>
  );
};

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  background: var(--gradient-soft);
  padding: 3.5rem 0 2.5rem;

  /* Subtle radial glow */
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
    right: -120px;
    opacity: 0.45;
    pointer-events: none;
  }

  .section-center {
    position: relative;
    z-index: var(--z-base);
    text-align: left;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--clr-grey-5);
    margin-bottom: 1.25rem;

    a {
      color: var(--clr-grey-5);
      transition: color 0.3s var(--ease-out);
    }

    a:hover {
      color: var(--clr-primary-2);
    }

    .current {
      color: var(--clr-grey-1);
      font-weight: 600;
      text-transform: capitalize;
    }
  }

  .eyebrow {
    display: inline-block;
    padding: 0.4rem 0.95rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: var(--clr-primary-2);
    font-size: 0.74rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: var(--radius-full);
    margin-bottom: 1.25rem;
    box-shadow: var(--shadow-xs);
  }

  .display {
    font-size: var(--fs-display-sm);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--clr-grey-1);
    text-transform: none;
    margin-bottom: 1rem;
    max-width: 16ch;
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

  @media (min-width: 992px) {
    padding: 3rem 0 8rem;
  }

  /* Empty state styling — dashed-border soft card to keep it visually
     distinct from a normal listing card. */
  .empty-state {
    display: flex;
    justify-content: center;
    padding: 2.5rem 0;
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

    /* Decorative glow */
    &::before {
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

    > * {
      position: relative;
      z-index: 1;
    }

    .icon-wrap {
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

    .eyebrow {
      display: inline-block;
      padding: 0.32rem 0.78rem;
      background: rgba(255, 255, 255, 0.85);
      color: var(--clr-primary-2);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xs);
    }

    .title {
      font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--clr-grey-1);
      text-transform: none;
      line-height: 1.15;
      margin: 0.5rem 0 0.5rem;
      max-width: 22rem;
    }

  .title .accent {
    ${gradientText}
  }

    .lede {
      color: var(--clr-grey-3);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      max-width: 26rem;
    }
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
    .empty-state {
      padding: 4rem 0;
    }

    .empty-card {
      padding: 4rem 2rem;
    }
  }
`;

export default CartPage;
