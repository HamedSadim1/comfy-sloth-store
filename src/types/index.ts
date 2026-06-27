import React from "react";

/**
 * Type definitions for the Comfy Sloth Store application.
 * This file contains interfaces, enums, and types used throughout the app.
 */

// Navigation and UI Types
/**
 * Represents a navigation link.
 */
export interface LinksInterface {
  id: number;
  text: string;
  url: string;
}

/**
 * Represents a service item with icon, title, and description.
 */
export interface ServicesInterface {
  id: number;
  icon: React.JSX.Element;
  title: string;
  text: string;
}

// Product Types
/**
 * Represents a product in the store.
 *
 * `company` is a free-form string (brand name from the upstream API)
 * rather than the legacy `Company` enum. With dummyjson.com there are
 * dozens of arbitrary brand names, so the brand list is now derived
 * dynamically from the loaded product set instead of being hardcoded.
 */
export interface Products {
  id: string;
  name: string;
  price: number;
  image: string;
  company: string;
  description: string;
  category: string;
  shipping?: boolean;
  featured?: boolean;
}

/**
 * Represents a detailed single product view.
 */
// No `colors: string[]` or `color?: string` field here: dummyjson exposes
// no colour per product and a future variant model would likely use a
// different shape (a `Variant` interface or `tags: string[]`) rather than
// a reusable colour array. The `colors` field was dropped from the list
// `Products` type alongside the deleted `Color` enum and the `NO_COLORS`
// constant in `mappers.ts`. CartItem extends this interface, so dropping
// the field here cascades through cleanly.
export interface SingleProduct {
  id: string;
  stock: number;
  price: number;
  shipping: boolean;
  category: string;
  images: Image[];
  reviews: number;
  stars: number;
  name: string;
  description: string;
  company: string;
  amount?: number;
}

/**
 * Represents an image with metadata.
 */
export interface Image {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: Thumbnails;
}

/**
 * Represents thumbnail images in different sizes.
 */
export interface Thumbnails {
  small: Full;
  large: Full;
  full: Full;
}

/**
 * Represents a full image with dimensions.
 */
export interface Full {
  url: string;
  width: number;
  height: number;
}

// Cart Types
//
// AddToCart type deleted: the only remaining cart-add signal is the
// React `<AddToCart />` component, which talks to `useCartContext`’s
// `addToCart(product, amount, image)` directly. The previous type-level
// `AddToCart` interface carried a `color: string` field that threaded a
// placeholder colour through the cart payload; with `Color` gone and
// `CartItem.color` removed, this interface is no longer referenced.


/**
 * Represents a category entry from the dummyjson `/products/category-list`
 * endpoint. The `slug` is the canonical filter value (matches what the
 * Zustand `useStore.category` field tracks and what the products'
 * `category` string contains); `name` is the human-friendly display label
 * used in the filter UI; `url` is the upstream dummyjson route, kept for
 * future deep-linking.
 */
export interface Category {
  slug: string;
  name: string;
  url: string;
}

// Utility Types
//
// Note: a previous `Color` enum and a placeholder `FilterOptions`
// interface lived here. Both were deleted in lockstep with the broken
// brand-fallback / fake colour-palette removal: the enum semantically
// referenced the discarded 5-tone palette, and `FilterOptions` had only
// a `color: string` field left as its legacy detail, with no live
// consumer.

/**
 * Generic response type for API calls.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Type for sorting options.
 */
export type SortOption = "price-lowest" | "price-highest" | "name-a" | "name-z";

/**
 * Type for view modes.
 */
export type ViewMode = "grid" | "list";
