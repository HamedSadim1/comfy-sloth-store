import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import { FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { links } from "../utils/Contants";
import CartButtons from "./CartButton";
import { useProductContext } from "../Context/ProductContext";

// Nav header: logo + mobile toggle button
const NavHeader: React.FC<{ onToggle: () => void }> = ({ onToggle }) => (
  <div className="nav-header">
    <Link to="/" className="logo-link" aria-label="Comfy Sloth home">
      <img src={logo} alt="comfy sloth" />
    </Link>
    <button
      type="button"
      className="nav-toggle"
      onClick={onToggle}
      aria-label="Open navigation menu"
    >
      <FaBars />
    </button>
  </div>
);

// Nav links, with active state via NavLink
const NavLinks: React.FC = () => (
  <ul className="nav-links">
    {links.map((link) => {
      const { id, text, url } = link;
      return (
        <li key={id}>
          <NavLink
            to={url}
            end={url === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {text}
          </NavLink>
        </li>
      );
    })}
  </ul>
);

// Main functional component for the navbar
const Navbar: React.FC = () => {
  const { openSidebar } = useProductContext();

  return (
    <NavContainer>
      <div className="nav-center">
        <NavHeader onToggle={openSidebar} />
        <NavLinks />
        <CartButtons />
      </div>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: var(--z-overlay);
  height: 5rem;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-bottom: 1px solid rgba(34, 34, 34, 0.06);
  box-shadow: 0 4px 20px rgba(34, 34, 34, 0.03);
  transition: box-shadow 0.3s var(--ease-out),
    background 0.3s var(--ease-out);

  .nav-center {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .nav-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-link {
    display: inline-flex;
    align-items: center;
    transition: transform 0.3s var(--ease-out);

    img {
      width: 150px;
      height: auto;
      display: block;
    }

    &:hover {
      transform: scale(1.02);
    }
  }

  .nav-toggle {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(34, 34, 34, 0.08);
    color: var(--clr-grey-1);
    cursor: pointer;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-md);
    display: grid;
    place-items: center;
    transition: background 0.3s var(--ease-out),
      border-color 0.3s var(--ease-out),
      color 0.3s var(--ease-out),
      transform 0.2s var(--ease-out);

    svg {
      font-size: 1.1rem;
    }

    &:hover {
      background: var(--clr-primary-10);
      border-color: var(--clr-primary-7);
      color: var(--clr-primary-2);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid var(--clr-primary-5);
      outline-offset: 2px;
    }
  }

  .nav-links {
    display: none;
  }

  @media (min-width: 992px) {
    .nav-toggle {
      display: none;
    }

    .nav-center {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 2rem;
    }

    .nav-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;

      li {
        position: relative;
      }

      .nav-link {
        position: relative;
        display: inline-block;
        color: var(--clr-grey-3);
        font-size: 0.95rem;
        font-weight: 500;
        text-transform: capitalize;
        padding: 0.65rem 0.95rem;
        border-radius: var(--radius-sm);
        transition: color 0.3s var(--ease-out),
          background 0.3s var(--ease-out);

        /* Animated underline */
        &::after {
          content: "";
          position: absolute;
          left: 14%;
          right: 14%;
          bottom: 0.35rem;
          height: 2px;
          background: var(--gradient-accent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.35s var(--ease-out);
          border-radius: 2px;
        }

        &:hover,
        &:focus-visible {
          color: var(--clr-grey-1);
          background: rgba(204, 152, 110, 0.1);
        }

        &:hover::after,
        &:focus-visible::after {
          transform: scaleX(0.7);
        }

        &.active {
          color: var(--clr-grey-1);
          font-weight: 600;

          &::after {
            transform: scaleX(1);
          }
        }
      }
    }
  }
`;

export default Navbar;
