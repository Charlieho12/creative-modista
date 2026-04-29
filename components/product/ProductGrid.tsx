"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { categories, colors, sizes } from "@/lib/constants";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [maxPrice, setMaxPrice] = useState("1500");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      const matchesSize = size === "All" || product.sizes.includes(size);
      const matchesColor = color === "All" || product.colors.includes(color);
      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" ? product.isAvailable : !product.isAvailable);
      const matchesPrice = (product.salePrice ?? product.price) <= Number(maxPrice);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesSize &&
        matchesColor &&
        matchesAvailability &&
        matchesPrice
      );
    });
  }, [availability, category, color, maxPrice, products, query, size]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-blush-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-base font-semibold text-ink">Find your fit</h2>
        <label className="mt-4 block text-sm font-medium text-neutral-700" htmlFor="product-search">
          Search
        </label>
        <div className="mt-2 flex items-center rounded-full border border-blush-100 bg-white px-3">
          <Search size={17} className="text-neutral-400" />
          <input
            id="product-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tops, blouses, dresses"
            className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none"
          />
        </div>

        <FilterSelect label="Category" value={category} onChange={setCategory} options={["All", ...categories]} />
        <FilterSelect label="Size" value={size} onChange={setSize} options={["All", ...sizes]} />
        <FilterSelect label="Color" value={color} onChange={setColor} options={["All", ...colors]} />
        <FilterSelect label="Availability" value={availability} onChange={setAvailability} options={["All", "Available", "Out of stock"]} />

        <label className="mt-4 block text-sm font-medium text-neutral-700" htmlFor="price-range">
          Max price: PHP {maxPrice}
        </label>
        <input
          id="price-range"
          type="range"
          min="300"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          className="mt-2 w-full accent-blush-500"
        />
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            Showing <strong>{filtered.length}</strong> of {products.length} styles
          </p>
        </div>
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No styles found"
            description="Try clearing a filter or searching for another Creative Modista favorite."
          />
        )}
      </section>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="mt-4 block text-sm font-medium text-neutral-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-full border border-blush-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-blush-300"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
