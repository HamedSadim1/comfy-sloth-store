import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type {
  StripeCardElement,
  StripeCardElementChangeEvent,
} from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// ─────────────────────────────────────────────────────────────────────
// Public arg + return shapes
// ─────────────────────────────────────────────────────────────────────

export interface UseStripePaymentArgs {
  /**
   * Cart subtotal in cents. Sent to the server-side Stripe handler as
   * one half of the total charge; the handler also receives shippingFee.
   */
  totalAmount: number;
  /**
   * Flat shipping fee in cents. Added to `totalAmount` server-side to
   * produce the final PaymentIntent amount.
   */
  shippingFee: number;
  /**
   * Optional post-success side-effect callback. Invoked synchronously
   * when Stripe confirms the payment succeeded, BEFORE the hook
   * returns control to the caller. Most clients use this to fire a
   * `setTimeout` for the "redirect-to-home" UX; the timer itself lives
   * at the call site, not in the hook, so the hook stays post-success
   * logic-agnostic.
   */
  onSucceeded?: () => void;
}

export interface UseStripePaymentResult {
  /** True once Stripe's `paymentIntent.succeeded` arrives. */
  succeeded: boolean;
  /** True while `stripe.confirmCardPayment` is in flight. */
  processing: boolean;
  /** Last user-visible error message (renders inside `.card-error`). */
  error: string;
  /** True when the CardElement is empty (disables the Pay button). */
  disabled: boolean;
  /**
   * The Stripe PaymentIntent client-secret. Exposed mainly so the
   * payment form can locate a `data-secret` attribute for debugging;
   * production render JSX does not display it.
   */
  clientSecret: string;
  /** Form submit handler — wires to `<form onSubmit={...} />`. */
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  /** CardElement change handler — wires to `<CardElement onChange={...} />`. */
  handleChange: (event: StripeCardElementChangeEvent) => void;
}

// ─────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────

/**
 * Custom hook that owns the Stripe-elements payment state machine
 * previously inlined inside `<CheckoutForm>` (formerly
 * `src/components/StripeCheckout.tsx`).
 *
 * Encapsulates:
 *  - 5 `useState` vars: `succeeded`, `error`, `processing`, `disabled`,
 *    `clientSecret`.
 *  - `createPaymentIntent` async + the `useEffect` that fires it once
 *    on mount and again whenever `totalAmount` / `shippingFee` change.
 *  - `handleSubmit`: drives `stripe.confirmCardPayment(...)` and fans
 *    the outcome back into the state vars; fires `onSucceeded?.()` on
 *    success so the caller can layer in post-success logic
 *    (clearCart + redirect, etc.) without coupling the hook to the
 *    cart context.
 *  - `handleChange`: syncs the CardElement's `empty` + `error` flags
 *    into `disabled` / `error` state so the Pay button stays in sync
 *    with input validity.
 *
 * MUST be called inside an `<Elements>` block — the hook reads
 * `useStripe()` + `useElements()` from the Stripe React context.
 *
 * Behavior-preserving extraction: the `setTimeout(..., 10000)` for
 * the post-success redirect is *not* moved into the hook. Callers
 * place it inside `onSucceeded` themselves, which is why the typing
 * for `onSucceeded` lists it as optional with a clear use description.
 */
export const useStripePayment = ({
  totalAmount,
  shippingFee,
  onSucceeded,
}: UseStripePaymentArgs): UseStripePaymentResult => {
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string>("");

  // Server creates the PaymentIntent; we just stash the client-secret
  // for the subsequent `confirmCardPayment` call.
  const createPaymentIntent = useCallback(async () => {
    try {
      const response = await axios.post(
        "/.netlify/functions/create-payment-intent",
        { shippingFee, totalAmount }
      );
      setClientSecret(response.data.clientSecret);
    } catch {
      setError("Failed to create payment intent. Please try again.");
    }
  }, [shippingFee, totalAmount]);

  // Fire on mount and on amount changes. Re-running on
  // totalAmount/shippingFee changes is intentionally safe: the upstream
  // server just creates a new PaymentIntent with the new amount.
  useEffect(() => {
    createPaymentIntent();
  }, [createPaymentIntent]);

  // Form submit — drives the actual payment confirmation through
  // Stripe and fans the result back into the state vars.
  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
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
        onSucceeded?.();
      }
    },
    [stripe, clientSecret, elements, onSucceeded]
  );

  // CardElement change — keeps the Pay button disabled until a card is
  // entered and surfaces any Stripe-side validation message.
  const handleChange = useCallback((event: StripeCardElementChangeEvent) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  }, []);

  return {
    succeeded,
    processing,
    error,
    disabled,
    clientSecret,
    handleSubmit,
    handleChange,
  };
};

export default useStripePayment;
