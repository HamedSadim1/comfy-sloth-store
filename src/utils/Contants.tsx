import { LinksInterface, ServicesInterface } from "../types";
import { GiCompass, GiDiamondHard, GiStabbedNote } from "react-icons/gi";

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
    text: `Our mission at "Comfy Sloth" is to provide exceptional comfort and style, crafting spaces that inspire relaxation and well-being.`,
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: "vision",
    text: `Our vision at "Comfy Sloth" is to redefine the concept of comfort, creating homes that nurture and rejuvenate, fostering a sense of tranquility and well-being in every space.`,
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: "history",
    text: "Established in 1996, Comfy Sloth has been committed to providing cozy and stylish products for comfortable living spaces.",
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
 * Application constants object for easy access and potential future expansion.
 */
export const constants = {
  links,
  services,
  urls: {
    products: products_url,
    singleProduct: single_product_url,
  },
} as const;
