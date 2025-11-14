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
 */
export interface Products {
  id: string;
  name: string;
  price: number;
  image: string;
  colors: Color[];
  company: Company;
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

/**
 * Enum for product companies.
 */
export enum Company {
  Caressa = "caressa",
  Ikea = "ikea",
  Liddy = "liddy",
  Marcos = "marcos",
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
