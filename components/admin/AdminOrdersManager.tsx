"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { orderStatuses } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";

type AdminOrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type AdminOrder = {
  id: string;
  customer_name: string;
  contact_number: string;
  shipping_address: string;
  payment_method: string;
  status: string;
  subtotal: number;
  total: number;
  created_at: string;
  order_items?: AdminOrderItem[];
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const supabase = createClient();
      if (!supabase) {
        setMessage("Connect Supabase to view live orders. The admin UI is ready for order management.");
        return;
      }
      const { data, error } = await supabase
        .from("orders")
        .select("id, customer_name, contact_number, shipping_address, payment_method, status, subtotal, total, created_at, order_items(id, product_id, product_name, size, color, quantity, unit_price, line_total)")
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
    setSelectedOrder((current) => (current?.id === orderId ? { ...current, status } : current));
  }

  return (
    <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Order management</h2>
      {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-neutral-700">{message}</p> : null}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-blush-100 text-xs uppercase tracking-[0.14em] text-neutral-500">
            <tr>
              <th className="py-3">Order</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer border-b border-blush-50 align-top transition hover:bg-blush-50"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="py-4">
                  <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-xs text-neutral-500">{order.contact_number}</p>
                </td>
                <td className="max-w-xs">{order.shipping_address}</td>
                <td>
                  <p className="font-semibold">{order.order_items?.length ?? 0} item(s)</p>
                  <p className="max-w-48 truncate text-xs text-neutral-500">
                    {order.order_items?.map((item) => item.product_name).join(", ") || "No items"}
                  </p>
                </td>
                <td>{formatPeso(order.total)}</td>
                <td>
                  <select
                    value={order.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className={`rounded-full border px-3 py-2 font-semibold outline-none focus:border-blush-300 ${statusClassName(order.status)}`}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
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

      {selectedOrder ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-soft">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-blush-100 bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blush-500">Order details</p>
                <h3 className="mt-1 text-2xl font-semibold text-ink">Order #{selectedOrder.id.slice(0, 8)}</h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-blush-100 p-2 hover:bg-blush-50"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-6 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusClassName(selectedOrder.status)}`}>
                  {formatStatus(selectedOrder.status)}
                </span>
                <span className="text-sm text-neutral-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoBlock title="Customer" lines={[selectedOrder.customer_name, selectedOrder.contact_number]} />
                <InfoBlock title="Shipping address" lines={[selectedOrder.shipping_address]} />
                <InfoBlock title="Payment method" lines={[selectedOrder.payment_method]} />
                <InfoBlock title="Totals" lines={[`Subtotal: ${formatPeso(selectedOrder.subtotal)}`, `Total: ${formatPeso(selectedOrder.total)}`]} />
              </div>

              <section>
                <h4 className="text-lg font-semibold text-ink">Ordered items</h4>
                <div className="mt-3 grid gap-3">
                  {selectedOrder.order_items?.length ? (
                    selectedOrder.order_items.map((item) => (
                      <article key={item.id} className="rounded-lg border border-blush-100 p-4">
                        <div className="flex flex-wrap justify-between gap-3">
                          <div>
                            <p className="font-semibold text-ink">{item.product_name}</p>
                            <p className="mt-1 text-sm text-neutral-500">
                              Size: {item.size} / Color: {item.color}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p>{item.quantity} x {formatPeso(item.unit_price)}</p>
                            <p className="font-semibold text-ink">{formatPeso(item.line_total)}</p>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-lg bg-linen p-4 text-sm text-neutral-600">No order items were recorded for this order.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClassName(status: string) {
  switch (status) {
    case "placed":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "confirmed":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "preparing":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "ready_to_ship":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "shipped":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-700";
  }
}

function InfoBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg bg-linen p-4">
      <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">{title}</h4>
      <div className="mt-2 grid gap-1 text-sm text-ink">
        {lines.map((line) => (
          <p key={line}>{line || "Not provided"}</p>
        ))}
      </div>
    </div>
  );
}
