"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function FloatingCartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="Open cart"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-ink text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-black"
    >
      <ShoppingBag size={22} />
      {count ? (
        <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-blush-500 text-xs font-bold">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
