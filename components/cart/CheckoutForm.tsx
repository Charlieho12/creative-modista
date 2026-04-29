"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/components/cart/CartProvider";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";

export function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery / manual confirmation");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) {
        setIsAuthenticated(false);
        return;
      }
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(Boolean(data.user));
      setName(data.user?.user_metadata?.full_name ?? "");
    }
    loadUser();
  }, []);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Connect Supabase before accepting live orders.");
      setLoading(false);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: auth.user.id,
        customer_name: name,
        contact_number: contact,
        shipping_address: address,
        payment_method: paymentMethod,
        subtotal,
        total: subtotal,
        status: "placed"
      })
      .select("id")
      .single();

    if (orderError || !order) {
      setMessage(orderError?.message ?? "Unable to place order.");
      setLoading(false);
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: isUuid(item.productId) ? item.productId : null,
        product_name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.salePrice ?? item.price,
        line_total: (item.salePrice ?? item.price) * item.quantity
      }))
    );

    if (itemsError) {
      setMessage(itemsError.message);
      setLoading(false);
      return;
    }

    clearCart();
    setMessage("Order placed. You can track progress from your account.");
    setLoading(false);
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a Creative Modista piece before checkout."
        action={<Button href="/products">Browse products</Button>}
      />
    );
  }

  if (isAuthenticated === false) {
    return (
      <EmptyState
        title="Login required before checkout"
        description="Creative Modista customers need an account so order progress and delivery details stay connected."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/auth/login">Login</Button>
            <Button href="/auth/signup" variant="secondary">
              Create account
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Shipping details</h2>
        <div className="mt-5 grid gap-4">
          <FormInput label="Customer name" value={name} onChange={setName} />
          <FormInput label="Contact number" value={contact} onChange={setContact} />
          <label className="block text-sm font-semibold">
            Shipping address
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              rows={4}
              className="mt-2 w-full rounded-lg border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
            />
          </label>
          <label className="block text-sm font-semibold">
            Payment method
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
            >
              <option>Cash on delivery / manual confirmation</option>
              <option>GCash placeholder</option>
              <option>Bank transfer placeholder</option>
            </select>
          </label>
        </div>
        {message ? <p className="mt-4 rounded-md bg-linen p-3 text-sm text-neutral-700">{message}</p> : null}
      </section>

      <aside className="h-fit rounded-lg border border-blush-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-4 grid gap-3 text-sm">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between gap-3">
              <span>
                {item.quantity} x {item.name}
              </span>
              <strong>{formatPeso((item.salePrice ?? item.price) * item.quantity)}</strong>
            </div>
          ))}
          <div className="border-t border-blush-100 pt-3">
            <div className="flex justify-between text-base">
              <span>Total</span>
              <strong>{formatPeso(subtotal)}</strong>
            </div>
          </div>
        </div>
        <Button type="submit" className="mt-5 w-full" disabled={loading || isAuthenticated === null}>
          {loading ? "Placing order..." : "Place order"}
        </Button>
        <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-blush-500">
          Return to cart
        </Link>
      </aside>
    </form>
  );
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function FormInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="mt-2 w-full rounded-full border border-blush-100 px-4 py-3 outline-none focus:border-blush-300"
      />
    </label>
  );
}
