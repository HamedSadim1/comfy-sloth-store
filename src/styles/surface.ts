import { css } from "styled-components";

/**
 * Base "surface" card — white background + soft border + radius-xl +
 * shadow-xs. Use as the building block for any panel/card surface in
 * the app.
 */
export const surfaceCard = css`
  background: var(--clr-white);
  border: 1px solid rgba(34, 34, 34, 0.06);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
`;

/**
 * Hover-lift variant — pairs with `surfaceCard` for interactive
 * cards (CartItem rows, TrustStrip tiles, ListView rows, …).
 */
export const surfaceCardHover = css`
  transition:
    transform 0.4s var(--ease-out),
    box-shadow 0.4s var(--ease-out),
    border-color 0.4s var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: rgba(204, 152, 110, 0.3);
  }
`;
