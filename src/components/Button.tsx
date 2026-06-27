import React from "react";
import styled, { css } from "styled-components";

/**
 * Visual variants map to the recurring pill-button designs scattered
 * through the storefront. Each variant produces the same CSS currently
 * hand-written at every call site.
 */
type Variant =
  | "primary" // gradient-accent fill + lift + arrow-shift on the trailing icon
  | "secondary" // soft-bg + dark text + lift (secondary CTAs)
  | "ghost" // outline + lift forward on hover (continue/back links)
  | "danger" // outline-red + filled-red on hover (clear-cart / clear-filters)
  | "cart" // soft primary-10 + gradient-on-hover (navbar cart pill)
  | "icon"; // round icon-button (cart-row remove, etc.)

const baseStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border-radius: var(--radius-full);
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: none;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition:
    transform 0.3s var(--ease-out),
    box-shadow 0.3s var(--ease-out),
    background 0.3s var(--ease-out),
    color 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    filter 0.3s var(--ease-out);
  outline: none;

  &:focus-visible {
    outline: none;
  }
`;

const primary = css`
  padding: 1.05rem 1.5rem;
  background: var(--gradient-accent);
  color: var(--clr-white);
  box-shadow: var(--shadow-md);

  svg {
    width: 1.05rem;
    height: 1.05rem;
    transition: transform 0.3s var(--ease-out);
  }

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    filter: brightness(1.05);
  }

  &:hover:not(:disabled) svg,
  &:focus-visible:not(:disabled) svg {
    transform: translateX(4px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: var(--shadow-sm);
  }

  &:focus-visible:not(:disabled) {
    box-shadow:
      var(--shadow-lg),
      0 0 0 3px rgba(204, 152, 110, 0.45);
  }
`;

const secondary = css`
  padding: 0.95rem 1.4rem;
  background: rgba(255, 255, 255, 0.6);
  color: var(--clr-grey-1);
  border-color: rgba(34, 34, 34, 0.12);

  &:hover,
  &:focus-visible {
    background: var(--clr-white);
    border-color: rgba(34, 34, 34, 0.25);
    transform: translateY(-2px);
    box-shadow: var(--shadow-xs);
  }
`;

const ghost = css`
  padding: 0.85rem 1.25rem;
  background: var(--clr-white);
  color: var(--clr-grey-1);
  border-color: rgba(34, 34, 34, 0.1);
  box-shadow: var(--shadow-xs);

  svg {
    width: 0.95rem;
    height: 0.95rem;
    transition: transform 0.3s var(--ease-out);
  }

  &:hover,
  &:focus-visible {
    background: var(--clr-primary-10);
    color: var(--clr-primary-2);
    border-color: var(--clr-primary-7);
    transform: translateX(-2px);
    box-shadow: var(--shadow-sm);
  }

  &:hover svg,
  &:focus-visible svg {
    transform: translateX(-3px);
  }
`;

const danger = css`
  padding: 0.85rem 1.25rem;
  background: transparent;
  border-color: var(--clr-red-dark);
  color: var(--clr-red-dark);

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover,
  &:focus-visible {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    transform: translateY(-2px);
  }
`;

const cart = css`
  padding: 0.55rem 0.95rem;
  background: var(--clr-primary-10);
  color: var(--clr-primary-2);
  font-size: 0.92rem;

  &:hover,
  &:focus-visible {
    background: var(--gradient-accent);
    color: var(--clr-white);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const icon = css`
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  background: transparent;
  border-color: rgba(34, 34, 34, 0.1);
  color: var(--clr-grey-4);

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }

  &:hover,
  &:focus-visible {
    background: rgba(204, 80, 80, 0.08);
    border-color: var(--clr-red-dark);
    color: var(--clr-red-dark);
    transform: scale(1.06);
  }
`;

const variantCss: Record<Variant, ReturnType<typeof css>> = {
  primary,
  secondary,
  ghost,
  danger,
  cart,
  icon,
};

const StyledPill = styled.button<{
  $variant: Variant;
  $fullWidth?: boolean;
}>`
  ${baseStyle}
  ${({ $variant }) => variantCss[$variant]}
  ${({ $fullWidth }) => ($fullWidth ? "width: 100%;" : "")}
`;

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Visual variant. Default "primary". */
  variant?: Variant;
  /** Render the button edge-to-edge inside its container. */
  fullWidth?: boolean;
  /**
   * Polymorphic element type. Use to render the button as a router
   * Link (e.g. `as={Link}`, with the corresponding `to` prop).
   */
  as?: React.ElementType;
  /** Destination for `as={Link}` polymorphism. Ignored when `as` is the native button. */
  to?: string;
  /** Trailing icon (rendered after children). Hover-translates with arrow-shift on primary. */
  iconRight?: React.ReactNode;
  /** Leading icon (rendered before children). */
  iconLeft?: React.ReactNode;
  /** Optional for icon-only buttons. */
  children?: React.ReactNode;
}

/**
 * Pill-shaped button primitive covering the recurring CTA designs in
 * the storefront. Default tag is `<button>`; for links, use the
 * `as` + `to` props together:
 *
 * <Button as={Link} to="/products" variant="primary">…</Button>
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth = false,
  iconRight,
  iconLeft,
  children,
  ...rest
}) => (
  // `as` is forwarded through `...rest` to the styled-component, which
  // swaps the underlying tag (e.g. <a> when used with react-router-dom's
  // Link). The `to` prop flows through to the Link element.
  <StyledPill $variant={variant} $fullWidth={fullWidth} {...rest}>
    {iconLeft}
    {children}
    {iconRight}
  </StyledPill>
);

export default Button;
