import type { Metadata } from "next";
import { WishlistClient } from "@/components/product/WishlistClient";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Save Creative Modista women's fashion favorites to your wishlist."
};

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <div className="container-shell py-12">
      <h1 className="mb-3 font-serif text-4xl font-semibold text-ink">Wishlist</h1>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-neutral-600">
        Keep track of Creative Modista tops, blouses, dresses, and ready-to-shop favorites.
      </p>
      <WishlistClient products={products} />
    </div>
  );
}
