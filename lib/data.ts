import { mockProducts } from "@/lib/products";
import { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

type DbProduct = {
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
  product_images?: { url: string; alt_text: string | null; sort_order: number }[];
};

function mapProduct(product: DbProduct): Product {
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
  const fallback = mockProducts[0].image;

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
    image: images[0]?.url ?? fallback,
    images: images.length ? images.map((image) => image.url) : [fallback],
    rating: 4.8,
    reviewCount: 0,
    createdAt: product.created_at
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  if (!supabase) {
    return mockProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt_text, sort_order)")
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return mockProducts;
  }

  return (data as DbProduct[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  if (!supabase) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt_text, sort_order)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return mockProducts.find((product) => product.slug === slug) ?? null;
  }

  return mapProduct(data as DbProduct);
}
