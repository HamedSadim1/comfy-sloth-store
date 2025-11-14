import { create } from "zustand";

// Interface for cart item details
export interface CartDetail {
  id: string;
  stock: number;
  price: number;
  name: string;
  color: string;
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
  color: string;
  amount: number;
}

// Interface for the store state and actions
interface SingleProductStore extends SingleProductState {
  increaseAmount: () => void;
  decreaseAmount: () => void;
  setColor: (color: string) => void;
  setImage: (image: string) => void;
  setAmount: (amount: number) => void;
  setProduct: (product: Omit<SingleProductState, "amount" | "color">) => void;
  reset: () => void;
}

/**
 * Zustand store for managing single product selection state.
 * Handles amount, color, image selection for a product before adding to cart.
 */
export const useSingleProductStore = create<SingleProductStore>((set) => ({
  // Initial state
  id: "",
  name: "",
  price: 0,
  stock: 0,
  image: "",
  color: "",
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

  // Set selected color
  setColor: (color: string) => {
    set({ color });
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
  setProduct: (product: Omit<SingleProductState, "amount" | "color">) => {
    set({ ...product, amount: 1, color: "" });
  },

  // Reset to initial state
  reset: () => {
    set({
      id: "",
      name: "",
      price: 0,
      stock: 0,
      image: "",
      color: "",
      amount: 1,
    });
  },
}));
