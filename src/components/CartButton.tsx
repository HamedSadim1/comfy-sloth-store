import React, { useCallback } from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useProductContext } from "../Context/ProductContext";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";

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

// Sub-component for the cart link to improve reusability
const CartLink: React.FC<CartLinkProps> = ({ totalItems, onClick }) => (
  <Link to="/cart" className="cart-btn" onClick={onClick}>
    <span className="cart-container">
      <FaShoppingCart />
      <span className="cart-value">{totalItems}</span>
    </span>
    <span className="cart-label">Cart</span>
  </Link>
);

// Sub-component for authentication button
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
    <button
      type="button"
      className="auth-btn"
      onClick={onLogin}
      aria-label="Log in"
    >
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

  .cart-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.95rem 0.55rem 0.85rem;
    border-radius: var(--radius-full);
    background: var(--clr-primary-10);
    color: var(--clr-primary-2);
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: 0;
    transition: background 0.3s var(--ease-out),
      color 0.3s var(--ease-out), transform 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out);

    &:hover {
      background: var(--gradient-accent);
      color: var(--clr-white);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  }

  .cart-container {
    display: flex;
    align-items: center;
    position: relative;

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
    transition: background 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out), color 0.3s var(--ease-out),
      transform 0.3s var(--ease-out);

    svg {
      width: 0.95rem;
      height: 0.95rem;
    }

    &:hover {
      background: var(--clr-grey-1);
      color: var(--clr-white);
      border-color: var(--clr-grey-1);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    &:focus-visible {
      outline: 2px solid var(--clr-primary-5);
      outline-offset: 2px;
    }
  }
`;

export default CartButton;
