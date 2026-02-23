import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext"; // Import useAuth

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // Get user and authLoading from AuthContext
  const [cart, setCart] = useState({ items: [] }); // Initialize cart with an empty items array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      // Only fetch cart if authentication is done and a user is logged in
      if (!authLoading && user) {
        try {
          const data = await api.get("/cart");
          setCart(data);
        } catch (error) {
          console.error("Failed to fetch cart:", error.message);
          // If unauthorized, clear cart locally but don't set error state yet as user might not be logged in.
          // This ensures the UI reflects an empty cart if not logged in.
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            setCart({ items: [] });
          }
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        // If not logged in and auth loading is done, treat cart as empty
        setCart({ items: [] });
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]); // Re-run effect when user or authLoading changes

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error("You must be logged in to add items to your cart.");
    }
    try {
      const updatedCart = await api.post("/cart/add", { productId, quantity });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!user) {
      throw new Error("You must be logged in to update your cart.");
    }
    try {
      const updatedCart = await api.put(`/cart/item/${productId}`, { quantity });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to update cart item:", error.message);
      throw error;
    }
  };

  const removeCartItem = async (productId) => {
    if (!user) {
      throw new Error("You must be logged in to remove items from your cart.");
    }
    try {
      const updatedCart = await api.delete(`/cart/item/${productId}`);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Failed to remove cart item:", error.message);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error("You must be logged in to clear your cart.");
    }
    try {
      await api.delete("/cart");
      setCart({ items: [] });
    } catch (error) {
      console.error("Failed to clear cart:", error.message);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateCartItem, removeCartItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
