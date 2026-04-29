"use client";

import { useEffect, useState } from "react";
import { orderStatuses } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items?: { product_name: string; quantity: number; size: string; color: string }[];
};

export function OrdersClient() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient();
      if (!supabase) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("orders")
        .select("id, status, total, created_at, order_items(product_name, quantity, size, color)")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    }
    loadOrders();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow-sm">Loading orders...</div>;
  }

  if (needsLogin) {
    return (
      <EmptyState
        title="Login to track orders"
        description="Order tracking is tied to your Creative Modista account."
        action={<Button href="/auth/login">Login</Button>}
      />
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders to track"
        description="Your timeline will appear as soon as your first order is placed."
        action={<Button href="/products">Browse products</Button>}
      />
    );
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => {
        const currentIndex = orderStatuses.indexOf(order.status as never);
        const isCancelled = order.status === "cancelled";
        return (
          <article key={order.id} className="rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h2>
                <p className="mt-1 text-sm text-neutral-500">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold capitalize">{order.status.replaceAll("_", " ")}</p>
                <p className="text-sm text-neutral-500">{formatPeso(order.total)}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-7">
              {orderStatuses.map((status, index) => {
                const active = isCancelled ? status === "cancelled" : index <= currentIndex && status !== "cancelled";
                return (
                  <div key={status} className="flex items-center gap-2 md:block">
                    <div className={`size-4 rounded-full ${active ? "bg-blush-500" : "bg-blush-100"}`} />
                    <p className={`mt-0 text-xs font-semibold capitalize md:mt-2 ${active ? "text-ink" : "text-neutral-400"}`}>
                      {status.replaceAll("_", " ")}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-2 text-sm text-neutral-600">
              {order.order_items?.map((item) => (
                <p key={`${item.product_name}-${item.size}-${item.color}`}>
                  {item.quantity} x {item.product_name} ({item.size}, {item.color})
                </p>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
