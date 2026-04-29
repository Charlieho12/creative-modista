"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatPeso, slugify } from "@/lib/utils";

export function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      .select("*, product_images(url, alt_text, sort_order)")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      setProducts([]);
    } else {
      setProducts((data ?? []).map(mapAdminProduct));
    }

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
    let image = String(form.get("image") ?? "") || "/brand/creative-modista-logo.png";
    const imageFile = form.get("imageFile");
    const supabase = createClient();

    if (!supabase) {
      setMessage("Supabase is not configured. Product was not saved.");
      setSaving(false);
      return;
    }

    if (imageFile instanceof File && imageFile.size > 0) {
      const extension = imageFile.name.split(".").pop() ?? "jpg";
      const path = `${id}/${slugify(name)}.${extension}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { upsert: true });
      if (error) {
        setMessage(error.message);
        setSaving(false);
        return;
      }
      const publicUrl = supabase.storage.from("product-images").getPublicUrl(data.path);
      image = publicUrl.data.publicUrl;
    }

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
      images: [image],
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

    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: product.id,
      url: product.image,
      alt_text: product.name,
      sort_order: 0
    });

    if (imageError) {
      setMessage(imageError.message);
      setSaving(false);
      return;
    }

    setProducts((current) => [product, ...current]);
    setMessage("Product saved.");
    formElement.reset();
    setFormKey((key) => key + 1);
    setSaving(false);
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
            Upload product image
            <input
              name="imageFile"
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-2.5 text-sm outline-none focus:border-blush-300"
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
        <h2 className="text-xl font-semibold">Manage products</h2>
        {loading ? (
          <p className="mt-5 rounded-lg bg-linen p-4 text-sm text-neutral-700">Loading live products...</p>
        ) : products.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-blush-100 text-xs uppercase tracking-[0.14em] text-neutral-500">
                <tr>
                  <th className="py-3">Product</th>
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
                    <td className="py-4 font-semibold">{product.name}</td>
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
    reviewCount: 0,
    createdAt: product.created_at
  };
}
