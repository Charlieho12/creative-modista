"use client";

import { useEffect, useState } from "react";
import { PackageCheck, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { formatPeso } from "@/lib/utils";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

type ProfileState = {
  email: string;
  name: string;
  contact: string;
  address: string;
};

export function AccountClient() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    async function loadAccount() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, contact_number, shipping_address")
        .eq("id", auth.user.id)
        .single();

      const { data: orderData } = await supabase
        .from("orders")
        .select("id, status, total, created_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

      setProfile({
        email: auth.user.email ?? "",
        name: profileData?.full_name ?? auth.user.user_metadata?.full_name ?? "",
        contact: profileData?.contact_number ?? "",
        address: profileData?.shipping_address ?? ""
      });
      setOrders((orderData ?? []) as OrderRow[]);
      setLoading(false);
    }

    loadAccount();
  }, []);

  if (loading) {
    return <div className="rounded-lg bg-white p-6 shadow-sm">Loading account...</div>;
  }

  if (!profile) {
    return (
      <EmptyState
        title="Login to view your account"
        description="Your profile, order history, and order tracking are available after login."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/auth/login">Login</Button>
            <Button href="/auth/signup" variant="secondary">Create account</Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <aside className="h-fit rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
        <UserRound className="text-blush-500" size={28} />
        <h2 className="mt-4 text-xl font-semibold">{profile.name || "Creative Modista customer"}</h2>
        <p className="mt-1 text-sm text-neutral-500">{profile.email}</p>
        <div className="mt-5 grid gap-3 text-sm text-neutral-700">
          <p><strong>Contact:</strong> {profile.contact || "Not set"}</p>
          <p><strong>Shipping:</strong> {profile.address || "Not set"}</p>
        </div>
        <div className="mt-5">
          <LogoutButton />
        </div>
      </aside>

      <section className="rounded-lg border border-blush-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <PackageCheck size={20} /> Order history
        </h2>
        {orders.length ? (
          <div className="mt-5 grid gap-3">
            {orders.map((order) => (
              <a key={order.id} href="/orders" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blush-100 p-4 hover:bg-blush-50">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold capitalize">{order.status.replaceAll("_", " ")}</p>
                  <p className="text-sm text-neutral-500">{formatPeso(order.total)}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState title="No orders yet" description="Your first Creative Modista order will appear here." action={<Button href="/products">Shop collection</Button>} />
        )}
      </section>
    </div>
  );
}
