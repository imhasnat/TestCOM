"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "shopping-cart";

export function CartProvider({ children }) {
  // Initialize with empty array to avoid hydration mismatch
  const [cartItems, setCartItems] = useState([]);
  // Add a mounted state to handle hydration
  const [mounted, setMounted] = useState(false);

  // Load cart data after initial render
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const addToCart = (product, quantity) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.productId === product.productID
      );

      return existingItem
        ? prev.map((item) =>
            item.productId === product.productID
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [
            ...prev,
            {
              productId: product.productID,
              name: product.productName,
              price: product.price,
              discount: product.discount,
              image: product.image,
              quantity,
            },
          ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Create a value object that includes the mounted state
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    mounted,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
