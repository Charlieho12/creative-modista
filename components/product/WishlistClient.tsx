"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { readWishlist } from "@/components/product/WishlistButton";
import { Product } from "@/lib/types";

export function WishlistClient({ products }: { products: Product[] }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readWishlist());
  }, []);

  const wishlistProducts = products.filter((product) => ids.includes(product.id));

  if (!wishlistProducts.length) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any Creative Modista product to save it for later."
        action={<Button href="/products">Browse products</Button>}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {wishlistProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
