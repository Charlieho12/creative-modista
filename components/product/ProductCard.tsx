"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Product } from "@/lib/types";
import { formatPeso } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const isLowStock = product.isAvailable && product.stock > 0 && product.stock <= 5;

  return (
    <article className="group overflow-hidden rounded-lg border border-blush-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-linen">
        <Image
          src={product.image}
          alt={`${product.name} by Creative Modista`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.salePrice ? <Badge className="border-blush-300 bg-blush-50">Sale</Badge> : null}
          {product.isNewArrival ? <Badge>New</Badge> : null}
          {isLowStock ? <Badge className="border-champagne bg-white">Low stock</Badge> : null}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton product={product} />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blush-500">
            {product.category}
          </p>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <Star size={14} className="fill-champagne text-champagne" />
            {product.rating}
          </span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 min-h-12 text-base font-semibold leading-6 text-ink hover:text-blush-500">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap gap-1 text-xs text-neutral-500">
          {product.sizes.map((size) => (
            <span key={size} className="rounded-full bg-linen px-2 py-1">
              {size}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-ink">
                {formatPeso(product.salePrice ?? product.price)}
              </span>
              {product.salePrice ? (
                <span className="text-sm text-neutral-400 line-through">{formatPeso(product.price)}</span>
              ) : null}
            </div>
            <p className="text-xs text-neutral-500">
              {product.isAvailable ? `${product.stock} available` : "Out of stock"}
            </p>
          </div>
          <Button
            type="button"
            className="px-4"
            disabled={!product.isAvailable}
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={17} />
          </Button>
        </div>
      </div>
    </article>
  );
}
