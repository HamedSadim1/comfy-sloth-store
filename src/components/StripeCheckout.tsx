import React, { useCallback } from "react";
import styled from "styled-components";
import type {
  StripeCardElementChangeEvent,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { InlineSpinner } from "./Loading";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import { formatPrice } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser } from "react-icons/fi";
import { FaCheckCircle, FaCcVisa, FaCcMastercard, FaCcStripe } from "react-icons/fa";
import type { User } from "@auth0/auth0-react";
import Eyebrow from "./Eyebrow";
import Button from "./Button";
import { ENV } from "../constants";
import { useStripePayment } from "../hooks/useStripePayment";

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

/**
 * CardElement style options. Typed without `any` so the cast at the
 * configuration site stays strict.
 */
interface CardStyleOptions {
  style: {
    base: Record<string, string | Record<string, string>>;
    invalid: Record<string, string>;
  };
}

interface PaymentStatusProps {
  succeeded: boolean;
  myUser: User | null;
  totalAmount: number;
  shippingFee: number;
}

interface PaymentFormProps {
  cardStyle: CardStyleOptions;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleChange: (event: StripeCardElementChangeEvent) => void;
  processing: boolean;
  disabled: boolean;
  succeeded: boolean;
  error: string;
}

interface CardErrorProps {
  error: string;
}

interface ResultMessageProps {
  succeeded: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// Module-level Stripe loader
// ─────────────────────────────────────────────────────────────────────

/**
 * Stripe promise. Held at module scope so the Stripe SDK is
 * initialised ONCE per page-load rather than once per `<CheckoutForm>`
 * render, which would otherwise re-create the iframe on every state
 * update.
 */
const stripePromise = loadStripe(
  import.meta.env[ENV.STRIPE_PUBLIC_KEY] as string
);

// ─────────────────────────────────────────────────────────────────────
// Sub-components (kept inline — tightly coupled to this form's state
// surface; promoting them to separate files would force prop-drilling
// the same shape back into CheckoutForm, defeating the hook extraction).
// ─────────────────────────────────────────────────────────────────────

/**
 * Payment-method trusted-icon row + secure-lockup note. Purely visual;
 * no props.
 */
const PaymentTrust: React.FC = () => (
  <div className="trust-row">
    <ul className="methods" aria-label="Accepted card networks">
      <li>
        <FaCcVisa aria-hidden="true" />
      </li>
      <li>
        <FaCcMastercard aria-hidden="true" />
      </li>
      <li>
        <FaCcStripe aria-hidden="true" />
      </li>
    </ul>
    <p className="trust-note">
      <FiLock aria-hidden="true" />
      Encrypted by Stripe · 256-bit TLS
    </p>
  </div>
);

/**
 * Conditional status card. Renders the success article (with the
 * "Thank you — your order is on the way" copy) when `succeeded` is true,
 * otherwise the running-subtotal / greeting card.
 */
const PaymentStatus: React.FC<PaymentStatusProps> = ({
  succeeded,
  myUser,
  totalAmount,
  shippingFee,
}) => {
  if (succeeded) {
    return (
      <article className="success-card" role="status" aria-live="polite">
        <div className="success-icon" aria-hidden="true">
          <FaCheckCircle />
        </div>
        <Eyebrow className="success-eyebrow">Payment complete</Eyebrow>
        <h3>Thank you&mdash;your order is on the way.</h3>
        <p>
          We sent a confirmation to{" "}
          <strong>{myUser?.email ?? "your email"}</strong>. You&rsquo;ll be
          redirected to the home page in a few seconds.
        </p>
      </article>
    );
  }
  return (
    <article className="status-card">
      <div className="user">
        <span className="user-icon" aria-hidden="true">
          <FiUser />
        </span>
        <div>
          <span className="greeting-label">Checking out as</span>
          <strong className="greeting-name">
            {myUser?.name ?? myUser?.email ?? "Guest"}
          </strong>
        </div>
      </div>
      <div className="totals-line">
        <span>Order total</span>
        <strong>{formatPrice(totalAmount + shippingFee)}</strong>
      </div>
      <p className="hint">
        Test card:&nbsp;
        <code>4242&nbsp;4242&nbsp;4242&nbsp;4242</code> &middot; any future
        date &middot; any CVC.
      </p>
    </article>
  );
};

/**
 * The actual card form (CardElement + Pay button). Pure presentation;
 * receives the form-level state machine via props from `CheckoutForm`.
 */
const PaymentForm: React.FC<PaymentFormProps> = ({
  cardStyle,
  handleSubmit,
  handleChange,
  processing,
  disabled,
  succeeded,
  error,
}) => {
  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="card-element-input">
        Card number
      </label>
      <div className="card-element-wrap">
        <CardElement
          id="card-element-input"
          options={cardStyle}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={processing || disabled || succeeded}
        id="submit"
        iconRight={
          processing ? (
            <InlineSpinner size="sm" />
          ) : succeeded ? (
            <FaCheckCircle aria-hidden="true" />
          ) : (
            <FiLock aria-hidden="true" />
          )
        }
      >
        <span id="button-text">
          {processing
            ? ""
            : succeeded
            ? "Payment received"
            : "Pay securely"}
        </span>
      </Button>

      <CardError error={error} />
      <ResultMessage succeeded={succeeded} />
    </form>
  );
};

/** Inline error pill. Returns null when no error to display. */
const CardError: React.FC<CardErrorProps> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="card-error" role="alert">
      {error}
    </div>
  );
};

/** Post-payment link to the Stripe test dashboard. */
const ResultMessage: React.FC<ResultMessageProps> = ({ succeeded }) => {
  return (
    <p className={succeeded ? "result-message" : "result-message hidden"}>
      View this payment in your{" "}
      <a
        href={`https://dashboard.stripe.com/test/payments`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Stripe dashboard
      </a>
      .
    </p>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Main CheckoutForm (thin orchestrator — all state lives in the hook)
// ─────────────────────────────────────────────────────────────────────

/**
 * Orchestrator: reads cart + user context, delegates the payment
 * state machine to `useStripePayment`, and composes the visual
 * sub-components (`PaymentStatus`, `PaymentForm`, etc.) with the
 * hook's return value.
 *
 * The `onSucceeded` callback passed to the hook owns the post-payment
 * UX (clearCart + 10-second redirect timer), keeping commerce / route
 * concerns out of the payment state machine itself.
 */
const CheckoutForm: React.FC = () => {
  const { totalAmount, shippingFee, clearCart } = useCartContext();
  const { myUser } = useUserContext();
  const navigate = useNavigate();

  // Post-success side effect: clear the local cart and bounce the user
  // back to the home page after a brief "thank you" pause. Behaviour-
  // preserving: the previous inline `setTimeout(..., 10000)` lives
  // here verbatim, just injected through the hook's `onSucceeded`
  // callback instead of being nested inside `handleSubmit`.
  const handleSucceeded = useCallback(() => {
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 10000);
  }, [clearCart, navigate]);

  const {
    succeeded,
    processing,
    error,
    disabled,
    handleSubmit,
    handleChange,
  } = useStripePayment({
    totalAmount,
    shippingFee,
    onSucceeded: handleSucceeded,
  });

  // CardElement style opts. Re-allocated per render is fine — Stripe
  // memoises internally and the surface area is small.
  const cardStyle: CardStyleOptions = {
    style: {
      base: {
        color: "#2b2b2b",
        fontFamily: "inherit",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        lineHeight: "1.5",
        "::placeholder": {
          color: "#9c9c9c",
        },
        iconColor: "#2b2b2b",
      },
      invalid: {
        color: "var(--clr-red-dark)",
        iconColor: "var(--clr-red-dark)",
      },
    },
  };

  return (
    <Wrapper>
      <Card>
        <header className="head">
          <Eyebrow>Payment</Eyebrow>
          <h2 className="title">Card details</h2>
          <p className="lede">
            Enter your card details below. Your information is encrypted in
            transit and never stored on our servers.
          </p>
          <PaymentTrust />
        </header>

        <PaymentStatus
          succeeded={succeeded}
          myUser={myUser}
          totalAmount={totalAmount}
          shippingFee={shippingFee}
        />

        {!succeeded && (
          <PaymentForm
            cardStyle={cardStyle}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            processing={processing}
            disabled={disabled}
            succeeded={succeeded}
            error={error}
          />
        )}
      </Card>
    </Wrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Top-level component (wraps CheckoutForm in <Elements>)
// ─────────────────────────────────────────────────────────────────────

const StripeCheckout: React.FC = () => {
  return (
    <Wrapper>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Wrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────
// Styled-components (kept module-local because they're tightly coupled
// to this file's specific layout; promoting them to a shared styles
// module would harm cohesion without any re-use benefit.)
// ─────────────────────────────────────────────────────────────────────

const Wrapper = styled.section`
  width: 100%;
`;

const Card = styled.section`
  background: var(--clr-white);
  border: 1px solid rgba(34, 34, 34, 0.06);
  border-radius: var(--radius-xl);
  padding: 1.85rem 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    text-transform: none;
    margin: 0.25rem 0 0.25rem;
  }

  .lede {
    color: var(--clr-grey-5);
    font-size: 0.95rem;
    line-height: 1.55;
    margin: 0 0 0.75rem;
    max-width: 38rem;
  }

  .trust-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(34, 34, 34, 0.06);
  }

  .methods {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      width: 2.4rem;
      height: 1.55rem;
      display: grid;
      place-items: center;
      background: var(--clr-grey-10);
      border: 1px solid rgba(34, 34, 34, 0.06);
      border-radius: var(--radius-sm);
      color: var(--clr-grey-2);
      transition:
        border-color 0.3s var(--ease-out),
        background 0.3s var(--ease-out);

      svg {
        width: 1.4rem;
        height: 1rem;
      }
    }

    li:hover {
      background: var(--clr-white);
      border-color: var(--clr-grey-7);
      color: var(--clr-grey-1);
    }
  }

  .trust-note {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--clr-grey-5);
    font-size: 0.78rem;
    margin: 0;

    svg {
      width: 0.85rem;
      height: 0.85rem;
      color: var(--clr-primary-2);
    }
  }

  .status-card {
    background: var(--clr-primary-10);
    border: 1px solid rgba(204, 152, 110, 0.18);
    border-radius: var(--radius-lg);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-icon {
      width: 2.4rem;
      height: 2.4rem;
      display: grid;
      place-items: center;
      background: var(--clr-white);
      color: var(--clr-primary-2);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xs);

      svg {
        width: 1.05rem;
        height: 1.05rem;
      }
    }

    .greeting-label {
      display: block;
      font-size: 0.7rem;
      color: var(--clr-grey-5);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
    }

    .greeting-name {
      color: var(--clr-grey-1);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0;
    }

    .totals-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(204, 152, 110, 0.22);

      span {
        font-size: 0.85rem;
        color: var(--clr-grey-3);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-weight: 700;
      }

      strong {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: var(--clr-grey-1);
      }
    }

    .hint {
      font-size: 0.72rem;
      color: var(--clr-grey-6);
      margin: 0;
      letter-spacing: 0;

      code {
        background: rgba(34, 34, 34, 0.06);
        border-radius: var(--radius-sm);
        padding: 0.1rem 0.35rem;
        font-family: var(--ff-mono, ui-monospace, SFMono-Regular, monospace);
        color: var(--clr-grey-2);
        font-weight: 600;
        letter-spacing: 0.04em;
      }
    }
  }

  .success-card {
    background: rgba(86, 158, 100, 0.1);
    border: 1px solid rgba(86, 158, 100, 0.3);
    border-radius: var(--radius-lg);
    padding: 2rem 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    .success-icon {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      background: hsl(125, 50%, 92%);
      color: hsl(125, 50%, 32%);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-sm);
      margin-bottom: 0.5rem;

      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }

    .success-eyebrow {
      background: rgba(255, 255, 255, 0.85);
    }

    h3 {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--clr-grey-1);
      text-transform: none;
      line-height: 1.2;
      margin: 0.5rem 0 0.75rem;
      max-width: 30rem;
    }

    p {
      color: hsl(125, 38%, 22%);
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
      max-width: 32rem;

      strong {
        color: var(--clr-grey-1);
        font-weight: 700;
      }
    }
  }

  .field-label {
    display: block;
    font-size: 0.78rem;
    color: var(--clr-grey-3);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 0.55rem;
  }

  .card-element-wrap {
    background: var(--clr-white);
    border: 1px solid rgba(34, 34, 34, 0.12);
    border-radius: var(--radius-md);
    padding: 0.95rem 1rem;
    box-shadow: var(--shadow-xs);
    transition:
      border-color 0.3s var(--ease-out),
      box-shadow 0.3s var(--ease-out);
  }

  .card-element-wrap:focus-within {
    border-color: var(--clr-primary-5);
    box-shadow: 0 0 0 4px rgba(204, 152, 110, 0.15);
  }

  #card-element-input,
  #card-element-input iframe {
    width: 100% !important;
  }

  .card-error {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(204, 80, 80, 0.1);
    border: 1px solid rgba(204, 80, 80, 0.28);
    border-radius: var(--radius-md);
    color: var(--clr-red-dark);
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .result-message {
    margin-top: 0.85rem;
    font-size: 0.78rem;
    color: var(--clr-grey-5);
    text-align: center;
    line-height: 1.55;

    a {
      color: var(--clr-primary-2);
      font-weight: 600;
      transition: color 0.3s var(--ease-out);

      &:hover,
      &:focus-visible {
        color: var(--clr-primary-1);
        text-decoration: underline;
      }
    }
  }

  .result-message.hidden {
    display: none;
  }

  @media (min-width: 992px) {
    padding: 2.25rem 2rem;
  }
`;

export default StripeCheckout;
