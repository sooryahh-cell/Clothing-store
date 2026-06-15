"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number) => void;
  removeFromCart: (id: string, size: string | undefined) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("terrafit_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("terrafit_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = useCallback((newItem: CartItem) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existingItemIndex >= 0) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  }, []);

  const updateQuantity = useCallback((id: string, size: string | undefined, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((id: string, size: string | undefined) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  }, []);

  const clearCart = useCallback(() => {
    setCart((prev) => (prev.length === 0 ? prev : []));
  }, []);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
