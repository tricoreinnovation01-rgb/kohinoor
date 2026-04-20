"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  artworkId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

const STORAGE = "diya-cart";

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (artworkId: string) => void;
  setQuantity: (artworkId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !ready) return;
    localStorage.setItem(STORAGE, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const q = item.quantity ?? 1;
        const idx = prev.findIndex((x) => x.artworkId === item.artworkId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + q,
          };
          return next;
        }
        return [
          ...prev,
          {
            artworkId: item.artworkId,
            slug: item.slug,
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: q,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((artworkId: string) => {
    setItems((prev) => prev.filter((x) => x.artworkId !== artworkId));
  }, []);

  const setQuantity = useCallback((artworkId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => x.artworkId !== artworkId));
      return;
    }
    setItems((prev) =>
      prev.map((x) =>
        x.artworkId === artworkId ? { ...x, quantity } : x
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { total, count } = useMemo(() => {
    const total = items.reduce((s, x) => s + x.price * x.quantity, 0);
    const count = items.reduce((s, x) => s + x.quantity, 0);
    return { total, count };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      total,
      count,
    }),
    [items, addItem, removeItem, setQuantity, clear, total, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
