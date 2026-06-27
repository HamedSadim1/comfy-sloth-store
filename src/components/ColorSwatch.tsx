import React from "react";
import styled, { css } from "styled-components";
import { FaCheck } from "react-icons/fa";

type Size = "xs" | "md" | "lg";

/** Visual sizes. "xs" = 0.85rem passive dot (CartItem row),
 *  "md" = 1.5rem interactive filter swatch (Filter sidebar),
 *  "lg" = 1.6rem interactive AddToCart swatch. */
const DIMENSIONS: Record<Size, string> = {
  xs: "0.85rem",
  md: "1.5rem",
  lg: "1.6rem",
};

interface ColorSwatchProps {
  /** The swatch color (any CSS color string). */
  color: string;
  /** Visual size. Defaults to "md". */
  size?: Size;
  /** When provided, the swatch becomes a clickable radio button (AddToCart /
   *  Filter usage). Otherwise it renders as a passive inline dot (CartItem
   *  row usage). */
  onClick?: () => void;
  /** Active state — applies bolder scale + active border. */
  active?: boolean;
  /** Render <FaCheck> overlay when active. Used by the Filter sidebar to
   *  confirm the selected colour. Only meaningful for interactive swatches. */
  showCheck?: boolean;
  /** Accessible label. Required for the interactive variant — passing
   *  falls back to the colour string. The component throws a console
   *  warning when missing rather than crashing. */
  ariaLabel?: string;
}

const baseInteractive = css<{ $dim: string; $bg: string }>`
  width: ${({ $dim }) => $dim};
  height: ${({ $dim }) => $dim};
  background: ${({ $bg }) => $bg};
  border-radius: 50%;
  border: 2px solid transparent;
  box-shadow: inset 0 0 0 2px var(--clr-white);
  cursor: pointer;
  opacity: 0.65;
  appearance: none;
  padding: 0;
  display: grid;
  place-items: center;
  transition:
    opacity 0.3s var(--ease-out),
    transform 0.2s var(--ease-out),
    border-color 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out);

  svg {
    width: 0.7rem;
    height: 0.7rem;
    color: var(--clr-white);
  }

  &:hover {
    opacity: 0.95;
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: none;
    opacity: 1;
    box-shadow:
      inset 0 0 0 2px var(--clr-white),
      0 0 0 3px rgba(204, 152, 110, 0.4);
  }

  &[aria-checked="true"] {
    opacity: 1;
    transform: scale(1.05);
    border-color: var(--clr-grey-1);
  }
`;

const basePassive = css<{ $dim: string; $bg: string }>`
  width: ${({ $dim }) => $dim};
  height: ${({ $dim }) => $dim};
  background: ${({ $bg }) => $bg};
  border-radius: 50%;
  display: inline-block;
  box-shadow:
    inset 0 0 0 2px var(--clr-white),
    0 0 0 1px rgba(34, 34, 34, 0.12);
`;

const InteractiveSwatch = styled.button<{
  $dim: string;
  $bg: string;
}>`
  ${baseInteractive}
`;

const PassiveSwatch = styled.span<{ $dim: string; $bg: string }>`
  ${basePassive}
`;

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  size = "md",
  onClick,
  active = false,
  showCheck = false,
  ariaLabel,
}) => {
  const dim = DIMENSIONS[size];

  if (onClick) {
    if (!ariaLabel) {
      // Make interaction impossible to misuse silently; the callsite
      // (AddToCart / Filter) is the authoritative source for the label.
      console.warn(
        "ColorSwatch: interactive variant expects an `ariaLabel` prop for screen readers."
      );
    }
    return (
      <InteractiveSwatch
        type="button"
        role="radio"
        aria-checked={active}
        aria-label={ariaLabel ?? `Select colour ${color}`}
        $dim={dim}
        $bg={color}
        onClick={onClick}
      >
        {showCheck && active ? <FaCheck /> : null}
      </InteractiveSwatch>
    );
  }

  return <PassiveSwatch $dim={dim} $bg={color} aria-hidden="true" />;
};

export default ColorSwatch;
