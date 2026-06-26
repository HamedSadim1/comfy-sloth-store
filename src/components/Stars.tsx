import React, { useMemo } from "react";
import styled from "styled-components";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

// Interface for the props of the Stars component
interface StarsProps {
  reviews: number;
  stars: number;
}

// Interface for the props of the StarIcon component
interface StarIconProps {
  fill: number; // 0 for empty, 0.5 for half, 1 for full
  index: number;
}

// Sub-component for rendering a single star icon
const StarIcon: React.FC<StarIconProps> = ({ fill, index }) => {
  if (fill === 1) {
    return <BsStarFill key={index} />;
  }
  if (fill === 0.5) {
    return <BsStarHalf key={index} />;
  }
  return <BsStar key={index} />;
};

// Sub-component for rendering the star rating
const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  // Memoize the star icons array to optimize performance and avoid unnecessary re-renders
  const starIcons = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => {
      const number = index + 0.5;
      let fill = 0;
      if (stars >= index + 1) {
        fill = 1;
      } else if (stars >= number) {
        fill = 0.5;
      }
      return <StarIcon key={index} fill={fill} index={index} />;
    });
  }, [stars]);

  return (
    <div
      className="stars"
      role="img"
      aria-label={`Rating: ${stars.toFixed(1)} out of 5 stars`}
    >
      {starIcons}
    </div>
  );
};

// Main Stars component
const Stars: React.FC<StarsProps> = ({ reviews, stars }) => {
  return (
    <Wrapper>
      <div className="row">
        <StarRating stars={stars} />
        <span className="score" aria-hidden="true">
          {stars.toFixed(1)}
        </span>
      </div>
      <p className="reviews">
        <a href="#reviews">{reviews} customer reviews</a>
      </p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.25rem;

  .row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .stars {
    display: inline-flex;
    align-items: center;
    gap: 0.15rem;
    color: #f5a623;
    font-size: 1.05rem;

    svg {
      filter: drop-shadow(0 1px 1px rgba(245, 166, 35, 0.18));
    }
  }

  .score {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--clr-grey-1);
    letter-spacing: 0;
    background: var(--clr-primary-10);
    padding: 0.2rem 0.55rem;
    border-radius: var(--radius-full);
  }

  .reviews {
    margin: 0;
    font-size: 0.85rem;
    color: var(--clr-grey-5);
    letter-spacing: 0;

    a {
      color: var(--clr-grey-2);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.3s var(--ease-out);

      &:hover {
        color: var(--clr-primary-2);
      }
    }
  }
`;

export default Stars;
