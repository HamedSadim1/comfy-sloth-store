import { keyframes, css } from "styled-components";

/**
 * Brand-toned shimmer keyframe used by loading skeletons.
 *
 * Respects prefers-reduced-motion via the global rule in index.css
 * (animation-duration collapses to ~0).
 */
export const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

/**
 * Reusable gradient ramp shared by every skeleton block. Exposed as a
 * plain CSS string instead of a styled-component interpolation so the
 * same colour ramp appears on every block without copy-paste in CSS.
 */
export const SHIMMER_GRADIENT = `linear-gradient(
  90deg,
  rgba(204, 152, 110, 0.06) 0%,
  rgba(204, 152, 110, 0.22) 50%,
  rgba(204, 152, 110, 0.06) 100%
)`;

/**
 * Apply the shimmer fill on a styled-component block.
 *
 * Tagged via styled-components' `css` helper — interpolating a Keyframes
 * reference directly through `${shimmer}` works at runtime, but styled-
 * components needs the css-tagged template to register the reference in
 * its keyframe tracker so the animation name is stable and de-duplicated
 * across the project.
 */
export const shimmerFill = css`
  background: ${SHIMMER_GRADIENT};
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
