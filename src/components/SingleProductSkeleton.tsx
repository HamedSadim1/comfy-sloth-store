import React from "react";
import styled from "styled-components";
import { SHIMMER_GRADIENT, shimmer, shimmerFill } from "../styles/shimmer";

/**
 * Skeleton placeholder that mirrors the SingleProductPage card-area
 * layout: a square hero image with a thumbnail strip on the left, and a
 * sticky info card on the right with category chip, title, stars row,
 * price, description lines, meta pills, primary CTA, and the trust row.
 *
 * PageHero is intentionally omitted — without `title` + `product` data
 * it can't mount, and an empty hero placeholder wouldn't read as anything
 * meaningful. The transitions still keep a stable feel because the
 * overall page gradient + min-height on the outer wrapper match the
 * post-load layout.
 *
 * Uses the shared `shimmerFill` helper from `src/styles/shimmer`. The
 * few inline `${SHIMMER_GRADIENT}` + `${shimmer}` blocks remain only on
 * selectors that already uniquely style height/width — every other
 * placeholder block now drops in `shimmerFill` directly.
 */
const SingleProductSkeleton: React.FC = () => {
  return (
    <Wrapper role="status" aria-live="polite" aria-label="Loading product">
      <div className="section section-center page">
        {/* Back-link placeholder */}
        <span className="back-link" aria-hidden="true" />

        <div className="product-center">
          {/* Gallery column */}
          <div className="gallery-col" aria-hidden="true">
            <div className="hero-img" />
            <div className="thumbs-strip">
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
              <div className="thumb" />
            </div>
          </div>

          {/* Info card */}
          <section className="info">
            <div className="info-card">
              <div className="line chip" />
              <div className="line title" />
              <div className="line stars" />
              <div className="line price" />
              <div className="line desc desc-1" />
              <div className="line desc desc-2" />
              <div className="line desc desc-3" />

              <div className="meta-row" aria-hidden="true">
                <div className="meta-pill" />
                <div className="meta-pill" />
                <div className="meta-pill" />
              </div>

              <hr className="divider" />

              <div className="cta-block" aria-hidden="true" />

              <hr className="divider" />

              <div className="trust-row" aria-hidden="true">
                <div className="trust-item">
                  <div className="icon-box" />
                  <div className="trust-meta">
                    <div className="line title" />
                    <div className="line meta" />
                  </div>
                </div>
                <div className="trust-item">
                  <div className="icon-box" />
                  <div className="trust-meta">
                    <div className="line title" />
                    <div className="line meta" />
                  </div>
                </div>
                <div className="trust-item">
                  <div className="icon-box" />
                  <div className="trust-meta">
                    <div className="line title" />
                    <div className="line meta" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background: var(--gradient-soft);
  min-height: calc(100vh - 10rem);

  .section,
  .section-center,
  .page {
    padding: 3rem 0 6rem;
    margin: 0 auto;
    width: 90vw;
    max-width: var(--max-width);
  }

  @media (min-width: 992px) {
    .section,
    .section-center,
    .page {
      width: 95vw;
      padding: 4rem 0 8rem;
    }
  }

  .back-link {
    display: inline-block;
    height: 1.85rem;
    width: 9.5rem;
    border-radius: var(--radius-full);
    margin-bottom: 1.75rem;
    ${shimmerFill}
  }

  .product-center {
    display: grid;
    gap: 2.5rem;
    align-items: start;
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
      gap: 3rem;
    }
  }

  .gallery-col {
    width: 100%;
    min-width: 0;
  }

  .hero-img {
    aspect-ratio: 1 / 1;
    border-radius: var(--radius-xl);
    ${shimmerFill}
  }

  .thumbs-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.85rem;
    margin-top: 1.25rem;

    .thumb {
      aspect-ratio: 1 / 1;
      border-radius: var(--radius-md);
      border: 1px solid rgba(34, 34, 34, 0.06);
      ${shimmerFill}
    }
  }

  .info {
    width: 100%;
    min-width: 0;

    @media (min-width: 992px) {
      position: sticky;
      top: 6.5rem;
    }
  }

  .info-card {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-2xl);
    padding: 2rem 1.5rem;
    box-shadow: var(--shadow-md);
  }

  @media (min-width: 1280px) {
    .info-card {
      padding: 2.5rem 2.25rem;
    }
  }

  .line {
    border-radius: var(--radius-full);
    background: ${SHIMMER_GRADIENT};
    background-size: 200% 100%;
    animation: ${shimmer} 1.4s ease-in-out infinite;

    &.chip {
      height: 1.7rem;
      width: 7.5rem;
      margin-bottom: 1rem;
    }
    &.title {
      height: clamp(2rem, 2.6vw + 0.8rem, 3rem);
      width: 92%;
      margin-bottom: 1rem;
      border-radius: var(--radius-lg);
    }
    &.stars {
      height: 1rem;
      width: 7rem;
      margin-bottom: 1rem;
    }
    &.price {
      height: clamp(1.5rem, 2vw + 0.5rem, 2rem);
      width: 35%;
      margin: 1.25rem 0 1.5rem;
      border-radius: var(--radius-md);
    }
    &.desc {
      height: 0.95rem;
      width: 100%;
      margin-bottom: 0.55rem;
    }
    &.desc-2 {
      width: 88%;
    }
    &.desc-3 {
      width: 60%;
      margin-bottom: 1.75rem;
    }
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;

    .meta-pill {
      height: 1.95rem;
      width: 7rem;
      border-radius: var(--radius-full);
      ${shimmerFill}
    }
  }

  .divider {
    border: none;
    border-top: 1px solid rgba(34, 34, 34, 0.06);
    margin: 1.5rem 0;
  }

  .cta-block {
    height: 3.2rem;
    width: 100%;
    border-radius: var(--radius-full);
    ${shimmerFill}
  }

  .trust-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(204, 152, 110, 0.18);
    background: rgba(204, 152, 110, 0.05);

    .icon-box {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: var(--radius-md);
      ${shimmerFill}
    }

    .trust-meta {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
      min-width: 0;

      .line.title,
      .line.meta {
        border-radius: var(--radius-full);
        background: ${SHIMMER_GRADIENT};
        background-size: 200% 100%;
        animation: ${shimmer} 1.4s ease-in-out infinite;
        margin: 0;
      }
      .line.title {
        height: 0.85rem;
        width: 55%;
      }
      .line.meta {
        height: 0.78rem;
        width: 35%;
      }
    }
  }

  @media (min-width: 992px) {
    .trust-row {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

export default SingleProductSkeleton;
