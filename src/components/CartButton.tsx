import React, { useCallback } from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProductContext } from "../Context/ProductContext";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import Button from "./Button";

// Define types for sub-component props
interface CartLinkProps {
  totalItems: number;
  onClick: () => void;
}

interface AuthButtonProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

// Sub-component for the cart link — wraps <Link> with the shared
// <Button variant="cart" /> primitive.
const CartLink: React.FC<CartLinkProps> = ({ totalItems, onClick }) => (
  <Button
    as={Link}
    to="/cart"
    variant="cart"
    onClick={onClick}
    aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
  >
    <span className="cart-container">
      <FaShoppingCart />
      <span className="cart-value">{totalItems}</span>
    </span>
    <span className="cart-label">Cart</span>
  </Button>
);

// Sub-component for authentication button. The secondary styling is
// hand-tuned for an `outline → inverted-grey` transition that doesn't
// fully map to the available Button variants, so the body lives here
// and only the typography + base layout borrow from the design system.
const AuthButton: React.FC<AuthButtonProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
}) =>
  isAuthenticated ? (
    <button
      type="button"
      className="auth-btn"
      onClick={onLogout}
      aria-label="Log out"
    >
      <span className="auth-label">Logout</span>
      <FaUserMinus />
    </button>
  ) : (
    <button type="button" className="auth-btn" onClick={onLogin} aria-label="Log in">
      <span className="auth-label">Login</span>
      <FaUserPlus />
    </button>
  );

// Main functional component for cart and auth buttons
const CartButton: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useUserContext();
  const { closeSidebar } = useProductContext();
  const { totalItems, clearCart } = useCartContext();

  // Handler for login, memoized for performance
  const handleLogin = useCallback(async () => {
    await loginWithRedirect();
  }, [loginWithRedirect]);

  // Handler for logout, clears cart and logs out
  const handleLogout = useCallback(() => {
    clearCart();
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [clearCart, logout]);

  return (
    <Wrapper className="cart-btn-wrapper">
      <CartLink totalItems={totalItems} onClick={closeSidebar} />
      <AuthButton
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 0.6rem;

  /* The cart-link visual rules come from <Button variant="cart" />;
     we only style the inner cart-container and the value-bubble here. */
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    gap: 0.4rem;

    svg {
      height: 1.15rem;
      width: 1.15rem;
    }
  }

  .cart-value {
    position: absolute;
    top: -10px;
    right: -12px;
    background: var(--clr-red-dark);
    color: var(--clr-white);
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 700;
    box-shadow: 0 0 0 2px var(--clr-white);
  }

  /* Auth button keeps its custom hover-inverted styling (outline →
     filled grey-1) — too specific to fit the shared Button variants. */
  .auth-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: transparent;
    border: 1px solid rgba(34, 34, 34, 0.14);
    color: var(--clr-grey-1);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem 0.95rem;
    border-radius: var(--radius-full);
    cursor: pointer;
    letter-spacing: 0;

    svg {
      width: 0.95rem;
      height: 0.95rem;
    }
  }

  .auth-btn:hover {
    background: var(--clr-grey-1);
    color: var(--clr-white);
    border-color: var(--clr-grey-1);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .auth-btn:focus-visible {
    outline: 2px solid var(--clr-primary-5);
    outline-offset: 2px;
  }
`;

export default CartButton;
