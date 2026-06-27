import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaShoppingCart } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { gradientText } from "../styles/gradientText";

// Eyebrow pill kept local to this component for self-containment - mirrors
// the rationale in CartHero.tsx. Both replicates share the same future-
// consolidation note: the deltas vs the shared `<Eyebrow tone="soft">`
// primitive would need to be carried as overrides if these local copies
// are ever merged.
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow">{children}</span>
);

// Empty-cart state. Dashed-border soft card on a translucent background, kept
// visually distinct from a regular listing card so users immediately
// recognise "nothing here yet" without needing to parse a list. Rendered by
// CartPage when `cart.length < 1`.
const CartEmptyState: React.FC = () => (
  <EmptySection className="empty-state" aria-label="Empty cart">
    <div className="empty-card">
      <div className="icon-wrap" aria-hidden="true">
        <FaShoppingCart />
      </div>
      <Eyebrow>Your selection</Eyebrow>
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
  </EmptySection>
);

const EmptySection = styled.section`
  /* The previous CartPage layout used an outer '<section className="section">'
     whose '.empty-state' descendant query applied 'display: flex;
     justify-content: center; padding: 2.5rem 0'. After extraction that
     block lives DIRECTLY on EmptySection itself (the equivalent visual is
     'display:flex; justify-content:center; padding: 2.5rem 0' here).
     'className="empty-state"' is forwarded at the call site so any
     descendant query targeting '.empty-state' still matches the same
     element. */
  display: flex;
  justify-content: center;
  padding: 2.5rem 0;

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

  /* .cta-pill is a direct descendant of .empty-card. Hoisting the
     selector to top-level inside EmptySection matches the prior cart-page
     outer-Section descendant query. */
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
    padding: 4rem 0;

    .empty-card {
      padding: 4rem 2rem;
    }
  }
`;

export default CartEmptyState;
