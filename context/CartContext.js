"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bsv:cart";
const ORDER_KEY = "bsv:lastOrder";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [lastOrder, setLastOrderState] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
      const rawOrder = window.sessionStorage.getItem(ORDER_KEY);
      if (rawOrder) setLastOrderState(JSON.parse(rawOrder));
    } catch {
      /* localStorage unavailable — cart stays empty for this session */
    }
    setReady(true);
  }, []);

  const setLastOrder = useCallback((order) => {
    setLastOrderState(order);
    try {
      window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next) => {
    setCart(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const addToCart = useCallback(
    (id, qty) => {
      setCart((prev) => {
        const existing = prev.find((c) => c.id === id);
        const next = existing
          ? prev.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c))
          : [...prev, { id, qty }];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const updateCartQty = useCallback(
    (id, qty) => {
      setCart((prev) => {
        const next = qty <= 0 ? prev.filter((c) => c.id !== id) : prev.map((c) => (c.id === id ? { ...c, qty } : c));
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((prev) => {
        const next = prev.filter((c) => c.id !== id);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  return (
    <CartContext.Provider value={{ cart, ready, addToCart, updateCartQty, removeFromCart, clearCart, lastOrder, setLastOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
