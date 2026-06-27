import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCartContext } from "../Context/CartContext";
import { formatPrice } from "../utils/helper";
import { gradientText } from "../styles/gradientText";

// Eyebrow pill kept local to this component so the hero's glass-tinted
// `.eyebrow` styling stays self-contained. The shared `<Eyebrow tone="soft">`
// primitive in `src/components/Eyebrow.tsx` is a deliberate non-adoption
// here: that primitive renders with font-size: 0.7rem / weight: 700 / no
// margin-bottom and `background: var(--clr-primary-10)`, while this hero's
// local `.eyebrow` ships font-size 0.74rem / weight 600 / margin-bottom
// 1.25rem / a translucent rgba(255,255,255,0.85) fill. Adopting the
// primitive would have required `&& .cart-hero-eyebrow { ... }` overrides at
// the call site to preserve the visual exactly, and would re-open the
// specificity-bug class discussed when `.eyebrow` was cleaned up in Hero.tsx.
// CartEmptyState.tsx carries the same local Eyebrow for the same reason.
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow">{children}</span>
);

// Compact cart-route hero: breadcrumb + eyebrow + display title + a lede
// that adapts to empty vs non-empty (item count + estimated total).
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

export default CartHero;
