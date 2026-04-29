import type { Metadata } from "next";
import { AdminOrdersManager } from "@/components/admin/AdminOrdersManager";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "View Creative Modista orders and update order status."
};

export default function AdminOrdersPage() {
  return <AdminOrdersManager />;
}
