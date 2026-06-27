import React from "react";
import styled from "styled-components";
import { APP_NAME } from "../utils/Contants";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import aboutImg from "../assets/hero-bcg-2.jpeg";
import { services } from "../utils/Contants";

// Small reusable eyebrow pill
const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow">{children}</span>
);

// Custom About hero with breadcrumb + brand statement
const AboutHero: React.FC = () => (
  <HeroSection>
    <div className="section-center">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="current" aria-current="page">
          about
        </span>
      </nav>
      <Eyebrow>About {APP_NAME}</Eyebrow>
      <h1 className="display">
        Slow living, <span className="accent">made well.</span>
      </h1>
      <p className="lede">
        We design furniture for the moments you want to last: a quiet Sunday
        morning, an unhurried meal, a long conversation by lamplight. Built by
        hand, sourced responsibly, and made to age beautifully.
      </p>
    </div>
  </HeroSection>
);

// Story: 2-column with image + narrative + pull quote
const Story: React.FC = () => (
  <StorySection>
    <div className="section-center">
      <div className="layout">
        <div className="image-block">
          <div className="frame">
            <img
              src={aboutImg}
              alt="a quiet, sunlit corner of a furnished living room"
            />
          </div>
          <div className="badge" aria-hidden="true">
            <span>since</span>
            <strong>1996</strong>
          </div>
        </div>
        <div className="copy">
          <Eyebrow>Our story</Eyebrow>
          <h2 className="display-sm">
            A small studio with stubborn standards
          </h2>
          <p>
            {APP_NAME} started in a converted warehouse in 1996, with three
            carpenters, a single sofa design, and a conviction: that furniture
            should be made to be lived with, not looked at.
          </p>
          <p>
            Almost thirty years later, that conviction hasn&rsquo;t changed. We
            still work in small batches, with materials we trust, for people
            who would rather buy one good sofa than three forgettable ones.
          </p>
          <blockquote className="quote">
            <p>
              &ldquo;We don&rsquo;t make furniture for show homes. We make it
              for the kind of home people actually live in.&rdquo;
            </p>
            <cite>&mdash; Founder, {APP_NAME}</cite>
          </blockquote>
        </div>
      </div>
    </div>
  </StorySection>
);

// Pillars: reuse the existing mission / vision / history copy from the
// shared services array, but lay it out as modern cards.
const Pillars: React.FC = () => (
  <PillarsSection>
    <div className="section-center">
      <header className="head">
        <Eyebrow>What we believe</Eyebrow>
        <h2 className="display-sm">Three ideas we won&rsquo;t compromise on</h2>
      </header>
      <div className="grid">
        {services.map(({ id, icon, title, text }) => (
          <article key={id} className="card">
            <span className="icon-wrap" aria-hidden="true">
              {icon}
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  </PillarsSection>
);

// Impact: 4 statistical anchors
const Impact: React.FC = () => {
  const stats: { id: number; figure: string; label: string }[] = [
    { id: 1, figure: "29+", label: "Years of slow craft" },
    { id: 2, figure: "12k", label: "Homes furnished" },
    { id: 3, figure: "98%", label: "Customer satisfaction" },
    { id: 4, figure: "100%", label: "Responsibly sourced timber" },
  ];
  return (
    <ImpactSection>
      <div className="section-center">
        <div className="grid" aria-label="Our impact at a glance">
          {stats.map(({ id, figure, label }) => (
            <article key={id} className="stat">
              <span className="figure">{figure}</span>
              <span className="label">{label}</span>
            </article>
          ))}
        </div>
      </div>
    </ImpactSection>
  );
};

// Final CTA into the collection
const CallToAction: React.FC = () => (
  <CtaSection>
    <div className="section-center">
      <div className="card">
        <Eyebrow>Explore the collection</Eyebrow>
        <h2 className="display-sm">
          Find the piece <span className="accent">that fits your home.</span>
        </h2>
        <p>
          Browse our made-to-order sofas, lighting and home accents &mdash; and
          start building a quieter, more comfortable space.
        </p>
        <Link to="/products" className="cta-btn">
          Shop the collection
          <HiArrowRight />
        </Link>
      </div>
    </div>
  </CtaSection>
);

const AboutPage: React.FC = () => (
  <main>
    <AboutHero />
    <Story />
    <Pillars />
    <Impact />
    <CallToAction />
  </main>
);

export default AboutPage;

/* ===== Styled sections ===== */

const heroSectionMixin = `
  position: relative;
  overflow: hidden;
  background: var(--gradient-soft);

  /* Subtle decorative blob */
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
    top: -150px;
    right: -120px;
    opacity: 0.5;
    pointer-events: none;
    z-index: 0;
  }

  .section-center {
    position: relative;
    z-index: var(--z-base);
  }

  .eyebrow {
    display: inline-block;
    padding: 0.4rem 0.95rem;
    background: rgba(255, 255, 255, 0.7);
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
`;

const HeroSection = styled.section`
  ${heroSectionMixin}
  padding: 4rem 0 5rem;
  text-align: left;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: var(--clr-grey-5);
    margin-bottom: 1.5rem;

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
    max-width: 22ch;

    .accent {
      background: var(--gradient-text);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-style: italic;
    }
  }

  .lede {
    font-size: 1.1rem;
    line-height: 1.65;
    color: var(--clr-grey-5);
    max-width: 36rem;
    margin-bottom: 0;
  }
`;

const StorySection = styled.section`
  padding: 5rem 0;

  .layout {
    display: grid;
    gap: 3rem;
    align-items: start;
  }

  .display-sm {
    font-size: var(--fs-display-sm);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--clr-grey-1);
    text-transform: none;
    line-height: 1.15;
    margin-bottom: 1.5rem;
  }

  .eyebrow {
    display: inline-block;
    padding: 0.4rem 0.95rem;
    background: var(--clr-primary-10);
    color: var(--clr-primary-2);
    font-size: 0.74rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: var(--radius-full);
    margin-bottom: 1rem;
  }

  .image-block {
    position: relative;
  }

  .frame {
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    aspect-ratio: 4 / 5;
    background: var(--clr-primary-9);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.7s var(--ease-out);
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  .badge {
    position: absolute;
    bottom: -1.25rem;
    right: -1.25rem;
    background: var(--clr-white);
    color: var(--clr-grey-1);
    border-radius: var(--radius-lg);
    padding: 1rem 1.25rem;
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;

    span {
      font-size: 0.75rem;
      color: var(--clr-grey-5);
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    strong {
      font-size: 2rem;
      font-weight: 800;
      color: var(--clr-primary-2);
      margin-top: 0.25rem;
    }
  }

  .copy p {
    color: var(--clr-grey-5);
    font-size: 1rem;
    line-height: 1.75;
    margin-bottom: 1.25rem;
    max-width: 38rem;
  }

  .quote {
    margin: 1.75rem 0 0;
    padding: 1.5rem 1.5rem 1.25rem;
    background: var(--clr-primary-10);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--clr-primary-5);
    max-width: 38rem;

    p {
      margin: 0 0 0.6rem;
      font-size: 1.1rem;
      font-style: italic;
      color: var(--clr-grey-2);
      line-height: 1.55;
    }

    cite {
      font-style: normal;
      font-size: 0.85rem;
      color: var(--clr-primary-2);
      font-weight: 600;
      letter-spacing: 0.04em;
    }
  }

  @media (min-width: 768px) {
    .quote {
      padding: 2rem 2rem 1.6rem;

      p {
        font-size: 1.2rem;
      }
    }
  }

  @media (min-width: 992px) {
    padding: 7rem 0;
    .layout {
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: center;
    }
  }
`;

const PillarsSection = styled.section`
  padding: 5rem 0;
  background: var(--gradient-soft);

  .head {
    text-align: center;
    max-width: 38rem;
    margin: 0 auto 3.5rem;

    .display-sm {
      font-size: var(--fs-display-sm);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--clr-grey-1);
      text-transform: none;
      line-height: 1.15;
      margin-bottom: 0;
    }
  }

  .eyebrow {
    display: inline-block;
    padding: 0.4rem 0.95rem;
    background: rgba(255, 255, 255, 0.85);
    color: var(--clr-primary-2);
    font-size: 0.74rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: var(--radius-full);
    margin-bottom: 1rem;
    box-shadow: var(--shadow-xs);
  }

  .grid {
    display: grid;
    gap: 1.5rem;
  }

  .card {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-xl);
    padding: 2.5rem 2rem;
    text-align: left;
    position: relative;
    overflow: hidden;
    transition:
      transform 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out),
      border-color 0.4s var(--ease-out);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--gradient-accent);
      opacity: 0;
      transition: opacity 0.4s var(--ease-out);
    }

    &:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(204, 152, 110, 0.3);

      &::before {
        opacity: 1;
      }
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--clr-primary-2);
      text-transform: capitalize;
      letter-spacing: 0;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--clr-grey-5);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 0;
    }
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: var(--radius-md);
    background: var(--gradient-accent);
    margin-bottom: 1.25rem;
    box-shadow: var(--shadow-sm);
    color: var(--clr-white);
    font-size: 1.5rem;
  }

  @media (min-width: 576px) {
    .grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (min-width: 992px) {
    padding: 7rem 0 8rem;
    .grid {
      gap: 2rem;
    }
  }
`;

const ImpactSection = styled.section`
  padding: 3.5rem 0;
  background: var(--clr-primary-10);

  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);
  }

  .stat {
    background: var(--clr-white);
    border-radius: var(--radius-lg);
    padding: 1.5rem 1.25rem;
    text-align: center;
    border: 1px solid rgba(34, 34, 34, 0.04);
    transition:
      transform 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out),
      border-color 0.4s var(--ease-out);

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--clr-primary-7);
    }

    .figure {
      display: block;
      font-size: clamp(2rem, 3.5vw + 0.5rem, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      background: var(--gradient-text);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .label {
      display: block;
      font-size: 0.78rem;
      color: var(--clr-grey-5);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 600;
    }
  }

  @media (min-width: 576px) {
    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 992px) {
    padding: 5rem 0;
    .stat {
      padding: 2.25rem 1.5rem;
    }
  }
`;

const CtaSection = styled.section`
  padding: 5rem 0 6rem;
  background: var(--clr-white);

  .card {
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      135deg,
      var(--clr-primary-1) 0%,
      #1d1d1d 100%
    );
    border-radius: var(--radius-2xl);
    padding: 3rem 1.75rem;
    text-align: center;
    max-width: 56rem;
    margin: 0 auto;
    box-shadow: var(--shadow-xl);
    color: var(--clr-white);

    /* Decorative blurred glow */
    &::before {
      content: "";
      position: absolute;
      top: -120px;
      right: -100px;
      width: 280px;
      height: 280px;
      background: var(--clr-primary-5);
      opacity: 0.18;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    .eyebrow {
      display: inline-block;
      padding: 0.4rem 0.95rem;
      background: rgba(255, 255, 255, 0.1);
      color: var(--clr-primary-7);
      font-size: 0.74rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      border-radius: var(--radius-full);
      margin-bottom: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .display-sm {
      font-size: clamp(1.75rem, 2.6vw + 0.5rem, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.15;
      text-transform: none;
      margin: 0 auto 1.25rem;
      max-width: 24rem;
      color: var(--clr-white);

      .accent {
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-style: italic;
      }
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
      max-width: 32rem;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.05rem 1.85rem;
    border-radius: var(--radius-full);
    background: var(--gradient-accent);
    color: var(--clr-white);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.01em;
    text-transform: none;
    transition:
      transform 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out);
    box-shadow: var(--shadow-md);

    svg {
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      outline: none;
      svg {
        transform: translateX(4px);
      }
    }
  }

  @media (min-width: 992px) {
    padding: 6rem 0 8rem;
    .card {
      padding: 4.5rem 3rem;
    }
  }
`;
