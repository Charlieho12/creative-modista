"use client";

import Image from "next/image";
import { useState } from "react";
import { Ruler, ShoppingBag, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Product } from "@/lib/types";
import { formatPeso } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const [image, setImage] = useState(product.images[0] ?? product.image);
  const [size, setSize] = useState(product.sizes[0] ?? "Free Size");
  const [color, setColor] = useState(product.colors[0] ?? "Default");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const addSelected = () => addItem(product, { size, color, quantity });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <section>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-linen">
          <Image
            src={image}
            alt={`${product.name} product view`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {product.images.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setImage(item)}
              className="relative aspect-square overflow-hidden rounded-md border border-blush-100 bg-linen"
              aria-label={`View ${product.name} image`}
            >
              <Image src={item} alt={`${product.name} thumbnail`} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm lg:p-7">
        <div className="flex flex-wrap gap-2">
          <Badge>{product.category}</Badge>
          {product.salePrice ? <Badge className="border-blush-300 bg-blush-50">Sale</Badge> : null}
          {product.stock <= 5 && product.stock > 0 ? <Badge className="border-champagne">Low stock</Badge> : null}
        </div>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink">{product.name}</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{product.description}</p>
        <div className="mt-5 flex items-center gap-3">
          <span className="text-3xl font-bold text-ink">{formatPeso(product.salePrice ?? product.price)}</span>
          {product.salePrice ? (
            <span className="text-lg text-neutral-400 line-through">{formatPeso(product.price)}</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          {product.isAvailable ? `${product.stock} pieces available` : "Currently out of stock"}
        </p>

        <div className="mt-7 grid gap-5">
          <OptionGroup label="Size" options={product.sizes} value={size} onChange={setSize} />
          <OptionGroup label="Color" options={product.colors} value={color} onChange={setColor} />

          <label className="block text-sm font-semibold text-ink">
            Quantity
            <input
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="mt-2 w-28 rounded-full border border-blush-100 px-4 py-2 outline-none focus:border-blush-300"
            />
          </label>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button type="button" disabled={!product.isAvailable} onClick={addSelected}>
            <ShoppingBag size={18} /> Add to Cart
          </Button>
          <Button href="/checkout" variant="secondary" onClick={addSelected}>
            <Zap size={18} /> Buy Now
          </Button>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-linen p-4 text-sm text-neutral-700">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Ruler size={17} /> Size guide
          </p>
          <p>Choose your usual top size. For fitted sexy tops, size up for a softer drape.</p>
          <div className="flex w-fit items-center gap-2 font-semibold text-blush-500">
            <WishlistButton product={product} /> Save to wishlist
          </div>
        </div>
      </section>
    </div>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              value === option
                ? "border-ink bg-ink text-white"
                : "border-blush-100 bg-white text-ink hover:border-blush-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
