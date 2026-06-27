import React from "react";
import styled from "styled-components";

type Tone = "soft" | "glass";

interface EyebrowProps {
  children: React.ReactNode;
  /** Visual tone. "soft" leans primary-10 (cart/checkout/service eyebrows);
   *  "glass" applies a translucent backdrop with blur (Hero eyebrow). */
  tone?: Tone;
  /** Accessible label for screen readers when the content is purely visual. */
  ariaLabel?: string;
  /** Forward extra className for grid placement / display tweaks at the call site. */
  className?: string;
}

const Wrap = styled.span<{ $tone: Tone }>`
  display: ${({ $tone }) =>
    $tone === "glass" ? "inline-flex" : "inline-block"};
  align-items: center;
  gap: 0.55rem;
  padding: ${({ $tone }) =>
    $tone === "glass" ? "0.45rem 1rem" : "0.32rem 0.78rem"};
  border-radius: var(--radius-full);
  background: ${({ $tone }) =>
    $tone === "glass"
      ? "rgba(255, 255, 255, 0.7)"
      : "var(--clr-primary-10)"};
  -webkit-backdrop-filter: ${({ $tone }) =>
    $tone === "glass" ? "blur(8px)" : "none"};
  backdrop-filter: ${({ $tone }) =>
    $tone === "glass" ? "blur(8px)" : "none"};
  border: ${({ $tone }) =>
    $tone === "glass" ? "1px solid rgba(255, 255, 255, 0.6)" : "none"};
  color: var(--clr-primary-2);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  box-shadow: ${({ $tone }) =>
    $tone === "glass" ? "var(--shadow-xs)" : "none"};
  width: ${({ $tone }) => ($tone === "glass" ? "auto" : "fit-content")};
`;

const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  tone = "soft",
  ariaLabel,
  className,
}) => (
  <Wrap $tone={tone} aria-label={ariaLabel} className={className}>
    {children}
  </Wrap>
);

export default Eyebrow;
