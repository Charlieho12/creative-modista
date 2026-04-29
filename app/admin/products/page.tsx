import type { Metadata } from "next";
import { AdminProductManager } from "@/components/admin/AdminProductManager";

export const metadata: Metadata = {
  title: "Admin Products",
  description: "Add, edit, delete, and manage Creative Modista products."
};

export default function AdminProductsPage() {
  return <AdminProductManager />;
}
