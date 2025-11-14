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
    Cart
    <span className="cart-container">
      <FaShoppingCart />
      <span className="cart-value">{totalItems}</span>
    </span>
  </Link>
);

// Sub-component for authentication button
const AuthButton: React.FC<AuthButtonProps> = ({
  isAuthenticated,
  onLogin,
  onLogout,
}) =>
  isAuthenticated ? (
    <button type="button" className="auth-btn" onClick={onLogout}>
      Logout <FaUserMinus />
    </button>
  ) : (
    <button type="button" className="auth-btn" onClick={onLogin}>
      Login <FaUserPlus />
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;

    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`;

export default CartButton;
