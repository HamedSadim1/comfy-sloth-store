import React from "react";
import styled from "styled-components";
import { FiTruck, FiRefreshCw, FiShield, FiAward } from "react-icons/fi";

// Each item has an icon, a short title, and a sub-line
interface TrustItem {
  id: number;
  icon: React.ReactElement;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    id: 1,
    icon: <FiTruck />,
    title: "Free shipping",
    description: "On orders over €50",
  },
  {
    id: 2,
    icon: <FiRefreshCw />,
    title: "30-day returns",
    description: "No questions asked",
  },
  {
    id: 3,
    icon: <FiShield />,
    title: "Secure checkout",
    description: "Powered by Stripe",
  },
  {
    id: 4,
    icon: <FiAward />,
    title: "Handcrafted quality",
    description: "Built to last",
  },
];

const TrustStrip: React.FC = () => (
  <Wrapper aria-label="Why shop with Comfy Sloth">
    <div className="section-center grid">
      {trustItems.map(({ id, icon, title, description }) => (
        <article key={id} className="item">
          <span className="icon" aria-hidden="true">
            {icon}
          </span>
          <div className="text">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </article>
      ))}
    </div>
  </Wrapper>
);

const Wrapper = styled.section`
  padding: 1.5rem 0 2.5rem;
  background: var(--clr-white);

  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: var(--clr-primary-10);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(204, 152, 110, 0.18);
    transition: transform 0.4s var(--ease-out),
      box-shadow 0.4s var(--ease-out),
      border-color 0.4s var(--ease-out),
      background 0.4s var(--ease-out);

    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--clr-primary-7);
      background: var(--clr-white);
    }
  }

  .icon {
    flex-shrink: 0;
    width: 2.75rem;
    height: 2.75rem;
    display: grid;
    place-items: center;
    background: var(--clr-white);
    color: var(--clr-primary-2);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);
    transition: transform 0.4s var(--ease-out),
      color 0.4s var(--ease-out);

    svg {
      width: 1.3rem;
      height: 1.3rem;
    }
  }

  .item:hover .icon {
    background: var(--gradient-accent);
    color: var(--clr-white);
    transform: scale(1.05);
  }

  .text {
    display: flex;
    flex-direction: column;
  }

  h3 {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--clr-grey-1);
    text-transform: none;
    margin-bottom: 0.15rem;
    letter-spacing: 0;
  }

  p {
    font-size: 0.8rem;
    color: var(--clr-grey-5);
    margin-bottom: 0;
    line-height: 1.4;
  }

  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 992px) {
    padding: 2.5rem 0 3rem;

    .grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }
`;

export default TrustStrip;
