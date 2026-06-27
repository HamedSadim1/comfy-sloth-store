import React from "react";
import styled, { keyframes } from "styled-components";

export interface ProductGridSkeletonProps {
  /** Layout variant. Matches the real ProductList view toggle. */
  variant?: "grid" | "list";
  /** How many skeleton cards to render. Defaults to 10 (the page size). */
  count?: number;
}

const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/**
 * Skeleton placeholder that mirrors the real product-card layout (a
 * square image block + a name line + a price line) so the transition
 * from "loading" to "loaded" doesn't visibly shift the page.
 *
 * Renders a fixed count of inert, non-interactive placeholders. honours
 * prefers-reduced-motion via the global rule in index.css (animation-
 * duration collapses to ~0).
 */
const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  variant = "grid",
  count = 10,
}) => {
  const items = Array.from({ length: count });

  if (variant === "list") {
    return (
      <ListContainer
        role="status"
        aria-live="polite"
        aria-label="Loading products"
      >
        {items.map((_, i) => (
          <ListCard key={i}>
            <div className="img" aria-hidden="true" />
            <div className="meta" aria-hidden="true">
              <div className="line name" />
              <div className="line price" />
              <div className="line sku" />
            </div>
          </ListCard>
        ))}
      </ListContainer>
    );
  }

  return (
    <GridContainer
      role="status"
      aria-live="polite"
      aria-label="Loading products"
    >
      {items.map((_, i) => (
        <GridCard key={i}>
          <div className="img" aria-hidden="true" />
          <div className="line name" />
          <div className="line price" />
        </GridCard>
      ))}
    </GridContainer>
  );
};

/* Reusable gradient string for the shimmer. Inlined as a JS const instead
   of a styled-component interpolation so the same colour ramp appears on
   every skeleton block without copy-paste in CSS. */
const SHIMMER_GRADIENT = `linear-gradient(
  90deg,
  rgba(204, 152, 110, 0.06) 0%,
  rgba(204, 152, 110, 0.22) 50%,
  rgba(204, 152, 110, 0.06) 100%
)`;

const GridContainer = styled.div`
  display: grid;
  gap: 2.5rem 1.5rem;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.75rem 1.75rem;
  }
  @media (min-width: 1170px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GridCard = styled.article`
  display: flex;
  flex-direction: column;

  .img {
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-lg);
    background: ${SHIMMER_GRADIENT};
    background-size: 200% 100%;
    animation: ${shimmer} 1.4s ease-in-out infinite;
  }

  .line {
    height: 0.95rem;
    border-radius: var(--radius-full);
    margin-top: 0.85rem;
    background: ${SHIMMER_GRADIENT};
    background-size: 200% 100%;
    animation: ${shimmer} 1.4s ease-in-out infinite;

    &.name {
      width: 78%;
      height: 1rem;
    }
    &.price {
      width: 35%;
      margin-top: 0.55rem;
    }
  }
`;

const ListContainer = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
`;

const ListCard = styled.article`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: var(--clr-white);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(34, 34, 34, 0.06);

  .img {
    width: 96px;
    height: 96px;
    border-radius: var(--radius-md);
    background: ${SHIMMER_GRADIENT};
    background-size: 200% 100%;
    animation: ${shimmer} 1.4s ease-in-out infinite;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .line {
    height: 0.85rem;
    border-radius: var(--radius-full);
    background: ${SHIMMER_GRADIENT};
    background-size: 200% 100%;
    animation: ${shimmer} 1.4s ease-in-out infinite;

    &.name {
      width: 60%;
      height: 1rem;
    }
    &.price {
      width: 28%;
    }
    &.sku {
      width: 40%;
      height: 0.7rem;
      opacity: 0.6;
    }
  }
`;

export default ProductGridSkeleton;
