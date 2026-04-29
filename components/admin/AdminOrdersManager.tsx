"use client";

import { useEffect, useState } from "react";
import { orderStatuses } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";

type AdminOrder = {
  id: string;
  customer_name: string;
  contact_number: string;
  shipping_address: string;
  status: string;
  total: number;
  created_at: string;
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient();
      if (!supabase) {
        setMessage("Connect Supabase to view live orders. The admin UI is ready for order management.");
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, contact_number, shipping_address, status, total, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        setMessage(error.message);
      } else {
        setOrders((data ?? []) as AdminOrder[]);
      }
    }
    loadOrders();
  }, []);

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) {
        setMessage(error.message);
        return;
      }
    }
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  }

  return (
    <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Order management</h2>
      {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-neutral-700">{message}</p> : null}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-blush-100 text-xs uppercase tracking-[0.14em] text-neutral-500">
            <tr>
              <th className="py-3">Order</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-blush-50 align-top">
                <td className="py-4">
                  <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-neutral-500">{order.contact_number}</p>
                </td>
                <td className="max-w-xs">{order.shipping_address}</td>
                <td>{formatPeso(order.total)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className="rounded-full border border-blush-100 px-3 py-2 outline-none focus:border-blush-300"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length ? <p className="py-8 text-center text-sm text-neutral-500">No live orders yet.</p> : null}
      </div>
    </section>
  );
}
