import React from "react";
import styled from "styled-components";
import { services } from "../utils/Contants";

// Define interface for service item
interface ServiceItem {
  id: number;
  icon: React.ReactElement;
  title: string;
  text: string;
}

// Sub-component for services header
const ServiceHeader: React.FC = () => (
  <article className="header">
    <h3>
      custom furniture <br />
      built only for you
    </h3>
    <p>
      Discover the allure of custom furniture at "Comfy Sloth." Crafted
      exclusively for you, our pieces are designed to fit your unique style and
      preferences. Experience the luxury of furniture built with meticulous
      attention to detail, creating a personalized oasis in your home.
    </p>
  </article>
);

// Sub-component for individual service item
interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { id, icon, title, text } = service;

  return (
    <article key={id} className="service">
      <span className="icon">{icon}</span>
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
  h3,
  h4 {
    color: var(--clr-primary-1);
  }
  padding: 5rem 0;

  background: var(--clr-primary-10);

  .header h3 {
    margin-bottom: 2rem;
  }
  p {
    margin-bottom: 0;
    line-height: 1.8;
    color: var(--clr-primary-3);
  }
  .services-center {
    margin-top: 4rem;
    display: grid;
    gap: 2.5rem;
  }
  .service {
    background: var(--clr-primary-7);
    text-align: center;
    padding: 2.5rem 2rem;
    border-radius: var(--radius);
    p {
      color: var(--clr-primary-2);
    }
  }
  span {
    width: 4rem;
    height: 4rem;
    display: grid;
    margin: 0 auto;
    place-items: center;
    margin-bottom: 1rem;
    border-radius: 50%;
    background: var(--clr-primary-10);
    color: var(--clr-primary-1);
    svg {
      font-size: 2rem;
    }
  }
  @media (min-width: 992px) {
    .header {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 576px) {
    .services-center {
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
  }
  @media (min-width: 1280px) {
    padding: 0;
    .section-center {
      transform: translateY(5rem);
    }
  }
`;

export default Services;
