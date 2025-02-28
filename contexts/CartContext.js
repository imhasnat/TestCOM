"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  createOrUpdateCart,
  decreaseCartItem,
  deleteCartItem,
  getCartItemsByUserId,
  increaseCartItem,
} from "api/cart/cartApi";
import { toast } from "node_modules/react-toastify/dist";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = user?.id;
        const response = await getCartItemsByUserId(userId);
        if (!response.success) throw new Error("Failed to fetch cart");
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (user?.id) {
      fetchCart();
    }
    setMounted(true);
  }, [user?.id]);

  const addToCart = async (product, quantity) => {
    try {
      const userId = user?.id;
      const cartData = {
        userId,
        quantity,
        productId: product.productID,
      };
      const response = await createOrUpdateCart(cartData);

      if (!response.success) {
        toast.error("Error adding Product: " + response.message);
        return;
      }

      // Refresh cart data after successful addition
      const updatedCartResponse = await getCartItemsByUserId(userId);

      if (!updatedCartResponse.success)
        throw new Error("Failed to fetch updated cart");
      setCartItems(updatedCartResponse.data);
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      toast.error("Error removed item: " + error.message);
    }
  };

  const removeFromCart = async (cartItemID) => {
    try {
      const response = await deleteCartItem(cartItemID);

      if (!response.success) {
        toast.error("Error removing Product: " + response.message);
        return;
      }

      // Update local state after successful deletion
      setCartItems((prev) =>
        prev.filter((item) => item.cartItemID !== cartItemID)
      );
      toast.success("Item removed successfully!");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Error removed item: " + error.message);
    }
  };

  const updateQuantity = async (cartItemID, mode) => {
    try {
      const userId = user?.id;

      const cartData = {
        cartItemID,
      };
      let response;
      if (mode === "increment") {
        response = await increaseCartItem(cartData);
      } else if (mode === "decrement") {
        response = await decreaseCartItem(cartData);
      }

      if (!response.success) {
        toast.error("Error updating Product quantity: " + response.message);
        return;
      }

      // Refresh cart data after successful update
      const updatedCartResponse = await getCartItemsByUserId(userId);

      toast.success("Product quantity updated successfully!");
      setCartItems(updatedCartResponse.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error updating Product quantity: " + error.message);
    }
  };

  const clearCart = async () => {
    // If there's no bulk delete API, we'll need to delete items one by one
    try {
      await Promise.all(cartItems.map((item) => removeFromCart(item.cartId)));
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    setCartItems,
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
