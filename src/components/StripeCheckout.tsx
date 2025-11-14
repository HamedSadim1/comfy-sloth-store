import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  loadStripe,
  StripeCardElementChangeEvent,
  StripeCardElement,
} from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  Elements,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useCartContext } from "../Context/CartContext";
import { useUserContext } from "../Context/UserContext";
import { formatPrice } from "../utils/helper";
import { useNavigate } from "react-router-dom";

// Custom interface for CardElement options to avoid using 'any'
interface CardStyleOptions {
  style: {
    base: Record<string, string | Record<string, string>>;
    invalid: Record<string, string>;
  };
}

// Load Stripe promise outside component to avoid re-initialization
const promise = loadStripe(import.meta.env.VITE_REACT_APP_STRIP_PUBLIC_KEY);

// Interface for PaymentStatus component props
interface PaymentStatusProps {
  succeeded: boolean;
  myUser: any; // TODO: Define proper User type from context
  totalAmount: number;
}

// Interface for PaymentForm component props
interface PaymentFormProps {
  cardStyle: CardStyleOptions;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleChange: (event: StripeCardElementChangeEvent) => void;
  processing: boolean;
  disabled: boolean;
  succeeded: boolean;
  error: string;
}

// Interface for CardError component props
interface CardErrorProps {
  error: string;
}

// Interface for ResultMessage component props
interface ResultMessageProps {
  succeeded: boolean;
}

// Sub-component for displaying payment status or info
const PaymentStatus: React.FC<PaymentStatusProps> = ({
  succeeded,
  myUser,
  totalAmount,
}) => {
  if (succeeded) {
    return (
      <article>
        <h4>Thank you</h4>
        <h4>Your payment was successful</h4>
        <h4>Redirecting to home page shortly</h4>
      </article>
    );
  }
  return (
    <article>
      <h4>Hello, {myUser && myUser.name}</h4>
      <p>Your total is {formatPrice(totalAmount)}</p>
      <p>Test Card Number: 4242 4242 4242 4242</p>
    </article>
  );
};

// Sub-component for the payment form
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
      <CardElement
        id="card-element"
        options={cardStyle}
        onChange={handleChange}
      />
      <button
        className="btn btn-primary btn-block"
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
        </span>
      </button>
      <CardError error={error} />
      <ResultMessage succeeded={succeeded} />
    </form>
  );
};

// Sub-component for displaying card errors
const CardError: React.FC<CardErrorProps> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="card-error" role="alert">
      {error}
    </div>
  );
};

// Sub-component for displaying result message
const ResultMessage: React.FC<ResultMessageProps> = ({ succeeded }) => {
  return (
    <p className={succeeded ? "result-message" : "result-message hidden"}>
      Payment succeeded, see the result in your{" "}
      <a href={`https://dashboard.stripe.com/test/payments`}>
        Stripe dashboard.
      </a>{" "}
      Refresh the page to pay again.
    </p>
  );
};

// Main CheckoutForm component
const CheckoutForm: React.FC = () => {
  const { cart, totalAmount, shippingFee, clearCart } = useCartContext();
  const { myUser } = useUserContext();
  const navigate = useNavigate();

  // State for Stripe payment process
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string>("");

  const stripe = useStripe();
  const elements = useElements();

  // Function to create payment intent, memoized for performance
  const createPaymentIntent = useCallback(async () => {
    try {
      const response = await axios.post(
        "/.netlify/functions/create-payment-intent",
        {
          cart,
          shippingFee,
          totalAmount,
        }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      // Error handling without console.error for production
      setError("Failed to create payment intent. Please try again.");
    }
  }, [cart, shippingFee, totalAmount]);

  // Effect to create payment intent on mount
  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  // Card style options for Stripe CardElement
  const cardStyle: CardStyleOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  // Handle form submission, memoized for performance
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setProcessing(true);
      const payload = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement) as StripeCardElement,
        },
      });
      if (payload?.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError("");
        setProcessing(false);
        setSucceeded(true);
        setTimeout(() => {
          clearCart();
          navigate("/");
        }, 10000);
      }
    },
    [stripe, clientSecret, elements, clearCart, navigate]
  );

  // Handle card element change, memoized for performance
  const handleChange = useCallback((event: StripeCardElementChangeEvent) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  }, []);

  return (
    <div>
      <PaymentStatus
        succeeded={succeeded}
        myUser={myUser}
        totalAmount={totalAmount}
      />
      <PaymentForm
        cardStyle={cardStyle}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        processing={processing}
        disabled={disabled}
        succeeded={succeeded}
        error={error}
      />
    </div>
  );
};

// Main StripeCheckout component
const StripeCheckout: React.FC = () => {
  return (
    <Wrapper>
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  form {
    width: 30vw;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
  }
  input {
    border-radius: 6px;
    margin-bottom: 6px;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    font-size: 16px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  .result-message {
    line-height: 22px;
    font-size: 16px;
  }
  .result-message a {
    color: rgb(89, 111, 214);
    font-weight: 600;
    text-decoration: none;
  }
  .hidden {
    display: none;
  }
  #card-error {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    margin-top: 12px;
    text-align: center;
  }
  #card-element {
    border-radius: 4px 4px 0 0;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  #payment-request-button {
    margin-bottom: 32px;
  }
  /* Buttons and links */
  button {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 0 0 4px 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  /* spinner/processing state, errors */
  .spinner,
  .spinner:before,
  .spinner:after {
    border-radius: 50%;
  }
  .spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .spinner:before,
  .spinner:after {
    position: absolute;
    content: "";
  }
  .spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #5469d4;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
  }
  .spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #5469d4;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
  }
  @keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @media only screen and (max-width: 600px) {
    form {
      width: 80vw;
    }
  }
`;

export default StripeCheckout;
