import React from "react";
import styled from "styled-components";
import { services } from "../utils/Contants";
import type { ServicesInterface } from "../types";

// Sub-component for services header
const ServiceHeader: React.FC = () => (
  <article className="header">
    <span className="eyebrow">Our promise</span>
    <h3>
      Custom furniture, <br />
      built only for you
    </h3>
    <p>
      Crafted for your space, your taste, and the way you actually live.
      Discover the difference of furniture made with intention.
    </p>
  </article>
);

// Sub-component for individual service item
interface ServiceCardProps {
  service: ServicesInterface;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, icon, title, text } = service;

  return (
    <article key={id} className="service">
      <span className="icon-wrap" aria-hidden="true">
        <span className="icon">{icon}</span>
      </span>
      <h4>{title}</h4>
      <p>{text}</p>
    </article>
  );
};

// Sub-component for services list
const ServiceList: React.FC = () => (
  <div className="services-center">
    {services.map((service) => (
      <ServiceCard key={service.id} service={service} />
    ))}
  </div>
);

// Main functional component for services section
const Services: React.FC = () => {
  return (
    <Wrapper>
      <div className="section-center">
        <ServiceHeader />
        <ServiceList />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 6rem 0;
  background: var(--gradient-soft);

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

  .header {
    text-align: center;
    max-width: 40rem;
    margin: 0 auto 4rem;

    h3 {
      font-size: var(--fs-display-sm);
      font-weight: 800;
      letter-spacing: -0.02em;
      text-transform: none;
      color: var(--clr-grey-1);
      line-height: 1.15;
      margin-bottom: 0.85rem;
    }

    p {
      color: var(--clr-grey-5);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 0;
    }
  }

  .services-center {
    display: grid;
    gap: 1.5rem;
  }

  .service {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.06);
    border-radius: var(--radius-xl);
    padding: 2.5rem 2rem;
    text-align: left;
    transition: transform 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out), border-color 0.4s var(--ease-out);
    position: relative;
    overflow: hidden;

    /* Accent bar that reveals on hover */
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

    h4 {
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: capitalize;
      color: var(--clr-primary-2);
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
  }

  .icon {
    display: grid;
    place-items: center;
    color: var(--clr-white);
    width: 1.6rem;
    height: 1.6rem;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  @media (min-width: 576px) {
    .services-center {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (min-width: 992px) {
    padding: 7rem 0 9rem;

    .services-center {
      gap: 2rem;
    }
  }
`;

export default Services;
