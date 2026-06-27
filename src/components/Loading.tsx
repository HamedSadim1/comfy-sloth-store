import React from "react";
import styled, { keyframes } from "styled-components";

const sizeMap = {
  sm: "2rem",
  md: "3.25rem",
  lg: "4.5rem",
} as const;

export interface LoadingProps {
  /** Optional caption under the spinner. Defaults to a generic "Loading…". */
  label?: string;
  /** Spinner diameter; default medium. */
  size?: keyof typeof sizeMap;
  /** Stretch to a tall, full-bleed wrapper (good for Suspense fallbacks). */
  fullscreen?: boolean;
}

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * Animated brand-coloured spinner with optional caption. Single
 * pseudo-element, respects prefers-reduced-motion via the global rule
 * in index.css.
 *
 * Default usage (no props) renders a 3.25rem spinner + "Loading…" label
 * centred in a padded wrapper so existing call sites (FeaturedProducts,
 * SingleProductPage) keep their visual baseline.
 */
const Loading: React.FC<LoadingProps> = ({
  label = "Loading\u2026",
  size = "md",
  fullscreen = false,
}) => {
  const dim = sizeMap[size];
  return (
    <Wrapper $fullscreen={fullscreen} role="status" aria-live="polite">
      <Spinner $size={dim} aria-hidden="true" />
      {label ? <Caption>{label}</Caption> : null}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $fullscreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: ${({ $fullscreen }) => ($fullscreen ? "2rem 1.5rem" : "4rem 1.5rem")};
  text-align: center;
  color: var(--clr-grey-3);

  ${({ $fullscreen }) =>
    $fullscreen &&
    `
      min-height: calc(100vh - 10rem);
    `}
`;

const Spinner = styled.div<{ $size: string }>`
  position: relative;
  /* inline-block so the same spinner quietly fits inside button text or
     other inline-flow containers without breaking the parent layout */
  display: inline-block;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  /* Two-tone arc: lighter ambient track with a brand-coloured top + right
     ribbon that becomes the visible "head" as the element rotates. */
  border: 3px solid rgba(204, 152, 110, 0.16);
  border-top-color: var(--clr-primary-5);
  border-right-color: var(--clr-primary-4);
  animation: ${rotate} 0.85s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

const Caption = styled.p`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: var(--clr-grey-3);
`;

export interface InlineSpinnerProps {
  /** Matches <Loading>'s size key. */
  size?: keyof typeof sizeMap;
}

/**
 * Bare brand-coloured spinner for inline-flow call sites (button labels,
 * inline status indicators, etc.). Skips <Loading>'s flex Wrapper + caption
 * so it drops into a button's existing inline flow without disrupting
 * layout. ARIA-hidden so the surrounding button's own label stays the
 * single source of truth for screen readers; if you need an announced
 * status, use the full <Loading /> component instead.
 */
export const InlineSpinner: React.FC<InlineSpinnerProps> = ({
  size = "sm",
}) => {
  return <Spinner $size={sizeMap[size]} aria-hidden="true" />;
};

export default Loading;
