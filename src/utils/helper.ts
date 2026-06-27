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

/**
 * Returns the grand total in cents (subtotal + shipping fee), with the
 * shipping fee waived when `isFreeShipping` is true. Use together with
 * `qualifiesForFreeShipping` so the two displays (`CartTotals`,
 * `OrderSummary`) never disagree about the same number.
 *
 *   computeGrandTotal(0, 500, false) === 500
 *   computeGrandTotal(5_000, 500, true) === 5_000
 */
export const computeGrandTotal = (
  totalAmountCents: number,
  shippingFeeCents: number,
  isFreeShipping: boolean
): number =>
  isFreeShipping ? totalAmountCents : totalAmountCents + shippingFeeCents;

/**
 * Pluralises a count + singular noun. Default plural is `<singular>s`, with
 * an explicit override for irregular plurals (e.g. `piece` → `pieces`).
 *
 *   pluralize(1, "item")             === "1 item"
 *   pluralize(5, "item")             === "5 items"
 *   pluralize(1, "piece", "pieces")  === "1 piece"
 *   pluralize(5, "piece", "pieces")  === "5 pieces"
 */
export const pluralize = (
  n: number,
  singular: string,
  plural: string = `${singular}s`
): string => `${n} ${n === 1 ? singular : plural}`;
