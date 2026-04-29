"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";

const wishlistKey = "creative-modista-wishlist";

export function WishlistButton({ product }: { product: Product }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const ids = readWishlist();
    setActive(ids.includes(product.id));
  }, [product.id]);

  function toggle() {
    const ids = readWishlist();
    const next = ids.includes(product.id)
      ? ids.filter((id) => id !== product.id)
      : [...ids, product.id];
    window.localStorage.setItem(wishlistKey, JSON.stringify(next));
    setActive(next.includes(product.id));
  }

  return (
    <button
      type="button"
      aria-label={`${active ? "Remove" : "Add"} ${product.name} ${active ? "from" : "to"} wishlist`}
      className={`rounded-full p-2 shadow-sm transition ${
        active ? "bg-blush-500 text-white" : "bg-white/90 text-ink hover:bg-blush-50"
      }`}
      onClick={toggle}
    >
      <Heart size={18} className={active ? "fill-white" : ""} />
    </button>
  );
}

export function readWishlist() {
  try {
    return JSON.parse(window.localStorage.getItem(wishlistKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}
