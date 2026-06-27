import { Products, SingleProduct, Image, Color } from "../types";

/**
 * Subset of the dummyjson.com `/products` response shape that the app
 * relies on. We keep this local to the mapper rather than promoting it
 * to the global types module because it is an implementation detail of
 * the API integration.
 */
export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{ rating: number; comment?: string; reviewerName?: string }>;
  thumbnail?: string;
  images?: string[];
}

export interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Cents multiplier — dummyjson returns the price in dollars (e.g. 9.99)
// while the codebase's `formatPrice` helper divides the stored price by
// 100 to render it as euros.
const CENTS_MULTIPLIER = 100;

// Palette used for the color filter fallback. Products without a real
// color option still get one swatch so the picker stays useful.
const FALLBACK_PALETTE = ["#ff0000", "#ffb900", "#000", "#0000ff", "#00ff00"];

function deriveColors(d: DummyProduct): Color[] {
  const safeId = typeof d.id === "number" ? d.id : 0;
  const idx = safeId % FALLBACK_PALETTE.length;
  // Cast is safe — every entry is a valid Color enum literal (hex string).
  return [FALLBACK_PALETTE[idx] as Color];
}

function deriveShipping(d: DummyProduct): boolean {
  // Treat the product as shipping-eligible as long as it's not flagged as
  // out of stock. Free-shipping logic in the codebase uses boolean `shipping`.
  if (typeof d.availabilityStatus === "string") {
    if (d.availabilityStatus.toLowerCase() === "out of stock") return false;
  }
  return typeof d.stock === "number" && d.stock > 0;
}

function deriveFeatured(d: DummyProduct): boolean {
  // Anything with a strong rating is considered featured. Lowered the bar
  // to 4.0 to make sure the Home page always has 3 featured products.
  return typeof d.rating === "number" && d.rating >= 4.0;
}

function deriveFirstImage(d: DummyProduct): string {
  return d.thumbnail ?? d.images?.[0] ?? "";
}

function buildImageArray(
  images: string[],
  productId: number | string
): Image[] {
  const safeImages = images ?? [];
  return safeImages.map((url, index) => {
    const filename = (() => {
      try {
        const last = url.split("/").pop();
        return last && last.length > 0 ? last : `image-${index}.jpg`;
      } catch {
        return `image-${index}.jpg`;
      }
    })();

    const thumb = (w: number, h: number) => ({ url, width: w, height: h });

    return {
      id: `${productId}-${index}`,
      url,
      width: 800,
      height: 800,
      filename,
      size: 0,
      type: "image/jpeg",
      thumbnails: {
        small: thumb(80, 80),
        large: thumb(320, 320),
        full: thumb(800, 800),
      },
    };
  });
}

/**
 * Map a dummyjson `/products` list item into the app's `Products` shape.
 * Consumers (filter, list, card grid) keep working unchanged.
 */
export function mapDummyProductToProduct(d: DummyProduct): Products {
  return {
    id: String(d.id),
    name: d.title,
    price: Math.round((d.price ?? 0) * CENTS_MULTIPLIER),
    image: deriveFirstImage(d),
    colors: deriveColors(d),
    // Brand fallback: empty string (matches `mapDummyProductToSingleProduct`
    // and lets Filter.tsx's brandOptions pipeline skip unknown-brand
    // rows via its `.filter((brand) => brand.length > 0)` step). The
    // previous `?? "unknown"` literal leaked through that filter and
    // surfaced as a literal "unknown" option in the brand dropdown.
    company: (d.brand ?? "").toLowerCase(),
    description: d.description ?? "",
    category: d.category ?? "uncategorised",
    shipping: deriveShipping(d),
    featured: deriveFeatured(d),
  };
}

/**
 * Map a dummyjson `/products/{id}` response into the app's
 * `SingleProduct` shape. The gallery expects an `Image[]` rather than a
 * raw string[], so the images are normalised.
 */
export function mapDummyProductToSingleProduct(
  d: DummyProduct
): SingleProduct {
  const productId = String(d.id);
  const imageList =
    d.images && d.images.length > 0 ? d.images : [deriveFirstImage(d)].filter(Boolean);

  return {
    id: productId,
    stock: d.stock ?? 0,
    price: Math.round((d.price ?? 0) * CENTS_MULTIPLIER),
    shipping: deriveShipping(d),
    colors: deriveColors(d),
    category: d.category ?? "uncategorised",
    images: buildImageArray(imageList, productId),
    reviews:
      Array.isArray(d.reviews) && d.reviews.length > 0 ? d.reviews.length : 1,
    stars: typeof d.rating === "number" ? Math.round(d.rating * 10) / 10 : 4,
    name: d.title,
    description: d.description ?? "",
    company: (d.brand ?? "").toLowerCase(),
    amount: 1,
    color: "",
  };
}

/**
 * Convenience: map a whole list response.
 */
export function mapDummyProductsResponse(
  res: DummyProductsResponse
): Products[] {
  return res.products.map(mapDummyProductToProduct);
}
