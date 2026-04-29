"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/components/cart/CartProvider";
import { formatPeso } from "@/lib/utils";

export function CartClient() {
  const { items, subtotal, updateQuantity, removeItem, itemKey } = useCart();

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is waiting for something pretty"
        description="Browse Creative Modista tops, blouses, dresses, and ready-to-ship items."
        action={<Button href="/products">Shop Now</Button>}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4">
        {items.map((item) => {
          const key = itemKey(item);
          return (
            <article key={key} className="grid gap-4 rounded-lg border border-blush-100 bg-white p-4 shadow-sm sm:grid-cols-[110px_1fr_auto]">
              <Link href={`/products/${item.slug}`} className="relative aspect-square overflow-hidden rounded-md bg-linen">
                <Image src={item.image} alt={item.name} fill sizes="110px" className="object-cover" />
              </Link>
              <div>
                <Link href={`/products/${item.slug}`}>
                  <h2 className="font-semibold text-ink">{item.name}</h2>
                </Link>
                <p className="mt-1 text-sm text-neutral-500">
                  {item.size} / {item.color}
                </p>
                <p className="mt-2 font-semibold">{formatPeso(item.salePrice ?? item.price)}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <div className="flex items-center rounded-full border border-blush-100">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="p-2"
                    onClick={() => updateQuantity(key, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="p-2"
                    onClick={() => updateQuantity(key, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blush-500"
                  onClick={() => removeItem(key)}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="h-fit rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <strong>{formatPeso(subtotal)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Calculated after confirmation</span>
          </div>
          <label className="mt-2 block">
            Promo code
            <input
              placeholder="Enter code"
              className="mt-2 w-full rounded-full border border-blush-100 px-4 py-2.5 outline-none focus:border-blush-300"
            />
          </label>
          <div className="border-t border-blush-100 pt-3">
            <div className="flex justify-between text-base">
              <span>Total</span>
              <strong>{formatPeso(subtotal)}</strong>
            </div>
          </div>
        </div>
        <Button href="/checkout" className="mt-5 w-full">
          Checkout
        </Button>
      </aside>
    </div>
  );
}
