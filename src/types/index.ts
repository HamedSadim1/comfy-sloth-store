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
  colors: Color[];
  company: string;
  description: string;
  category: string;
  shipping?: boolean;
  featured?: boolean;
}

/**
 * Represents a detailed single product view.
 */
export interface SingleProduct {
  id: string;
  stock: number;
  price: number;
  shipping: boolean;
  colors: string[];
  category: string;
  images: Image[];
  reviews: number;
  stars: number;
  name: string;
  description: string;
  company: string;
  amount?: number;
  color?: string;
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
/**
 * Represents an item to add to the cart.
 */
export interface AddToCart {
  id: string;
  stock: number;
  price: number;
  shipping: boolean;
  color: string;
  amount: number;
  max: number;
  image: string;
}

// Catalog Types
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

// Enums
/**
 * Enum for product colors.
 */
export enum Color {
  All = "all",
  Red = "#ff0000",
  Yellow = "#ffb900",
  Black = "#000",
  Blue = "#0000ff",
  Green = "#00ff00",
}

// Utility Types
/**
 * Generic response type for API calls.
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * Type for filter options.
 */
export interface FilterOptions {
  category: string;
  company: string;
  color: string;
  price: number;
  shipping: boolean;
  searchText: string;
}

/**
 * Type for sorting options.
 */
export type SortOption = "price-lowest" | "price-highest" | "name-a" | "name-z";

/**
 * Type for view modes.
 */
export type ViewMode = "grid" | "list";
