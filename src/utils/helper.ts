import { COMMERCE } from "../constants";

//? formatting price to euro currency  (number: number) => string  (number / 100) => string
export const formatPrice = (number: number): string => {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
};

/**
 * Returns true when the supplied cart subtotal (in cents) qualifies for free
 * shipping.
 *
 * The threshold itself lives in the centralised `COMMERCE` namespace
 * (`COMMERCE.FREE_SHIPPING_THRESHOLD_CENTS`); this helper just wires that
 * constant into the boolean comparison so callers (`CartTotals`,
 * `OrderSummary`, …) read from the same source of truth rather than
 * duplicating the literal.
 */
export const qualifiesForFreeShipping = (
  totalAmountCents: number
): boolean => totalAmountCents >= COMMERCE.FREE_SHIPPING_THRESHOLD_CENTS;

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

/**
 * Sentinel value used in the Brand (`company`) filter dropdown to
 * represent products whose `brand` field was missing on the upstream
 * dummyjson API. The product-side mapper stamps those rows with an
 * empty `company` string (so the data layer stays truthful); the
 * filter sidebar surfaces them as a clearly-labelled `'No brand'`
 * option instead of the previous literal `'unknown'` that leaked
 * through the brandOptions pipeline.
 *
 * Pipeline contract (single source of truth across all consumers):
 *
 *   Filter.tsx          → injects this value into `brandOptions`
 *                         when at least one loaded product has an
 *                         empty `company`. The CompanyFilter JSX
 *                         rewrites the option's label to 'No brand'
 *                         on display, so users never see the raw
 *                         sentinel.
 *   useFilterProducts   → treats this value as a wildcard that
 *                         matches products where `company === ''`.
 *   ProductList / etc.  → never reads this value directly; they only
 *                         consume the filtered Products[].
 *
 * Keeping the sentinel in `helper.ts` means every consumer agrees on
 * the same boundary, so future contributors adding a new filter
 * consumer don't accidentally diverge.
 */
export const NO_BRAND_FILTER = "__no_brand__";
