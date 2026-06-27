import type { LinksInterface, ServicesInterface } from "../types";
import { GiCompass, GiDiamondHard, GiStabbedNote } from "react-icons/gi";

/**
 * Canonical brand name. Single source of truth for every visible
 * "Comfy Sloth" reference across the app - copy text, aria-labels,
 * document title, footer legal row, etc. Consumers that need a
 * wordmark-style lowercase form can derive it via APP_NAME.toLowerCase().
 */
export const APP_NAME = "Comfy Sloth";

/**
 * Navigation links for the application header.
 * Each link has an id, text, and URL.
 */
export const links: LinksInterface[] = [
  {
    id: 1,
    text: "home",
    url: "/",
  },
  {
    id: 2,
    text: "about",
    url: "/about",
  },
  {
    id: 3,
    text: "products",
    url: "/products",
  },
];

/**
 * Services data for the services section.
 * Each service has an id, icon (React element), title, and descriptive text.
 */
export const services: ServicesInterface[] = [
  {
    id: 1,
    icon: <GiCompass />,
    title: "mission",
    text: `Our mission at "${APP_NAME}" is to provide exceptional comfort and style, crafting spaces that inspire relaxation and well-being.`,
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: "vision",
    text: `Our vision at "${APP_NAME}" is to redefine the concept of comfort, creating homes that nurture and rejuvenate, fostering a sense of tranquility and well-being in every space.`,
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: "history",
    text: `Established in 1996, ${APP_NAME} has been committed to providing cozy and stylish products for comfortable living spaces.`,
  },
];

/**
 * Base URL for fetching all products from the dummyjson API.
 * Returns a paginated wrapper { products, total, skip, limit }; the APIClient
 * unwraps it for callers.
 */
export const products_url: string = "/products?limit=100";

/**
 * Base URL for fetching a single product by ID from the dummyjson API.
 * Append the product ID to this URL (e.g. `/products/12`).
 */
export const single_product_url: string = "/products/";

/**
 * Endpoint that returns the full list of categories from the dummyjson
 * catalog (24 entries, each `{ slug, name, url }`). Used by the Filter
 * sidebar so every category is discoverable from the first paint - not
 * just the categories that happen to live in the currently-loaded product
 * pages of the infinite-scrolled products query.
 */
export const category_list_url: string = "/products/category-list";

/**
 * Application constants object for easy access and potential future expansion.
 */
export const constants = {
  appName: APP_NAME,
  links,
  services,
  urls: {
    products: products_url,
    singleProduct: single_product_url,
    categoryList: category_list_url,
  },
} as const;
