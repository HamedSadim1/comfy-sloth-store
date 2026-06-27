import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import { useProductContext } from "../Context/ProductContext";
import { FaTimes } from "react-icons/fa";
import { APP_NAME, links } from "../utils/Contants";
import styled from "styled-components";
import CartButtons from "./CartButton";
import { useUserContext } from "../Context/UserContext";

// Sub-component for sidebar header
const SidebarHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="sidebar-header">
    <img src={logo} className="logo" alt={APP_NAME.toLowerCase()} />
    <button
      className="close-btn"
      onClick={onClose}
      aria-label="Close navigation"
    >
      <FaTimes />
    </button>
  </div>
);

// Sub-component for sidebar links
const SidebarLinks: React.FC<{
  isLoggedIn: boolean;
  onLinkClick: () => void;
}> = ({ isLoggedIn, onLinkClick }) => (
  <ul className="links">
    {links.map((link) => {
      const { id, text, url } = link;
      return (
        <li key={id}>
          <Link onClick={onLinkClick} to={url}>
            {text}
          </Link>
        </li>
      );
    })}
    {isLoggedIn && (
      <li>
        <Link onClick={onLinkClick} to="/checkout">
          checkout
        </Link>
      </li>
    )}
  </ul>
);

// Main functional component for sidebar navigation
const Sidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useProductContext();
  const { myUser } = useUserContext();

  return (
    <SidebarContainer>
      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}`}
        aria-hidden={!isSidebarOpen}
      >
        <SidebarHeader onClose={closeSidebar} />
        <SidebarLinks isLoggedIn={!!myUser} onLinkClick={closeSidebar} />
        <div className="sidebar-cart">
          <CartButtons />
        </div>
      </aside>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(34, 34, 34, 0.45);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    /* One step below the panel so the panel always wins in stacking. */
    z-index: calc(var(--z-overlay) - 1);
    animation: fade-in 0.3s var(--ease-out);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(34, 34, 34, 0.06);
  }

  .close-btn {
    width: 2.5rem;
    height: 2.5rem;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(34, 34, 34, 0.08);
    color: var(--clr-grey-1);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.3s var(--ease-out),
      color 0.3s var(--ease-out), border-color 0.3s var(--ease-out),
      transform 0.3s var(--ease-out);

    svg {
      font-size: 1.1rem;
    }

    &:hover {
      background: var(--clr-red-light);
      color: var(--clr-white);
      border-color: var(--clr-red-light);
      transform: rotate(90deg);
    }

    &:focus-visible {
      outline: 2px solid var(--clr-red-light);
      outline-offset: 2px;
    }
  }

  .logo {
    justify-self: center;
    height: 45px;
  }

  .links {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    flex: 1;
  }

  .links a {
    display: block;
    text-align: left;
    font-size: 1.05rem;
    font-weight: 500;
    text-transform: capitalize;
    padding: 1rem 1.25rem;
    color: var(--clr-grey-2);
    border-radius: var(--radius-md);
    position: relative;
    letter-spacing: 0;
    transition: background 0.3s var(--ease-out),
      color 0.3s var(--ease-out), padding-left 0.3s var(--ease-out);

    /* Animated accent bar on the left */
    &::before {
      content: "";
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      transform-origin: center;
      width: 3px;
      height: 22px;
      background: var(--gradient-accent);
      border-radius: 2px;
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-primary-10);
      color: var(--clr-primary-2);
      padding-left: 1.75rem;
    }

    &:hover::before,
    &:focus-visible::before {
      transform: translateY(-50%) scaleY(1);
    }
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: min(85vw, 380px);
    height: 100%;
    background: var(--clr-white);
    transition: transform 0.4s var(--ease-out);
    transform: translateX(-100%);
    z-index: var(--z-overlay);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
  }

  .show-sidebar {
    transform: translateX(0);
  }

  .sidebar-cart {
    padding: 1.5rem;
    border-top: 1px solid rgba(34, 34, 34, 0.06);

    /* Stack cart/auth buttons vertically inside the sidebar, with bigger tap targets */
    .cart-btn-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      align-items: stretch;
      grid-template-columns: none;
    }

    .cart-btn-wrapper .cart-btn,
    .cart-btn-wrapper .auth-btn {
      font-size: 1rem;
      padding: 0.65rem 1.1rem;
      justify-content: center;
      width: 100%;
    }
  }

  @media screen and (min-width: 992px) {
    .sidebar,
    .overlay {
      display: none;
    }
  }
`;

export default Sidebar;
