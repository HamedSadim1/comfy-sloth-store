import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SingleProduct } from "../types";

// Interface for the cart item with additional properties
export interface CartItem extends SingleProduct {
  amount: number;
  color: string;
  image: string;
}

// Interface for the cart context value
interface CartContextProps {
  cart: CartItem[];
  totalItems: number;
  totalAmount: number;
  shippingFee: number;
  addToCart: (
    product: SingleProduct,
    amount: number,
    color: string,
    image: string
  ) => void;
  removeFromCart: (id: string) => void;
  toggleAmount: (id: string, type: "inc" | "dec") => void;
  clearCart: () => void;
}

// Create context with undefined default to ensure it's used within provider
const CartContext = createContext<CartContextProps | undefined>(undefined);

// Interface for CartProvider props
interface CartProviderProps {
  children: React.ReactNode;
}

// Shipping fee constant
const SHIPPING_FEE = 534;

// CartProvider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Function to get cart from localStorage, used as lazy initializer for useState
  const getLocalStorage = useCallback((): CartItem[] => {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.warn("Failed to parse cart from localStorage:", error);
      return [];
    }
  }, []);

  // State for cart, initialized with localStorage data
  const [cart, setCart] = useState<CartItem[]>(getLocalStorage);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const shippingFee = SHIPPING_FEE; // Constant shipping fee

  // Function to add product to cart, memoized for performance
  const addToCart = useCallback(
    (product: SingleProduct, amount: number, color: string, image: string) => {
      setCart((prevCart) => {
        const existingProduct = prevCart.find((item) => item.id === product.id);

        if (existingProduct) {
          // Update amount and color for existing product
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, amount, color, image } : item
          );
        } else {
          // Add new product to cart
          return [...prevCart, { ...product, amount, color, image }];
        }
      });
    },
    []
  );

  // Function to remove product from cart by id, memoized for performance
  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  // Function to clear entire cart, memoized for performance
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Function to toggle amount (increase or decrease), memoized for performance
  const toggleAmount = useCallback((id: string, type: "inc" | "dec") => {
    setCart((prevCart) =>
      prevCart.map((cartItem) => {
        if (cartItem.id === id) {
          let newAmount = cartItem.amount;
          if (type === "inc") {
            newAmount = Math.min(cartItem.amount + 1, cartItem.stock);
          } else if (type === "dec") {
            newAmount = Math.max(cartItem.amount - 1, 1);
          }
          return { ...cartItem, amount: newAmount };
        }
        return cartItem;
      })
    );
  }, []);

  // Effect to calculate totals and save to localStorage whenever cart changes
  useEffect(() => {
    // Calculate total items (sum of amounts)
    const newTotalItems = cart.reduce(
      (total, item) => total + (item.amount || 0),
      0
    );

    // Calculate total amount (sum of amount * price)
    const newTotalAmount = cart.reduce(
      (total, item) => total + (item.amount || 0) * item.price,
      0
    );

    setTotalItems(newTotalItems);
    setTotalAmount(newTotalAmount);

    // Save cart to localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.warn("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Context value object, memoized to prevent unnecessary re-renders
  const contextValue = React.useMemo<CartContextProps>(
    () => ({
      cart,
      totalItems,
      totalAmount,
      shippingFee,
      addToCart,
      removeFromCart,
      clearCart,
      toggleAmount,
    }),
    [
      cart,
      totalItems,
      totalAmount,
      addToCart,
      removeFromCart,
      clearCart,
      toggleAmount,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCartContext = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export default { CartContext, CartProvider };
