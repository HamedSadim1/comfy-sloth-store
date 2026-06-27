import { create } from "zustand";

// Interface for cart item details
//
// No `color` field: dummyjson products expose no colour per item,
// and the previous SingleProduct selector carried a placeholder
// `""` value that AddToCart had to thread through the cart payload.
// Dropping the field both removes the dead state and lets the
// addToCart signature slim down to (product, amount, image).
export interface CartDetail {
  id: string;
  stock: number;
  price: number;
  name: string;
  amount: number;
  image: string;
}

// Interface for single product state
interface SingleProductState {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  amount: number;
}

// Interface for the store state and actions
interface SingleProductStore extends SingleProductState {
  increaseAmount: () => void;
  decreaseAmount: () => void;
  setImage: (image: string) => void;
  setAmount: (amount: number) => void;
  setProduct: (product: Omit<SingleProductState, "amount">) => void;
  reset: () => void;
}

/**
 * Zustand store for managing single product selection state.
 * Handles amount and image selection for a product before adding to cart.
 */
export const useSingleProductStore = create<SingleProductStore>((set) => ({
  // Initial state
  id: "",
  name: "",
  price: 0,
  stock: 0,
  image: "",
  amount: 1,

  // Increase amount, respecting stock limit
  increaseAmount: () => {
    set((state) => ({
      amount: Math.min(state.amount + 1, state.stock),
    }));
  },

  // Decrease amount, minimum 1
  decreaseAmount: () => {
    set((state) => ({
      amount: Math.max(state.amount - 1, 1),
    }));
  },

  // Set selected image
  setImage: (image: string) => {
    set({ image });
  },

  // Set amount directly
  setAmount: (amount: number) => {
    set((state) => ({
      amount: Math.min(Math.max(amount, 1), state.stock),
    }));
  },

  // Set product details (used when loading a product)
  setProduct: (product: Omit<SingleProductState, "amount">) => {
    set({ ...product, amount: 1 });
  },

  // Reset to initial state
  reset: () => {
    set({
      id: "",
      name: "",
      price: 0,
      stock: 0,
      image: "",
      amount: 1,
    });
  },
}));
