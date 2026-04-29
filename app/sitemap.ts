import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const routes = ["", "/about", "/products", "/cart", "/checkout", "/account", "/orders", "/contact", "/wishlist"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  return [
    ...routes,
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: new Date(product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
