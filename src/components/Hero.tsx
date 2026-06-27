import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import heroBcg from "../assets/hero-bcg.jpeg";
import heroBcg2 from "../assets/hero-bcg-2.jpeg";
import { gradientText } from "../styles/gradientText";

// Eyebrow tag at the top of the hero copy (collection / season label)
const Eyebrow: React.FC = () => (
  <span className="eyebrow" aria-label="New collection">
    <span className="dot" />
    New · Spring 2025 collection
  </span>
);

// Hero copy block (eyebrow, heading, subhead, dual CTAs)
const HeroCopy: React.FC = () => (
  <article className="copy">
    <Eyebrow />
    <h1 className="display">
      design your <span className="accent">comfort</span> zone
    </h1>
    <p>
      Timeless furniture and home accents, handpicked for slow living. Build a
      space that feels like a deep breath &mdash; calm, considered, and
      unmistakably yours.
    </p>
    <div className="ctas">
      <Link to="/products" className="primary">
        Shop collection
        <HiArrowRight />
      </Link>
      <Link to="/about" className="secondary">
        Our story
      </Link>
    </div>
  </article>
);

// Hero image block (main + accent + social proof badge)
const HeroImages: React.FC = () => (
  <article className="img-container">
    <div className="img-frame">
      <img
        src={heroBcg}
        alt="a calm, sunlit living room scene"
        className="main-img"
      />
    </div>
    <img
      src={heroBcg2}
      alt="a person enjoying slow moments at home"
      className="accent-img"
    />
    <div className="badge" aria-label="Rated 4.9 out of 5 by over twelve thousand customers">
      <span className="rating">★ 4.9</span>
      <small>Loved by 12k+ customers</small>
    </div>
  </article>
);

// Main hero component: split copy + image layout on desktop, stacked on mobile
const Hero: React.FC = () => {
  return (
    <Wrapper>
      <div className="section-center layout">
        <HeroCopy />
        <HeroImages />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  position: relative;
  padding: 5rem 0 3rem;
  background: var(--gradient-soft);
  overflow: hidden;

  /* Subtle decorative blob in the corner */
  &::before {
    content: "";
    position: absolute;
    width: 520px;
    height: 520px;
    background: radial-gradient(
      circle at center,
      var(--clr-primary-9) 0%,
      transparent 70%
    );
    border-radius: 50%;
    top: -200px;
    right: -180px;
    opacity: 0.55;
    pointer-events: none;
    z-index: 0;
  }

  .layout {
    position: relative;
    z-index: var(--z-base);
    display: grid;
    gap: 3rem;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 1rem;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: var(--clr-primary-2);
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1.25rem;
    box-shadow: var(--shadow-xs);

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--clr-primary-5);
      box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.18);
    }
  }

  .display {
    font-size: var(--fs-display);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--clr-grey-1);
    text-transform: none;
    margin-bottom: 1.5rem;

    .accent {
      ${gradientText}
      font-style: italic;
    }
  }

  .copy p {
    font-size: 1.1rem;
    line-height: 1.65;
    color: var(--clr-grey-5);
    max-width: 36rem;
    margin-bottom: 2rem;
  }

  .ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .primary {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.95rem 1.6rem;
    border-radius: var(--radius-full);
    background: var(--gradient-accent);
    color: var(--clr-white);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.01em;
    text-transform: none;
    transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
    box-shadow: var(--shadow-md);

    svg {
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      svg {
        transform: translateX(4px);
      }
    }
  }

  .secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.95rem 1.4rem;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.6);
    color: var(--clr-grey-1);
    font-weight: 600;
    font-size: 0.95rem;
    border: 1px solid rgba(34, 34, 34, 0.12);
    transition: background 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out), transform 0.3s var(--ease-out);

    &:hover,
    &:focus-visible {
      background: var(--clr-white);
      border-color: rgba(34, 34, 34, 0.25);
      transform: translateY(-2px);
    }
  }

  .img-container {
    position: relative;
    display: none;
  }

  .img-frame {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    background: var(--clr-primary-9);
    aspect-ratio: 4 / 5;
  }

  .main-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s var(--ease-out);
  }

  .img-frame:hover .main-img {
    transform: scale(1.04);
  }

  .accent-img {
    position: absolute;
    bottom: -2rem;
    left: -2rem;
    width: 46%;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    aspect-ratio: 1;
    object-fit: cover;
    border: 6px solid var(--clr-white);
  }

  .badge {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: var(--clr-white);
    border-radius: var(--radius-full);
    padding: 0.65rem 1.05rem;
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;

    .rating {
      font-weight: 700;
      color: var(--clr-grey-1);
      font-size: 0.95rem;
    }

    small {
      color: var(--clr-grey-5);
      font-size: 0.7rem;
    }
  }

  @media (min-width: 992px) {
    padding: 6rem 0 4rem;

    .layout {
      grid-template-columns: 1.05fr 1fr;
      gap: 5rem;
      min-height: calc(100vh - 12rem);
    }

    .img-container {
      display: block;
    }
  }

  @media (min-width: 1280px) {
    .layout {
      min-height: calc(100vh - 10rem);
    }
  }
`;

export default Hero;
