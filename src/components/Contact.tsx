import React from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";
import { NETWORK } from "../constants";
import { gradientText } from "../styles/gradientText";

// Sub-component for the newsletter form
const NewsletterForm: React.FC = () => (
  <form
    action={NETWORK.NEWSLETTER}
    method="POST"
    className="contact-form"
  >
    <label className="visually-hidden" htmlFor="newsletter-email">
      Email address
    </label>
    <input
      id="newsletter-email"
      type="email"
      name="_replyto"
      className="form-input"
      placeholder="your@email.com"
      required
    />
    <button type="submit" className="submit-btn">
      Subscribe
      <FiSend />
    </button>
  </form>
);

// Main functional component for contact/newsletter section
const Contact: React.FC = () => {
  return (
    <Wrapper>
      <div className="section-center">
        <div className="card">
          <span className="eyebrow">Stay in the loop</span>
          <h3>
            Join our newsletter and <span className="highlight">get 20% off</span>
            <br />
            your first order
          </h3>
          <p>
            The latest drops, design inspiration, and member-only offers
            &mdash; delivered straight to your inbox.
          </p>
          <NewsletterForm />
          <small className="muted">
            No spam, unsubscribe anytime. We respect your inbox.
          </small>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  padding: 5rem 0 6rem;
  background: var(--clr-grey-10);

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

  .card {
    position: relative;
    overflow: hidden;
    background: var(--gradient-warm);
    border-radius: var(--radius-2xl);
    padding: 3rem 1.75rem;
    text-align: center;
    max-width: 56rem;
    margin: 0 auto;
    box-shadow: var(--shadow-md);

    /* Decorative blurred blobs */
    &::before,
    &::after {
      content: "";
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(40px);
    }

    &::before {
      top: -100px;
      left: -100px;
      width: 280px;
      height: 280px;
      background: var(--clr-primary-7);
      opacity: 0.35;
    }

    &::after {
      bottom: -80px;
      right: -80px;
      width: 220px;
      height: 220px;
      background: var(--clr-primary-6);
      opacity: 0.32;
    }

    > * {
      position: relative;
      z-index: 1;
    }

    .eyebrow {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(255, 255, 255, 0.7);
      color: var(--clr-primary-2);
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      border-radius: var(--radius-full);
      margin-bottom: 1.25rem;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }

    h3 {
      font-size: clamp(1.75rem, 2.4vw + 0.5rem, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.15;
      text-transform: none;
      margin: 0 auto 1rem;
      max-width: 28rem;
      color: var(--clr-grey-1);

      .highlight {
        ${gradientText}
      }
    }

    p {
      color: var(--clr-primary-3);
      font-size: 1rem;
      max-width: 32rem;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
  }

  .contact-form {
    display: flex;
    gap: 0.65rem;
    max-width: 460px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-input {
    flex: 1 1 220px;
    padding: 1rem 1.25rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    font-size: 0.95rem;
    color: var(--clr-grey-1);
    transition:
      border-color 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out);
    outline: none;

    &::placeholder {
      color: var(--clr-grey-6);
    }

    &:focus {
      border-color: var(--clr-primary-5);
      box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.18);
    }
  }

  .submit-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.6rem;
    border-radius: var(--radius-full);
    background: var(--clr-grey-1);
    color: var(--clr-white);
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: none;
    border: none;
    cursor: pointer;
    transition:
      transform 0.3s var(--ease-out),
      background 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out);
    box-shadow: var(--shadow-sm);

    svg {
      transition: transform 0.3s var(--ease-out);
    }

    &:hover,
    &:focus-visible {
      background: var(--clr-primary-2);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      outline: none;

      svg {
        transform: translateX(3px);
      }
    }
  }

  .muted {
    display: block;
    margin-top: 1rem;
    color: var(--clr-primary-3);
    font-size: 0.78rem;
    opacity: 0.85;
  }

  @media (min-width: 992px) {
    padding: 7rem 0 9rem;

    .card {
      padding: 4.5rem 3rem;
    }

    .contact-form {
      flex-wrap: nowrap;
    }
  }
`;

export default Contact;
