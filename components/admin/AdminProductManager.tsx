"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatPeso, slugify } from "@/lib/utils";

export function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingReviews, setGeneratingReviews] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured. Add environment variables before managing live products.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(url, alt_text, sort_order), product_reviews(id)")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setProducts([]);
    } else {
      setProducts((data ?? []).map(mapAdminProduct));
    }
    setSelectedProductIds([]);

    setLoading(false);
  }

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setMessage("");

    const form = new FormData(formElement);
    const id = crypto.randomUUID();
    const name = String(form.get("name") ?? "");
    const price = Number(form.get("price") ?? 0);
    const category = String(form.get("category") ?? "Tops");
    const imageUrlField = String(form.get("image") ?? "").trim();
    let image = imageUrlField || "/brand/creative-modista-logo.png";
    const primaryImageFile = form.get("imageFile");
    const galleryFiles = form.getAll("galleryFiles").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    const galleryUrls = String(form.get("galleryUrls") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const supabase = createClient();

    if (!supabase) {
      setMessage("Supabase is not configured. Product was not saved.");
      setSaving(false);
      return;
    }

    if (primaryImageFile instanceof File && primaryImageFile.size > 0) {
      const extension = primaryImageFile.name.split(".").pop() ?? "jpg";
      const path = `${id}/primary-${slugify(name)}.${extension}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, primaryImageFile, { upsert: true });
      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }
      const publicUrl = supabase.storage.from("product-images").getPublicUrl(data.path);
      image = publicUrl.data.publicUrl;
    }

    const uploadedGalleryUrls: string[] = [];
    for (const [index, file] of galleryFiles.entries()) {
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${id}/gallery-${index + 1}-${slugify(name)}.${extension}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });

      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      uploadedGalleryUrls.push(
        supabase.storage.from("product-images").getPublicUrl(data.path).data.publicUrl
      );
    }

    const allImages = [image, ...galleryUrls, ...uploadedGalleryUrls].filter(
      (item, index, current) => Boolean(item) && current.indexOf(item) === index
    );

    const product: Product = {
      id,
      name,
      slug: slugify(name),
      description: String(form.get("description") ?? ""),
      price,
      salePrice: null,
      category,
      sizes: String(form.get("sizes") ?? "S,M,L").split(",").map((item) => item.trim()),
      colors: String(form.get("colors") ?? "White,Black").split(",").map((item) => item.trim()),
      stock: Number(form.get("stock") ?? 0),
      isAvailable: true,
      isFeatured: Boolean(form.get("featured")),
      isNewArrival: Boolean(form.get("new")),
      isBestSeller: Boolean(form.get("best")),
      image,
      images: allImages.length ? allImages : [image],
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase.from("products").insert({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      is_available: product.isAvailable,
      is_featured: product.isFeatured,
      is_new_arrival: product.isNewArrival,
      is_best_seller: product.isBestSeller
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    const { error: imageError } = await supabase.from("product_images").insert(
      product.images.map((url, index) => ({
        product_id: product.id,
        url,
        alt_text: `${product.name} image ${index + 1}`,
        sort_order: index
      }))
    );

    if (imageError) {
      setMessage(imageError.message);
      setSaving(false);
      return;
    }

    let nextMessage = "Product saved.";

    try {
      const reviewResponse = await fetch("/api/admin/reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, replace: true })
      });

      if (reviewResponse.ok) {
        const reviewResult = (await reviewResponse.json()) as { count: number };
        nextMessage = `Product saved and ${reviewResult.count} Gemini AI style notes generated.`;
      } else {
        const reviewError = (await reviewResponse.json()) as { error?: string };
        nextMessage = `Product saved. Gemini AI style notes were not generated: ${reviewError.error ?? "unknown error"}`;
      }
    } catch (error) {
      nextMessage = `Product saved. Gemini AI style notes were not generated: ${error instanceof Error ? error.message : "unknown error"}`;
    }

    setProducts((current) => [
      {
        ...product,
        reviewCount: nextMessage.includes("generated") ? 3 : 0,
        rating: nextMessage.includes("generated") ? 4.7 : 0
      },
      ...current
    ]);
    setMessage(nextMessage);
    formElement.reset();
    setFormKey((key) => key + 1);
    setSaving(false);
  }

  async function generateReviewsForSelectedProducts() {
    if (!selectedProductIds.length) {
      setMessage("Select at least one product first.");
      return;
    }

    setGeneratingReviews(true);
    setMessage("");

    try {
      const results = await Promise.all(
        selectedProductIds.map(async (productId) => {
          const response = await fetch("/api/admin/reviews/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, replace: true })
          });

          const result = (await response.json()) as { error?: string; count?: number };
          if (!response.ok) {
            throw new Error(result.error ?? "Unable to generate AI style notes.");
          }
          return { productId, count: result.count ?? 0 };
        })
      );

      const generatedReviews = results.reduce((total, result) => total + result.count, 0);
      setProducts((current) =>
        current.map((product) => {
          const reviewResult = results.find((result) => result.productId === product.id);
          return reviewResult
            ? {
                ...product,
                reviewCount: reviewResult.count,
                rating: reviewResult.count ? product.rating || 4.7 : product.rating
              }
            : product;
        })
      );
      setMessage(
        `Generated ${generatedReviews} AI notes for ${selectedProductIds.length} selected product${selectedProductIds.length > 1 ? "s" : ""}.`
      );
      setSelectedProductIds([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate AI style notes.");
    } finally {
      setGeneratingReviews(false);
    }
  }

  function toggleProductSelection(productId: string) {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function toggleAllProducts(checked: boolean) {
    setSelectedProductIds(checked ? products.map((product) => product.id) : []);
  }

  function aiNoteStatus(product: Product) {
    return product.reviewCount > 0 ? `${product.reviewCount} AI note${product.reviewCount > 1 ? "s" : ""}` : "No AI notes";
  }

  async function updateProduct(product: Product, updates: Partial<Product>) {
    const nextProduct = { ...product, ...updates };
    const supabase = createClient();
    if (!supabase || !isUuid(product.id)) {
      setMessage("Supabase is not configured. Update was not saved.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        price: nextProduct.price,
        category: nextProduct.category,
        sizes: nextProduct.sizes,
        colors: nextProduct.colors,
        stock: nextProduct.stock,
        is_available: nextProduct.stock > 0,
        is_featured: nextProduct.isFeatured,
        is_new_arrival: nextProduct.isNewArrival,
        is_best_seller: nextProduct.isBestSeller
      })
      .eq("id", product.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((current) => current.map((item) => (item.id === product.id ? nextProduct : item)));
  }

  async function removeProduct(product: Product) {
    const supabase = createClient();
    if (!supabase || !isUuid(product.id)) {
      setMessage("Supabase is not configured. Product was not deleted.");
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== product.id));
    setMessage("Product deleted.");
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form key={formKey} onSubmit={addProduct} className="h-fit rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Plus size={20} /> Add product
        </h2>
        <div className="mt-5 grid gap-3">
          {[
            ["name", "Product name"],
            ["category", "Category"],
            ["price", "Price"],
            ["stock", "Stock"],
            ["sizes", "Sizes, comma separated"],
            ["colors", "Colors, comma separated"],
            ["image", "Image URL"]
          ].map(([name, label]) => (
            <label key={name} className="block text-sm font-semibold">
              {label}
              <input
                name={name}
                required={name !== "image"}
                type={name === "price" || name === "stock" ? "number" : "text"}
                className="mt-2 w-full rounded-full border border-blush-100 px-4 py-2.5 outline-none focus:border-blush-300"
              />
            </label>
          ))}
          <label className="block text-sm font-semibold">
            Upload primary product image
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-2.5 text-sm outline-none focus:border-blush-300"
            />
          </label>
          <label className="block text-sm font-semibold">
            Upload gallery images
            <input
              name="galleryFiles"
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-2.5 text-sm outline-none focus:border-blush-300"
            />
          </label>
          <label className="block text-sm font-semibold">
            Gallery image URLs, one per line
            <textarea
              name="galleryUrls"
              rows={4}
              className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-2.5 outline-none focus:border-blush-300"
            />
          </label>
          <label className="block text-sm font-semibold">
            Description
            <textarea name="description" rows={4} className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-2.5 outline-none focus:border-blush-300" />
          </label>
          <div className="grid gap-2 text-sm">
            <label><input type="checkbox" name="featured" className="mr-2" /> Featured</label>
            <label><input type="checkbox" name="new" className="mr-2" /> New arrival</label>
            <label><input type="checkbox" name="best" className="mr-2" /> Best seller</label>
          </div>
        </div>
        {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-neutral-700">{message}</p> : null}
        <Button type="submit" className="mt-5 w-full" disabled={saving}>
          <Save size={17} /> {saving ? "Saving..." : "Save product"}
        </Button>
      </form>

      <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Manage products</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {selectedProductIds.length
                ? `${selectedProductIds.length} selected for AI note generation`
                : "Select one or more products to generate AI notes"}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={generateReviewsForSelectedProducts}
            disabled={generatingReviews || !selectedProductIds.length}
          >
            <Sparkles size={17} /> {generatingReviews ? "Generating..." : "Generate AI notes"}
          </Button>
        </div>
        {loading ? (
          <p className="mt-5 rounded-lg bg-linen p-4 text-sm text-neutral-700">Loading live products...</p>
        ) : products.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="border-b border-blush-100 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <tr>
                  <th className="py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all products"
                      checked={products.length > 0 && selectedProductIds.length === products.length}
                      onChange={(event) => toggleAllProducts(event.target.checked)}
                    />
                  </th>
                  <th className="py-3">Product</th>
                  <th>AI Notes</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sizes</th>
                  <th>Colors</th>
                  <th>Stock</th>
                  <th>Flags</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-blush-50">
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${product.name}`}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </td>
                    <td className="py-4 font-semibold">{product.name}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          product.reviewCount > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {aiNoteStatus(product)}
                      </span>
                    </td>
                    <td>
                      <input
                        value={product.category}
                        onChange={(event) => updateProduct(product, { category: event.target.value })}
                        className="w-28 rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.price}
                        min={0}
                        onChange={(event) => updateProduct(product, { price: Number(event.target.value) })}
                        aria-label={`Price for ${product.name}, currently ${formatPeso(product.price)}`}
                        className="w-24 rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                      />
                    </td>
                    <td>
                      <input
                        value={product.sizes.join(", ")}
                        onChange={(event) => updateProduct(product, { sizes: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
                        className="w-32 rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                      />
                    </td>
                    <td>
                      <input
                        value={product.colors.join(", ")}
                        onChange={(event) => updateProduct(product, { colors: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })}
                        className="w-32 rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.stock}
                        min={0}
                        onChange={(event) => updateProduct(product, { stock: Number(event.target.value), isAvailable: Number(event.target.value) > 0 })}
                        className="w-20 rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                      />
                    </td>
                    <td className="grid gap-1 py-3 text-xs">
                      <label><input type="checkbox" className="mr-1" checked={product.isFeatured} onChange={(event) => updateProduct(product, { isFeatured: event.target.checked })} /> Featured</label>
                      <label><input type="checkbox" className="mr-1" checked={product.isNewArrival} onChange={(event) => updateProduct(product, { isNewArrival: event.target.checked })} /> New</label>
                      <label><input type="checkbox" className="mr-1" checked={product.isBestSeller} onChange={(event) => updateProduct(product, { isBestSeller: event.target.checked })} /> Best</label>
                    </td>
                    <td>
                      <button type="button" className="inline-flex items-center gap-1 font-semibold text-blush-500" onClick={() => removeProduct(product)}>
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState title="No live products yet" description="Add your first product from the form. Mock starter products are no longer shown when Supabase is connected." />
          </div>
        )}
      </section>
    </div>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

type AdminDbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category: string;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string;
  product_images?: { url: string; sort_order: number }[];
  product_reviews?: { id: string }[];
};

function mapAdminProduct(product: AdminDbProduct): Product {
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    price: Number(product.price),
    salePrice: product.sale_price,
    category: product.category,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    stock: product.stock,
    isAvailable: product.is_available,
    isFeatured: product.is_featured,
    isNewArrival: product.is_new_arrival,
    isBestSeller: product.is_best_seller,
    image: images[0]?.url ?? "/brand/creative-modista-logo.png",
    images: images.length ? images.map((image) => image.url) : ["/brand/creative-modista-logo.png"],
    rating: 0,
    reviewCount: product.product_reviews?.length ?? 0,
    createdAt: product.created_at
  };
}
