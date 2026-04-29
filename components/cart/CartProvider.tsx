"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { CartItem, Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

type AddOptions = {
  size?: string;
  color?: string;
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, options?: AddOptions) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  itemKey: (item: Pick<CartItem, "productId" | "size" | "color">) => string;
};

type SupabaseCartItem = {
  quantity: number;
  size: string;
  color: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    stock: number;
    product_images?: { url: string; sort_order: number }[];
  };
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "creative-modista-cart";

export function cartItemKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}:${item.size}:${item.color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [syncReady, setSyncReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored) as CartItem[]);
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [isHydrated, items]);

  useEffect(() => {
    async function loadSupabaseCart() {
      const supabase = createClient();
      if (!supabase || !isHydrated) {
        return;
      }

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        return;
      }

      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      if (!cart) {
        setSyncReady(true);
        return;
      }

      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("quantity, size, color, products(id, name, slug, price, sale_price, stock, product_images(url, sort_order))")
        .eq("cart_id", cart.id);

      if (cartItems?.length) {
        setItems(
          (cartItems as SupabaseCartItem[]).map((item) => {
            const product = item.products;
            const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
            return {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: images[0]?.url ?? "",
              price: Number(product.price),
              salePrice: product.sale_price,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              stock: product.stock
            };
          })
        );
      }
      setSyncReady(true);
    }

    loadSupabaseCart();
  }, [isHydrated]);

  useEffect(() => {
    async function syncSupabaseCart() {
      const supabase = createClient();
      if (!supabase || !syncReady) {
        return;
      }

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        return;
      }

      const { data: cart } = await supabase
        .from("carts")
        .upsert({ user_id: auth.user.id }, { onConflict: "user_id" })
        .select("id")
        .single();

      if (!cart) {
        return;
      }

      await supabase.from("cart_items").delete().eq("cart_id", cart.id);
      const rows = items
        .filter((item) => isUuid(item.productId))
        .map((item) => ({
          cart_id: cart.id,
          product_id: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        }));

      if (rows.length) {
        await supabase.from("cart_items").insert(rows);
      }
    }

    syncSupabaseCart();
  }, [items, syncReady]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
        0
      ),
      addItem(product, options) {
        const size = options?.size ?? product.sizes[0] ?? "Free Size";
        const color = options?.color ?? product.colors[0] ?? "Default";
        const quantity = options?.quantity ?? 1;
        const nextItem: CartItem = {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          salePrice: product.salePrice,
          size,
          color,
          quantity,
          stock: product.stock
        };

        setItems((current) => {
          const key = cartItemKey(nextItem);
          const exists = current.find((item) => cartItemKey(item) === key);
          if (!exists) {
            return [...current, nextItem];
          }
          return current.map((item) =>
            cartItemKey(item) === key
              ? {
                  ...item,
                  quantity: Math.min(item.stock, item.quantity + quantity)
                }
              : item
          );
        });
      },
      updateQuantity(key, quantity) {
        setItems((current) =>
          current.map((item) =>
            cartItemKey(item) === key
              ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
              : item
          )
        );
      },
      removeItem(key) {
        setItems((current) => current.filter((item) => cartItemKey(item) !== key));
      },
      clearCart() {
        setItems([]);
      },
      itemKey: cartItemKey
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
