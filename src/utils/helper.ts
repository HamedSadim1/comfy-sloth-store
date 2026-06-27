//? formatting price to euro currency  (number: number) => string  (number / 100) => string
export const formatPrice = (number: number): string => {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
};

/**
 * Free-shipping threshold in cents. Carts above this value get free shipping
 * — used consistently by `CartTotals` and the checkout `OrderSummary` so the
 * two displays never disagree.
 * Mirrors the trust-row copy from the single-product page ("Over €50").
 */
export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

/**
 * Returns true when the supplied cart subtotal (in cents) qualifies for free
 * shipping.
 */
export const qualifiesForFreeShipping = (
  totalAmountCents: number
): boolean => totalAmountCents >= FREE_SHIPPING_THRESHOLD_CENTS;
