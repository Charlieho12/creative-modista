"use client";

import { FormEvent, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatPeso, slugify } from "@/lib/utils";

export function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [message, setMessage] = useState("");

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = crypto.randomUUID();
    const name = String(form.get("name") ?? "");
    const price = Number(form.get("price") ?? 0);
    const category = String(form.get("category") ?? "Tops");
    let image = String(form.get("image") ?? "") || mockProducts[0].image;
    const imageFile = form.get("imageFile");
    const supabase = createClient();

    if (supabase && imageFile instanceof File && imageFile.size > 0) {
      const extension = imageFile.name.split(".").pop() ?? "jpg";
      const path = `${id}/${slugify(name)}.${extension}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, imageFile, { upsert: true });
      if (error) {
        setMessage(error.message);
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

    if (supabase) {
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
        return;
      }
      await supabase.from("product_images").insert({
        product_id: product.id,
        url: product.image,
        alt_text: product.name,
        sort_order: 0
      });
    }

    setProducts((current) => [product, ...current]);
    setMessage("Product saved. If Supabase is connected, it was added to the database.");
    event.currentTarget.reset();
  }

  async function updateProduct(product: Product, updates: Partial<Product>) {
    const nextProduct = { ...product, ...updates };
    const supabase = createClient();
    if (supabase && isUuid(product.id)) {
      await supabase
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
    }
    setProducts((current) => current.map((item) => (item.id === product.id ? nextProduct : item)));
  }

  async function removeProduct(product: Product) {
    const supabase = createClient();
    if (supabase && isUuid(product.id)) {
      await supabase.from("products").delete().eq("id", product.id);
    }
    setProducts((current) => current.filter((item) => item.id !== product.id));
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={addProduct} className="h-fit rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
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
        <Button type="submit" className="mt-5 w-full">
          <Save size={17} /> Save product
        </Button>
      </form>

      <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Manage products</h2>
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
      </section>
    </div>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
