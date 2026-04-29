import type { Metadata } from "next";
import { Package, ShoppingBag, Star, Users } from "lucide-react";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage Creative Modista products, orders, featured items, and stock."
};

export default async function AdminPage() {
  const products = await getProducts();
  const stats = [
    { label: "Products", value: products.length, icon: Package },
    { label: "Featured", value: products.filter((item) => item.isFeatured).length, icon: Star },
    { label: "Best sellers", value: products.filter((item) => item.isBestSeller).length, icon: ShoppingBag },
    { label: "Customers", value: "Supabase", icon: Users }
  ];

  return (
    <div className="grid gap-5 md:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
          <stat.icon className="text-blush-500" size={24} />
          <p className="mt-4 text-3xl font-bold">{stat.value}</p>
          <h2 className="mt-1 text-sm font-semibold text-neutral-500">{stat.label}</h2>
        </article>
      ))}
    </div>
  );
}
