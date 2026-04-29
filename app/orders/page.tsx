import type { Metadata } from "next";
import { OrdersClient } from "@/components/account/OrdersClient";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Track Creative Modista order progress from placed to delivered."
};

export default function OrdersPage() {
  return (
    <div className="container-shell py-12">
      <h1 className="mb-3 font-serif text-4xl font-semibold text-ink">Order tracking</h1>
      <p className="mb-8 max-w-2xl text-sm leading-7 text-neutral-600">
        Follow order progress through placed, confirmed, preparing, ready to ship, shipped, delivered, or cancelled.
      </p>
      <OrdersClient />
    </div>
  );
}
