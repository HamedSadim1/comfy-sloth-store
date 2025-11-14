//? formatting price to euro currency  (number: number) => string  (number / 100) => string
export const formatPrice = (number: number): string => {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(number / 100);
};
