import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMail,
} from "react-icons/fi";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
  FaCcStripe,
} from "react-icons/fa";
import { APP, NETWORK } from "../constants";

// Reusable column heading
const ColumnTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="col-title">{children}</h4>
);

// Brand block: gradient text wordmark (avoids relying on the SVG's fill),
// blurb, social pills.
const Brand: React.FC = () => (
  <div className="brand">
    <Link to="/" className="logo-link" aria-label={`${APP.NAME} home`}>
      <span className="wordmark">{APP.NAME.toLowerCase()}</span>
    </Link>
    <p>
      Handcrafted furniture for considered homes. Built slowly, sourced
      responsibly, designed to last a lifetime.
    </p>
    <ul className="socials" aria-label="Social channels">
      <li>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FiTwitter />
        </a>
      </li>
      <li>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FiInstagram />
        </a>
      </li>
      <li>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FiFacebook />
        </a>
      </li>
      <li>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
        >
          <FiYoutube />
        </a>
      </li>
    </ul>
  </div>
);

// Explore: routes that always exist
const ExploreColumn: React.FC = () => (
  <div className="col">
    <ColumnTitle>Explore</ColumnTitle>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/products">All products</Link>
      </li>
      <li>
        <Link to="/about">About us</Link>
      </li>
    </ul>
  </div>
);

// Customer: account / shopping routes (only routes that actually exist)
const CustomerColumn: React.FC = () => (
  <div className="col">
    <ColumnTitle>Account</ColumnTitle>
    <ul>
      <li>
        <Link to="/cart">Your cart</Link>
      </li>
      <li>
        <Link to="/checkout">Checkout</Link>
      </li>
      <li>
        <a href="mailto:hello@comfysloth.com">Contact us</a>
      </li>
    </ul>
  </div>
);

// Mini newsletter signup, mirrors the form used in Home page
const NewsletterColumn: React.FC = () => (
  <div className="newsletter">
    <ColumnTitle>Stay in touch</ColumnTitle>
    <p>New drops and design inspiration, once a month. No spam.</p>
    <form
      action={NETWORK.NEWSLETTER}
      method="POST"
      className="form"
    >
      <label className="visually-hidden" htmlFor="footer-email">
        Email address
      </label>
      <div className="form-row">
        <input
          id="footer-email"
          type="email"
          name="_replyto"
          placeholder="your@email.com"
          className="form-input"
          required
        />
        <button
          type="submit"
          className="submit-btn"
          aria-label="Subscribe to newsletter"
        >
          <FiMail />
        </button>
      </div>
    </form>
  </div>
);

// Legal row: copyright + accepted payment methods.
// Note: privacy/terms/cookies pages are not routed yet, so we keep this row
// as a single copyright line rather than dead links.
const Legal: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <div className="legal">
      <p className="copy">
        &copy; {year} <span>{APP.NAME}</span> &middot; All rights reserved
      </p>
      <ul className="payments" aria-label="Accepted payment methods">
        <li>
          <FaCcVisa />
        </li>
        <li>
          <FaCcMastercard />
        </li>
        <li>
          <FaCcPaypal />
        </li>
        <li>
          <FaCcApplePay />
        </li>
        <li>
          <FaCcStripe />
        </li>
      </ul>
    </div>
  );
};

// Main footer component
const Footer: React.FC = () => (
  <Wrapper>
    <div className="section-center top">
      <Brand />
      <ExploreColumn />
      <CustomerColumn />
      <NewsletterColumn />
    </div>
    <div className="section-center bottom">
      <Legal />
    </div>
  </Wrapper>
);

const Wrapper = styled.footer`
  background: linear-gradient(
    180deg,
    var(--clr-primary-1) 0%,
    #141414 100%
  );
  color: rgba(255, 255, 255, 0.78);
  padding: 4rem 0 0;

  .section-center {
    position: relative;
  }

  .top {
    display: grid;
    gap: 2.5rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .bottom {
    padding: 1.5rem 0;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Brand block */
  .brand {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .logo-link {
      display: inline-flex;
      width: fit-content;
    }

    .wordmark {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1;
      background: linear-gradient(
        135deg,
        var(--clr-primary-7) 0%,
        var(--clr-white) 80%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      transition: filter 0.3s var(--ease-out);
    }

    .logo-link:hover .wordmark,
    .logo-link:focus-visible .wordmark {
      filter: brightness(1.15);
    }

    p {
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.95rem;
      line-height: 1.6;
      max-width: 28rem;
      margin-bottom: 0;
    }

    .socials {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.25rem;

      a {
        width: 2.4rem;
        height: 2.4rem;
        display: grid;
        place-items: center;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: var(--radius-full);
        transition:
          background 0.3s var(--ease-out),
          color 0.3s var(--ease-out),
          border-color 0.3s var(--ease-out),
          transform 0.3s var(--ease-out);

        svg {
          width: 1.05rem;
          height: 1.05rem;
        }

        &:hover,
        &:focus-visible {
          background: var(--gradient-accent);
          color: var(--clr-white);
          border-color: transparent;
          transform: translateY(-2px);
          outline: none;
        }
      }
    }
  }

  /* Navigation columns */
  .col {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;

    ul {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    a {
      display: inline-block;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.92rem;
      transition:
        color 0.3s var(--ease-out),
        transform 0.3s var(--ease-out);

      &:hover,
      &:focus-visible {
        color: var(--clr-primary-7);
        transform: translateX(3px);
        outline: none;
      }
    }
  }

  .col-title {
    color: var(--clr-white);
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-bottom: 0.4rem;
  }

  /* Newsletter */
  .newsletter {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    p {
      font-size: 0.92rem;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.5;
      margin-bottom: 0.25rem;
    }

    .form {
      margin-top: 0.25rem;
    }

    .form-row {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
      transition:
        border-color 0.3s var(--ease-out),
        background 0.3s var(--ease-out),
        box-shadow 0.3s var(--ease-out);

      &:focus-within {
        border-color: var(--clr-primary-5);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.15);
      }
    }

    .form-input {
      flex: 1 1 auto;
      background: transparent;
      border: none;
      outline: none;
      color: var(--clr-white);
      padding: 0.7rem 1rem;
      font-size: 0.92rem;

      &::placeholder {
        color: rgba(255, 255, 255, 0.45);
      }
    }

    .submit-btn {
      background: var(--gradient-accent);
      color: var(--clr-white);
      border: none;
      padding: 0 1.05rem;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: filter 0.3s var(--ease-out);

      svg {
        width: 1.05rem;
        height: 1.05rem;
        transition: transform 0.3s var(--ease-out);
      }

      &:hover {
        filter: brightness(1.08);

        svg {
          transform: translateX(2px);
        }
      }

      &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--clr-white);
      }
    }
  }

  /* Legal row */
  .legal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;

    .copy {
      font-size: 0.85rem;
      /* rgb(255,255,255,0.78) on #141414 ≈ 7.5:1 contrast — clears WCAG AA */
      color: rgba(255, 255, 255, 0.78);
      margin-bottom: 0;
      letter-spacing: 0;

      span {
        color: var(--clr-primary-7);
        font-weight: 600;
      }
    }

    .payments {
      display: flex;
      gap: 0.65rem;
      align-items: center;
      color: rgba(255, 255, 255, 0.78);

      svg {
        width: 1.7rem;
        height: 1.7rem;
        opacity: 0.85;
        transition: opacity 0.3s var(--ease-out);
      }

      li:hover svg {
        opacity: 1;
      }
    }
  }

  @media (min-width: 768px) {
    .top {
      grid-template-columns: 1.5fr 1fr 1fr 1.4fr;
      gap: 3rem;
    }

    .legal {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }
`;

export default Footer;
