"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/lib/types";

const recentlyViewedKey = "creative-modista-recently-viewed";

export function RecentlyViewed({
  currentProduct,
  products
}: {
  currentProduct: Product;
  products: Product[];
}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = readRecentlyViewed();
    const next = [currentProduct.id, ...stored.filter((id) => id !== currentProduct.id)].slice(0, 8);
    window.localStorage.setItem(recentlyViewedKey, JSON.stringify(next));
    setIds(next);
  }, [currentProduct.id]);

  const viewed = useMemo(
    () => ids.filter((id) => id !== currentProduct.id).map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[],
    [currentProduct.id, ids, products]
  );

  if (!viewed.length) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {viewed.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function readRecentlyViewed() {
  try {
    return JSON.parse(window.localStorage.getItem(recentlyViewedKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}
