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
    <div className="stars" aria-label={`Rating: ${stars} out of 5 stars`}>
      <span>{starIcons}</span>
    </div>
  );
};

// Main Stars component
const Stars: React.FC<StarsProps> = ({ reviews, stars }) => {
  return (
    <Wrapper>
      <StarRating stars={stars} />
      <p className="reviews">({reviews} customer reviews)</p>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    color: #ffb900;
    font-size: 1rem;
    margin-right: 0.25rem;
  }
  p {
    margin-left: 0.5rem;
    margin-bottom: 0;
  }
  margin-bottom: 0.5rem;
`;

export default Stars;
