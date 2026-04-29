import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop Women's Tops, Blouses, Dresses",
  description:
    "Browse Creative Modista women's tops, blouses, sexy tops, dresses, and available fashion items in the Philippines."
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container-shell py-12" id="collection">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blush-500">Shop collection</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink md:text-5xl">
          Women&apos;s tops, blouses, dresses, and available items
        </h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Search and filter by category, size, color, price, and availability.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
